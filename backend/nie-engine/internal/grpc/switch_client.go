package grpc

import (
	"context"
	"fmt"
)

// SwitchCommand represents the payload sent to the SIM Service
type SwitchCommand struct {
	SessionID     string
	TargetIMSI    string
	TargetCarrier string
	Reason        string
}

// SIMServiceClient defines the contract for communicating with the SIM/eSIM Service
type SIMServiceClient interface {
	ExecuteSwitch(ctx context.Context, cmd SwitchCommand) error
}

// MockSIMClient provides a mock implementation for development without the SIM service
// In production, this will use grpc.Dial and the generated protobuf stubs.
type MockSIMClient struct{}

// ExecuteSwitch simulates an RPC call to the SIM service to execute a physical or eSIM swap
func (m *MockSIMClient) ExecuteSwitch(ctx context.Context, cmd SwitchCommand) error {
	fmt.Printf("[gRPC] Sending SwitchCommand to SIM Service:\n")
	fmt.Printf("       -> Target IMISI: %s, Carrier: %s, Reason: %s\n", cmd.TargetIMSI, cmd.TargetCarrier, cmd.Reason)
	// A real implementation would convert `cmd` to the protobuf equivalent and call the service
	return nil
}
