package store

import (
	"context"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

// SessionState represents the state of a device tunnel
type SessionState struct {
	DeviceID      string `json:"device_id"`
	ConnectionID  string `json:"connection_id"`
	ActivePoP     string `json:"active_pop"`
	LastKeepalive int64  `json:"last_keepalive"`
}

// SessionStore defines the contract for Redis session management
type SessionStore interface {
	SaveSession(ctx context.Context, session SessionState, ttl time.Duration) error
	GetSession(ctx context.Context, deviceID string) (*SessionState, error)
	DeleteSession(ctx context.Context, deviceID string) error
}

// RedisSessionStore implements SessionStore using go-redis
type RedisSessionStore struct {
	client *redis.Client
}

func NewRedisSessionStore(client *redis.Client) *RedisSessionStore {
	return &RedisSessionStore{
		client: client,
	}
}

func getSessionKey(deviceID string) string {
	return fmt.Sprintf("relay:session:%s", deviceID)
}

// SaveSession persists the tunnel state. This enables cross-PoP failover if one server goes down.
func (s *RedisSessionStore) SaveSession(ctx context.Context, session SessionState, ttl time.Duration) error {
	key := getSessionKey(session.DeviceID)
	// Storing as a simple hash for quick retrieval of specific fields if needed
	fields := map[string]interface{}{
		"connection_id":  session.ConnectionID,
		"active_pop":     session.ActivePoP,
		"last_keepalive": session.LastKeepalive,
	}
	
	// Use pipeline for atomicity
	pipe := s.client.Pipeline()
	pipe.HSet(ctx, key, fields)
	pipe.Expire(ctx, key, ttl)
	
	_, err := pipe.Exec(ctx)
	if err != nil {
		return fmt.Errorf("failed to save session to redis: %w", err)
	}
	return nil
}

// GetSession retrieves the tunnel state when a device reconnects to a new PoP
func (s *RedisSessionStore) GetSession(ctx context.Context, deviceID string) (*SessionState, error) {
	key := getSessionKey(deviceID)
	
	vals, err := s.client.HGetAll(ctx, key).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to get session: %w", err)
	}
	
	if len(vals) == 0 {
		return nil, redis.Nil // Session not found
	}

	var keepalive int64
	fmt.Sscanf(vals["last_keepalive"], "%d", &keepalive)

	return &SessionState{
		DeviceID:      deviceID,
		ConnectionID:  vals["connection_id"],
		ActivePoP:     vals["active_pop"],
		LastKeepalive: keepalive,
	}, nil
}

// DeleteSession cleans up the state when a tunnel is gracefully closed
func (s *RedisSessionStore) DeleteSession(ctx context.Context, deviceID string) error {
	return s.client.Del(ctx, getSessionKey(deviceID)).Err()
}
