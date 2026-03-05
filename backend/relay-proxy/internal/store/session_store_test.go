package store

import (
	"context"
	"testing"
	"time"

	"github.com/go-redis/redis/v8"
)

// TestMockedSessionStore provides basic coverage. 
// A full test would use miniredis or testcontainers.
func TestSessionStore_SaveAndGet(t *testing.T) {
	// Skip actual redis connection in unit test without mock/miniredis
	t.Skip("Requires active Redis or miniredis mock")
	
	ctx := context.Background()
	client := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	defer client.Close()
	
	store := NewRedisSessionStore(client)
	
	session := SessionState{
		DeviceID:      "device-123",
		ConnectionID:  "conn-abc",
		ActivePoP:     "Lagos-1",
		LastKeepalive: time.Now().Unix(),
	}
	
	err := store.SaveSession(ctx, session, 1*time.Minute)
	if err != nil {
		t.Fatalf("Failed to save session: %v", err)
	}
	
	retrieved, err := store.GetSession(ctx, "device-123")
	if err != nil {
		t.Fatalf("Failed to retrieve session: %v", err)
	}
	
	if retrieved.ConnectionID != session.ConnectionID {
		t.Errorf("Expected connection %s, got %s", session.ConnectionID, retrieved.ConnectionID)
	}
}
