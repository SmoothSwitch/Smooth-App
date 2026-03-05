package engine

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type MNO string

const (
	MTN     MNO = "MTN"
	GLO     MNO = "GLO"
	AIRTEL  MNO = "AIRTEL"
	NMOBILE MNO = "9MOBILE"
)

var RegisteredMNOs = []MNO{MTN, GLO, AIRTEL, NMOBILE}

type PollResult struct {
	Network MNO
	Signal  float64
	Speed   float64
	Latency float64
	Cost    float64
	Error   error
}

// LockManager defines the interface for distributed concurrency locks (e.g., Redis)
type LockManager interface {
	AcquireLock(ctx context.Context, key string, ttl time.Duration) (bool, error)
	ReleaseLock(ctx context.Context, key string) error
}

type Engine struct {
	lockManager LockManager
}

func NewEngine(lm LockManager) *Engine {
	return &Engine{lockManager: lm}
}

// StartPolling initiates the 10-second polling loop
func (e *Engine) StartPolling(ctx context.Context) {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			e.pollAllNetworks(ctx)
		}
	}
}

// pollAllNetworks executes a single polling cycle across all MNOs simultaneously
func (e *Engine) pollAllNetworks(ctx context.Context) {
	// Attempt to acquire Redis-based distributed lock to prevent double-polling across pods
	locked, err := e.lockManager.AcquireLock(ctx, "nie:polling_lock", 8*time.Second)
	if err != nil || !locked {
		// Another instance is polling, skip this cycle
		return
	}
	defer e.lockManager.ReleaseLock(ctx, "nie:polling_lock")

	var wg sync.WaitGroup
	// Buffered channel to prevent goroutine leaks if processor is slow
	results := make(chan PollResult, len(RegisteredMNOs))

	for _, mno := range RegisteredMNOs {
		wg.Add(1)
		go func(network MNO) {
			defer wg.Done()
			res := e.pollSingleNetwork(ctx, network)
			results <- res
		}(mno)
	}

	// Wait for all goroutines to finish
	wg.Wait()
	close(results)

	// Process all results concurrently collected
	for res := range results {
		if res.Error != nil {
			fmt.Printf("Error polling %s: %v\n", res.Network, res.Error)
			continue
		}
		// In a real scenario, this calculates QualityScore and writes to Redis
		fmt.Printf("Polled %s: Signal=%.2f, Speed=%.2f, Latency=%.2f\n", res.Network, res.Signal, res.Speed, res.Latency)
	}
}

// pollSingleNetwork simulates polling an MNO's adapter
func (e *Engine) pollSingleNetwork(ctx context.Context, mno MNO) PollResult {
	// Simulated API call duration
	time.Sleep(200 * time.Millisecond)

	return PollResult{
		Network: mno,
		Signal:  0.8,
		Speed:   0.9,
		Latency: 50.0,
		Cost:    0.5,
		Error:   nil,
	}
}
