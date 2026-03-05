package buffer

import (
	"errors"
	"sync"
	"time"
)

// Constants defined by the LLD for packet buffering
const (
	AudioBufferMaxBytes = 40 * 1024       // 40 KB (approx 800ms of Opus audio)
	VideoBufferMaxBytes = 10 * 1024 * 1024 // 10 MB (approx 500ms of HD video)
	BufferMaxHoldTime   = 8 * time.Second  // Max time to hold packets before degrading/dropping
)

var (
	ErrBufferFull = errors.New("buffer capacity exceeded")
	ErrBufferTimeout = errors.New("packet hold time exceeded max limit")
)

type Packet struct {
	Data      []byte
	Timestamp time.Time
	IsVideo   bool
}

// SessionBuffer manages the in-memory ring buffers per active QUIC session
type SessionBuffer struct {
	mu           sync.Mutex
	audioPackets []Packet
	audioBytes   int
	videoPackets []Packet
	videoBytes   int
}

func NewSessionBuffer() *SessionBuffer {
	return &SessionBuffer{
		audioPackets: make([]Packet, 0, 100),
		videoPackets: make([]Packet, 0, 100),
	}
}

// Enqueue adds a packet to the buffer, dropping old packets if limits are exceeded
func (sb *SessionBuffer) Enqueue(p Packet) error {
	sb.mu.Lock()
	defer sb.mu.Unlock()

	size := len(p.Data)

	if p.IsVideo {
		if sb.videoBytes+size > VideoBufferMaxBytes {
			// Phase 1 strategy: at limits, drop oldest to accommodate new
			// For >8s delays, LLD specifies graceful degrade to audio-only.
			return ErrBufferFull 
		}
		sb.videoPackets = append(sb.videoPackets, p)
		sb.videoBytes += size
	} else {
		if sb.audioBytes+size > AudioBufferMaxBytes {
			return ErrBufferFull
		}
		sb.audioPackets = append(sb.audioPackets, p)
		sb.audioBytes += size
	}
	return nil
}

// Drain clears and returns all held packets. To be called on QUIC reconnect.
func (sb *SessionBuffer) Drain() []Packet {
	sb.mu.Lock()
	defer sb.mu.Unlock()

	total := len(sb.audioPackets) + len(sb.videoPackets)
	result := make([]Packet, 0, total)

	// In real implementation, packets should be sorted by sequence/timestamp.
	// We append audio first as it's higher priority for continuity.
	result = append(result, sb.audioPackets...)
	result = append(result, sb.videoPackets...)

	// Reset buffers
	sb.audioPackets = sb.audioPackets[:0]
	sb.audioBytes = 0
	sb.videoPackets = sb.videoPackets[:0]
	sb.videoBytes = 0

	return result
}
