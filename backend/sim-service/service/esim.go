package service

import (
	"context"
	"fmt"
	"log"
	"time"

	pb "github.com/smoothswitch/sim-service/proto"
)

// ExecuteEsimSwitch simulates an eSIM profile switch
func ExecuteEsimSwitch(ctx context.Context, req *pb.SwitchCommand) *pb.SwitchResult {
	log.Printf("[eSIM] Initiating switch to carrier %s via SM-DP+", req.TargetCarrier)
	startTime := time.Now()

	// Call MNO SM-DP+ enableProfile(iccid) via REST
	// Simulated network delay
	delay := 2 * time.Second

	select {
	case <-time.After(delay):
		duration := time.Since(startTime)
		log.Printf("[eSIM] Switch complete in %d ms", duration.Milliseconds())
		return &pb.SwitchResult{
			Success:    true,
			DurationMs: int32(duration.Milliseconds()),
		}
	case <-ctx.Done():
		log.Printf("[eSIM] Switch timed out or canceled, triggering rollback.")
		handleRollback(req)
		return &pb.SwitchResult{
			Success:      false,
			ErrorMessage: fmt.Sprintf("Timeout or canceled: %v", ctx.Err()),
		}
	}
}

func handleRollback(req *pb.SwitchCommand) {
	log.Printf("[Rollback] Reverting default profile to previous carrier configuration for %s...", req.TargetImsi)
	// Logic: disableProfile(new) + enableProfile(old)
}
