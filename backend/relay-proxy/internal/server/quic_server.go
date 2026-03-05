package server

import (
	"context"
	"crypto/tls"
	"fmt"
	"github.com/quic-go/quic-go"
	"log"
)

// RelayServer defines the QUIC server structure
type RelayServer struct {
	addr      string
	tlsConfig *tls.Config
}

// NewRelayServer creates a new instance of the relay proxy QUIC server
func NewRelayServer(addr string, tlsConfig *tls.Config) *RelayServer {
	return &RelayServer{
		addr:      addr,
		tlsConfig: tlsConfig,
	}
}

// Start listens for incoming QUIC connections and handles them
func (s *RelayServer) Start(ctx context.Context) error {
	listener, err := quic.ListenAddr(s.addr, s.tlsConfig, &quic.Config{
		EnableDatagrams: true, // Required for fast lossy packet handling (audio/video)
		KeepAlivePeriod: 5 * time.Second,
	})
	if err != nil {
		return fmt.Errorf("failed to start QUIC listener: %w", err)
	}

	log.Printf("[Relay] QUIC Server listening on %s (TLS 1.3)", s.addr)

	for {
		conn, err := listener.Accept(ctx)
		if err != nil {
			log.Printf("[Relay] Failed to accept connection: %v", err)
			continue
		}

		go s.handleConnection(ctx, conn)
	}
}

func (s *RelayServer) handleConnection(ctx context.Context, conn quic.Connection) {
	log.Printf("[Relay] Accepted connection from %s", conn.RemoteAddr())
	// In QUIC, connections are identified by Connection IDs, so IP changes are handled transparently
	// Phase 1 MVP: Using Cloudflare WARP handles the heavy lifting of maintaining tunnels,
	// but this structure will manage our eventual self-hosted termination.
}
