package buffer

import (
	"testing"
	"time"
)

func TestSessionBuffer_AudioEnqueue(t *testing.T) {
	sb := NewSessionBuffer()

	// Fill buffer right up to 40KB
	chunk := make([]byte, 1024) // 1KB
	for i := 0; i < 40; i++ {
		err := sb.Enqueue(Packet{Data: chunk, Timestamp: time.Now(), IsVideo: false})
		if err != nil {
			t.Fatalf("Failed to enqueue chunk %d: %v", i, err)
		}
	}

	// 41st chunk should fail
	err := sb.Enqueue(Packet{Data: chunk, Timestamp: time.Now(), IsVideo: false})
	if err != ErrBufferFull {
		t.Errorf("Expected ErrBufferFull, got %v", err)
	}
}

func TestSessionBuffer_Drain(t *testing.T) {
	sb := NewSessionBuffer()

	sb.Enqueue(Packet{Data: []byte("audio1"), IsVideo: false})
	sb.Enqueue(Packet{Data: []byte("video1"), IsVideo: true})

	drained := sb.Drain()
	if len(drained) != 2 {
		t.Fatalf("Expected 2 packets, got %d", len(drained))
	}

	if sb.audioBytes != 0 || sb.videoBytes != 0 {
		t.Errorf("Buffers not cleared after drain")
	}
}
