package kafka

import (
	"context"
	"encoding/json"
	"fmt"
	"time"
)

// SwitchEvent represents the schema for the `network.switch.events` topic
type SwitchEvent struct {
	SwitchID          string    `json:"switch_id"`
	UserID            string    `json:"user_id"`
	FromCarrier       string    `json:"from_carrier"`
	ToCarrier         string    `json:"to_carrier"`
	Reason            string    `json:"reason"`
	QualityScoresJSON string    `json:"quality_scores_json"` // Captures all 4 MNO scores at time of switch
	SIMType           string    `json:"sim_type"`            // "physical" or "eSIM"
	Timestamp         time.Time `json:"timestamp"`
}

// EventPublisher defines the contract for publishing events to the message broker
type EventPublisher interface {
	PublishSwitchEvent(ctx context.Context, event SwitchEvent) error
}

// MockKafkaPublisher provides a mock implementation for development
// In production, this uses Confluent Kafka Go with acks=all and Avro schemas
type MockKafkaPublisher struct{}

// PublishSwitchEvent broadcasts the switch decision to downstream consumers (Analytics, Audit)
func (p *MockKafkaPublisher) PublishSwitchEvent(ctx context.Context, event SwitchEvent) error {
	bytes, err := json.Marshal(event)
	if err != nil {
		return err
	}
	
	fmt.Printf("[Kafka] Publishing to topic `network.switch.events`: %s\n", string(bytes))
	return nil
}
