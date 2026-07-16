package main

import (
	"context"
	"log"
	"net"
	"os"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	pb "github.com/smoothswitch/sim-service/proto"
	"github.com/smoothswitch/sim-service/service"
)

type switchServer struct {
	pb.UnimplementedSwitchServiceServer
}

func (s *switchServer) ExecuteSwitch(ctx context.Context, req *pb.SwitchCommand) (*pb.SwitchResult, error) {
	log.Printf("Received SwitchCommand for SessionID: %s -> Route: %s", req.SessionId, req.SimType)

	// Context with timeout (e.g., 10 seconds for RSP)
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	if req.SimType == "esim" {
		return service.ExecuteEsimSwitch(ctx, req), nil
	}

	// Default to physical
	return service.ExecutePhysicalSwitch(ctx, req), nil
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "50051"
	}

	lis, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterSwitchServiceServer(s, &switchServer{})
	
	// Register reflection service on gRPC server so clients can interact with it easily
	reflection.Register(s)

	log.Printf("SIM service listening on :%s", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
