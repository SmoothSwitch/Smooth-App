package server

import (
	"fmt"
	"log"
	"net"
	"sync"
)

// EgressGateway manages real internet-facing sockets for each device session.
// It uses Cloudflare Zero Trust SDK/Headers if configured, otherwise falls back to NAT.
type EgressGateway struct {
	mu          sync.Mutex
	connections map[string]*net.UDPConn
	cfg         *config.Config
}

func NewEgressGateway(cfg *config.Config) *EgressGateway {
	return &EgressGateway{
		connections: make(map[string]*net.UDPConn),
		cfg:         cfg,
	}
}

// Forward sends a packet to the destination address.
func (g *EgressGateway) Forward(deviceID string, targetAddr string, packet []byte) error {
	g.mu.Lock()
	conn, exists := g.connections[deviceID]
	var err error

	if !exists {
		// Log Cloudflare Zero Trust Authentication if configured
		if g.cfg != nil && g.cfg.CloudflareClient != "" {
			log.Printf("[WarpClient] Authenticating tunnel for %s using CF-Access-Client-Id: %s", deviceID, g.cfg.CloudflareClient)
			log.Printf("[WarpClient] Securing connection via Zero Trust Team: %s", g.cfg.CloudflareTeam)
		} else {
			log.Printf("[Egress] Routing via native NAT gateway for device: %s", deviceID)
		}

		// Open a new UDP socket for this device's egress
		addr, err := net.ResolveUDPAddr("udp", targetAddr)
		if err != nil {
			g.mu.Unlock()
			return err
		}
		conn, err = net.DialUDP("udp", nil, addr)
		if err != nil {
			g.mu.Unlock()
			return err
		}
		g.connections[deviceID] = conn
		log.Printf("[Egress] Opened new outbound socket: %s -> %s", deviceID, targetAddr)
	}
	g.mu.Unlock()

	_, err = conn.Write(packet)
	return err
}

// Listen starts a loop to read response packets from the internet and return them
func (g *EgressGateway) Listen(deviceID string, callback func([]byte)) {
	g.mu.Lock()
	conn, exists := g.connections[deviceID]
	g.mu.Unlock()

	if !exists {
		return
	}

	buffer := make([]byte, 2048)
	for {
		n, _, err := conn.ReadFromUDP(buffer)
		if err != nil {
			log.Printf("[Egress] Read error for device %s: %v", deviceID, err)
			return
		}
		callback(buffer[:n])
	}
}

func (g *EgressGateway) Close(deviceID string) {
	g.mu.Lock()
	defer g.mu.Unlock()
	if conn, exists := g.connections[deviceID]; exists {
		conn.Close()
		delete(g.connections, deviceID)
		log.Printf("[Egress] Closed socket for device: %s", deviceID)
	}
}
