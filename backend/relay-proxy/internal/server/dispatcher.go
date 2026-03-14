package server

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/quic-go/quic-go"
	"smoothswitch/relay-proxy/internal/buffer"
)

// Dispatcher bridges QUIC data streams to the real internet via EgressGateway
type Dispatcher struct {
	mu       sync.Mutex
	conn     quic.Connection
	buffer   *buffer.SessionBuffer
	gateway  *EgressGateway
	deviceID string
	ctx      context.Context
	cancel   context.CancelFunc
}

func NewDispatcher(parentCtx context.Context, deviceID string, conn quic.Connection, sb *buffer.SessionBuffer, gateway *EgressGateway) *Dispatcher {
	ctx, cancel := context.WithCancel(parentCtx)
	return &Dispatcher{
		conn:     conn,
		buffer:   sb,
		gateway:  gateway,
		deviceID: deviceID,
		ctx:      ctx,
		cancel:   cancel,
	}
}

// Start initiates the bi-directional pump
func (d *Dispatcher) Start() {
	// Drain existing buffer first (essential for session continuity)
	d.drainToConnection()

	// 1. Inbound Loop: QUIC Datagrams -> Internet (via Gateway)
	go d.readFromQuic()

	// 2. Outbound Loop: Internet -> QUIC Datagrams
	// We use the gateway's listen capability
	go d.gateway.Listen(d.deviceID, func(data []byte) {
		err := d.conn.SendMessage(data)
		if err != nil {
			log.Printf("[Dispatcher] Outbound Send error: %v, buffering...", err)
			d.buffer.Enqueue(buffer.Packet{
				Data:      data,
				Timestamp: time.Now(),
				IsVideo:   len(data) > 1500,
			})
		}
	})
}

func (d *Dispatcher) Stop() {
	d.cancel()
	d.gateway.Close(d.deviceID)
}

func (d *Dispatcher) drainToConnection() {
	packets := d.buffer.Drain()
	if len(packets) > 0 {
		log.Printf("[Dispatcher] Draining %d buffered packets for device %s", len(packets), d.deviceID)
		for _, p := range packets {
			d.conn.SendMessage(p.Data)
		}
	}
}

func (d *Dispatcher) readFromQuic() {
	// For Phase 1, we hardcode an egress target (e.g. dummy VoIP server)
	// In production, the target is extracted from the packet or session metadata.
	targetHost := "8.8.8.8:53" // Example: Forwarding to DNS for real-time testing

	for {
		select {
		case <-d.ctx.Done():
			return
		default:
			data, err := d.conn.ReceiveMessage(d.ctx)
			if err != nil {
				return
			}
			// Forward real traffic to the wire
			err = d.gateway.Forward(d.deviceID, targetHost, data)
			if err != nil {
				log.Printf("[Dispatcher] Egress Forward error: %v", err)
			}
		}
	}
}
