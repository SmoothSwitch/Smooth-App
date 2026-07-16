package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smoothswitch/auth-service/services"
)

// RegisterRequest represents the JSON body for user registration
type RegisterRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Phone    string `json:"phone"    binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

// LoginRequest represents the JSON body for login
type LoginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// VerifyTwoFactorRequest represents the JSON body for 2FA verification
type VerifyTwoFactorRequest struct {
	MFAToken string `json:"mfa_token"  binding:"required"`
	TOTPCode string `json:"totp_code"  binding:"required"`
}

// LogoutRequest represents the JSON body for logout
type LogoutRequest struct {
	UserID       string `json:"user_id"       binding:"required"`
	RefreshToken string `json:"refresh_token"  binding:"required"`
}

// Register handles POST /auth/register
func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email, phone, and password (min 8 chars) are required"})
		return
	}

	userId, totpSetupUrl, err := services.RegisterUser(req.Email, req.Phone, req.Password)
	if err != nil {
		switch err.Error() {
		case "EMAIL_OR_PHONE_ALREADY_EXISTS":
			c.JSON(http.StatusConflict, gin.H{"error": "An account with this email or phone already exists"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Registration failed. Please try again."})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"user_id":        userId,
		"totp_setup_url": totpSetupUrl,
		"message":        "Registration successful.",
	})
}

// Login handles POST /auth/login
func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
		return
	}

	mfaToken, err := services.LoginUser(req.Email, req.Password)
	if err != nil {
		switch err.Error() {
		case "INVALID_CREDENTIALS":
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		case "ACCOUNT_LOCKED":
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Account locked. Try again in 30 minutes."})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Login failed. Please try again."})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"mfa_token": mfaToken,
		"message":   "Credentials valid. Please complete 2FA verification.",
	})
}

// VerifyTwoFactor handles POST /auth/verify-2fa
func VerifyTwoFactor(c *gin.Context) {
	var req VerifyTwoFactorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mfa_token and totp_code are required"})
		return
	}

	accessToken, refreshToken, err := services.VerifyTwoFactor(req.MFAToken, req.TOTPCode)
	if err != nil {
		switch err.Error() {
		case "MFA_TOKEN_EXPIRED":
			c.JSON(http.StatusUnauthorized, gin.H{"error": "MFA token expired. Please log in again."})
		case "INVALID_TOTP_CODE":
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid 2FA code. Please try again."})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "2FA verification failed."})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
		"token_type":    "Bearer",
		"expires_in":    900,
	})
}

// Logout handles POST /auth/logout
func Logout(c *gin.Context) {
	var req LogoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id and refresh_token are required"})
		return
	}

	err := services.LogoutUser(req.UserID, req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Logout failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
