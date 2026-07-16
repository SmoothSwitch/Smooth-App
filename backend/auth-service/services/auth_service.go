package services

import (
	"context"
	"crypto/rand"
	"crypto/subtle"
	"database/sql"
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/pquerna/otp/totp"
	"github.com/smoothswitch/auth-service/models"
	"github.com/smoothswitch/auth-service/utils"
	"golang.org/x/crypto/argon2"
)

type params struct {
	memory      uint32
	iterations  uint32
	parallelism uint8
	saltLength  uint32
	keyLength   uint32
}

var argonParams = params{
	memory:      65536,
	iterations:  3,
	parallelism: 4,
	saltLength:  16,
	keyLength:   32,
}

func HashPassword(password string) (string, error) {
	salt := make([]byte, argonParams.saltLength)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	hash := argon2.IDKey([]byte(password), salt, argonParams.iterations, argonParams.memory, argonParams.parallelism, argonParams.keyLength)

	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	// Format: $argon2id$v=19$m=65536,t=3,p=4$salt$hash
	encoded := fmt.Sprintf("$argon2id$v=19$m=%d,t=%d,p=%d$%s$%s",
		argonParams.memory, argonParams.iterations, argonParams.parallelism, b64Salt, b64Hash)

	return encoded, nil
}

func VerifyPassword(password, encodedHash string) (bool, error) {
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 {
		return false, errors.New("invalid hash format")
	}

	if parts[1] != "argon2id" {
		return false, errors.New("incompatible variant")
	}

	var version int
	_, err := fmt.Sscanf(parts[2], "v=%d", &version)
	if err != nil {
		return false, err
	}
	if version != 19 {
		return false, errors.New("incompatible version")
	}

	var memory, iterations uint32
	var parallelism uint8
	_, err = fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &memory, &iterations, &parallelism)
	if err != nil {
		return false, err
	}

	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return false, err
	}

	decodedHash, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil {
		return false, err
	}

	hash := argon2.IDKey([]byte(password), salt, iterations, memory, parallelism, uint32(len(decodedHash)))

	if subtle.ConstantTimeCompare(decodedHash, hash) == 1 {
		return true, nil
	}

	return false, nil
}

type UserClaims struct {
	Scopes []string `json:"scopes,omitempty"`
	jwt.RegisteredClaims
}

// RegisterUser registers a new user with Argon2id password hashing and TOTP secret generation
func RegisterUser(email, phone, password string) (string, string, error) {
	ctx := context.Background()

	// Check if user already exists
	var existingID string
	err := models.DB.QueryRowContext(ctx, "SELECT user_id FROM users WHERE email = $1 OR phone = $2", email, phone).Scan(&existingID)
	if err == nil {
		return "", "", errors.New("EMAIL_OR_PHONE_ALREADY_EXISTS")
	} else if err != sql.ErrNoRows {
		return "", "", err
	}

	// Hash password
	passwordHash, err := HashPassword(password)
	if err != nil {
		return "", "", err
	}

	// Generate TOTP Secret
	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "SmoothSwitch",
		AccountName: email,
		Period:      30,
	})
	if err != nil {
		return "", "", err
	}

	totpSecret := key.Secret()
	totpSetupUrl := key.URL()

	// Create user
	userId := uuid.NewString()
	_, err = models.DB.ExecContext(ctx,
		"INSERT INTO users (user_id, email, phone, password_hash, totp_secret, created_at) VALUES ($1, $2, $3, $4, $5, NOW())",
		userId, email, phone, passwordHash, totpSecret,
	)
	if err != nil {
		return "", "", err
	}

	return userId, totpSetupUrl, nil
}

// LoginUser authenticates the user and returns an MFA token
func LoginUser(email, password string) (string, error) {
	ctx := context.Background()

	// Check lockout
	lockKey := fmt.Sprintf("lockout:%s", email)
	isLocked, err := utils.RedisClient.Get(ctx, lockKey).Result()
	if err == nil && isLocked == "1" {
		return "", errors.New("ACCOUNT_LOCKED")
	}

	// Get user
	var userId, passwordHash string
	err = models.DB.QueryRowContext(ctx, "SELECT user_id, password_hash FROM users WHERE email = $1 AND deleted_at IS NULL", email).Scan(&userId, &passwordHash)
	if err == sql.ErrNoRows {
		return "", errors.New("INVALID_CREDENTIALS")
	} else if err != nil {
		return "", err
	}

	// Verify password
	valid, err := VerifyPassword(password, passwordHash)
	if err != nil || !valid {
		// Track failed attempts
		failKey := fmt.Sprintf("failures:%s", email)
		failures, err := utils.RedisClient.Incr(ctx, failKey).Result()
		if err == nil {
			utils.RedisClient.Expire(ctx, failKey, 15*time.Minute)
			if failures >= 5 {
				utils.RedisClient.Set(ctx, lockKey, "1", 30*time.Minute)
				utils.RedisClient.Del(ctx, failKey)
				return "", errors.New("ACCOUNT_LOCKED")
			}
		}
		return "", errors.New("INVALID_CREDENTIALS")
	}

	// Reset failure count on success
	utils.RedisClient.Del(ctx, fmt.Sprintf("failures:%s", email))

	// Issue temporary MFA token valid for 5 minutes (300 seconds)
	mfaToken := uuid.NewString()
	err = utils.RedisClient.Set(ctx, fmt.Sprintf("mfa:%s", mfaToken), userId, 5*time.Minute).Err()
	if err != nil {
		return "", err
	}

	return mfaToken, nil
}

// VerifyTwoFactor validates the TOTP code and returns JWT Access and Refresh tokens
func VerifyTwoFactor(mfaToken, totpCode string) (string, string, error) {
	ctx := context.Background()

	// Get user ID from MFA token
	mfaKey := fmt.Sprintf("mfa:%s", mfaToken)
	userId, err := utils.RedisClient.Get(ctx, mfaKey).Result()
	if err != nil {
		return "", "", errors.New("MFA_TOKEN_EXPIRED")
	}

	// Get user's TOTP secret
	var totpSecret string
	err = models.DB.QueryRowContext(ctx, "SELECT totp_secret FROM users WHERE user_id = $1", userId).Scan(&totpSecret)
	if err == sql.ErrNoRows {
		return "", "", errors.New("USER_NOT_FOUND")
	} else if err != nil {
		return "", "", err
	}

	// Validate TOTP
	isValid := totp.Validate(totpCode, totpSecret)
	if !isValid {
		return "", "", errors.New("INVALID_TOTP_CODE")
	}

	// Delete temporary MFA token
	utils.RedisClient.Del(ctx, mfaKey)

	// Issue JWT tokens
	accessJti := uuid.NewString()
	refreshJti := uuid.NewString()

	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	jwtRefreshSecret := []byte(os.Getenv("JWT_REFRESH_SECRET"))

	accessTokenClaims := UserClaims{
		Scopes: []string{"wallet:read", "wallet:write", "network:read", "sim:manage"},
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userId,
			ID:        accessJti,
			Issuer:    "smooth-switch",
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
		},
	}
	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims).SignedString(jwtSecret)
	if err != nil {
		return "", "", err
	}

	refreshTokenClaims := UserClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userId,
			ID:        refreshJti,
			Issuer:    "smooth-switch",
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
		},
	}
	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims).SignedString(jwtRefreshSecret)
	if err != nil {
		return "", "", err
	}

	// Session management in Redis
	sessionsKey := fmt.Sprintf("sessions:%s", userId)
	utils.RedisClient.SAdd(ctx, sessionsKey, refreshJti)
	sessionCount, err := utils.RedisClient.SCard(ctx, sessionsKey).Result()
	if err == nil && sessionCount > 5 {
		// Pop the oldest (or random in a set, but pop is simple and works)
		oldestJti, err := utils.RedisClient.SPop(ctx, sessionsKey).Result()
		if err == nil && oldestJti != "" {
			// Add to blocklist for 7 days (604800 seconds)
			utils.RedisClient.Set(ctx, fmt.Sprintf("blocklist:%s", oldestJti), "1", 7*24*time.Hour)
		}
	}

	return accessToken, refreshToken, nil
}

// LogoutUser invalidates the refresh token JTI
func LogoutUser(userId, refreshToken string) error {
	ctx := context.Background()
	jwtRefreshSecret := []byte(os.Getenv("JWT_REFRESH_SECRET"))

	token, err := jwt.ParseWithClaims(refreshToken, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtRefreshSecret, nil
	})
	if err != nil {
		return nil // Already invalid
	}

	if claims, ok := token.Claims.(*UserClaims); ok && token.Valid {
		jti := claims.ID
		// Add to blocklist for 7 days
		utils.RedisClient.Set(ctx, fmt.Sprintf("blocklist:%s", jti), "1", 7*24*time.Hour)
		// Remove from active sessions
		utils.RedisClient.SRem(ctx, fmt.Sprintf("sessions:%s", userId), jti)
	}

	return nil
}
