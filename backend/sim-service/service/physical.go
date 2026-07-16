package service

import (
	"context"
	"log"
	"time"

	pb "github.com/smoothswitch/sim-service/proto"
)

// ExecutePhysicalSwitch simulates a physical SIM switch
func ExecutePhysicalSwitch(ctx context.Context, req *pb.SwitchCommand) *pb.SwitchResult {
	log.Printf("[Physical SIM] Initiating switch to carrier %s for IMSI %s", req.TargetCarrier, req.TargetImsi)
	startTime := time.Now()

	delay := 5 * time.Second

	select {
	case <-time.After(delay):
		duration := time.Since(startTime)
		log.Printf("[Physical SIM] Switch complete for IMSI %s in %d ms", req.TargetImsi, duration.Milliseconds())
		return &pb.SwitchResult{
			Success:    true,
			DurationMs: int32(duration.Milliseconds()),
		}
	case <-ctx.Done():
		log.Printf("[Physical SIM] Switch interrupted")
		return &pb.SwitchResult{
			Success:      false,
			ErrorMessage: "Switch interrupted: " + ctx.Err().Error(),
		}
	}
}
