package server

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/quic-go/quic-go"
	"smoothswitch/relay-proxy/internal/buffer"
	"smoothswitch/relay-proxy/internal/config"
	"smoothswitch/relay-proxy/internal/store"
)

// RelayServer defines the QUIC server structure
type RelayServer struct {
	addr        string
	tlsConfig   *tls.Config
	store       store.SessionStore
	buffers     map[string]*buffer.SessionBuffer
	buffersMu   sync.RWMutex
	gateway     *EgressGateway
	cfg         *config.Config
}

// NewRelayServer creates a new instance of the relay proxy QUIC server
func NewRelayServer(addr string, tlsConfig *tls.Config, s store.SessionStore, cfg *config.Config) *RelayServer {
	return &RelayServer{
		addr:       addr,
		tlsConfig:  tlsConfig,
		store:      s,
		buffers:    make(map[string]*buffer.SessionBuffer),
		gateway:    NewEgressGateway(),
		cfg:        cfg,
	}
}

// Start listens for incoming QUIC connections and handles them
func (s *RelayServer) Start(ctx context.Context) error {
	// If Cloudflare credentials are provided, log the intent
	if s.cfg.CloudflareToken != "" {
		log.Printf("[Relay] Cloudflare Zero Trust detected. Initializing WARP SDK for team: %s", s.cfg.CloudflareTeam)
	} else {
		log.Println("[Relay] No Cloudflare credentials. Operating in Native Egress mode.")
	}

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
	remoteAddr := conn.RemoteAddr().String()
	log.Printf("[Relay] Accepted connection from %s", remoteAddr)

	// DeviceID is normally validated via TLS Peer Certificates
	deviceID := "mock-device-123"

	// 1. Get or Create Session Buffer
	s.buffersMu.Lock()
	sb, exists := s.buffers[deviceID]
	if !exists {
		sb = buffer.NewSessionBuffer()
		s.buffers[deviceID] = sb
	}
	s.buffersMu.Unlock()

	// 2. Register Session in Redis
	err := s.store.SaveSession(ctx, store.SessionState{
		DeviceID:      deviceID,
		ConnectionID:  remoteAddr,
		ActivePoP:     "Lagos-01",
		LastKeepalive: time.Now().Unix(),
	}, 1*time.Hour)
	if err != nil {
		log.Printf("[Relay] Failed to save session state: %v", err)
	}

	// 3. Start Dispatcher with the appropriate gateway logic
	// (Warp logic will be branched here in Phase 2)
	dispatcher := NewDispatcher(ctx, deviceID, conn, sb, s.gateway)
	log.Printf("[Relay] Real-time dispatcher started for device %s", deviceID)
	dispatcher.Start()

	// 4. Wait for connection close
	select {
	case <-conn.Context().Done():
		log.Printf("[Relay] Connection closed for device %s", deviceID)
		dispatcher.Stop()
	case <-ctx.Done():
		dispatcher.Stop()
	}
}
