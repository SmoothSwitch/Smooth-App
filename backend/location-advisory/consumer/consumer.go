package consumer

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/redis/go-redis/v9"
)

type SwitchEventConsumer struct {
	consumer    *kafka.Consumer
	redisClient *redis.Client
	topic       string
}

func NewSwitchEventConsumer(bootstrapServers, groupID string, redisClient *redis.Client) (*SwitchEventConsumer, error) {
	c, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": bootstrapServers,
		"group.id":          groupID,
		"auto.offset.reset": "earliest",
	})
	if err != nil {
		return nil, err
	}

	return &SwitchEventConsumer{
		consumer:    c,
		redisClient: redisClient,
		topic:       "network.switch.events",
	}, nil
}

func (c *SwitchEventConsumer) Start(ctx context.Context) {
	err := c.consumer.SubscribeTopics([]string{c.topic}, nil)
	if err != nil {
		log.Printf("Failed to subscribe to topic: %v", err)
		return
	}

	log.Printf("Subscribed to %s", c.topic)

	for {
		select {
		case <-ctx.Done():
			log.Println("Kafka consumer shutting down...")
			c.consumer.Close()
			return
		default:
			msg, err := c.consumer.ReadMessage(1 * time.Second)
			if err == nil {
				c.processMessage(msg.Value)
			} else if !err.(kafka.Error).IsTimeout() {
				log.Printf("Kafka error: %v (%v)", err, msg)
			}
		}
	}
}

func (c *SwitchEventConsumer) processMessage(messageBytes []byte) {
	var data map[string]interface{}
	if err := json.Unmarshal(messageBytes, &data); err != nil {
		log.Printf("Error processing message: %v", err)
		return
	}

	h3Index, ok := data["h3_index"].(string)
	if !ok || h3Index == "" {
		return // Can't aggregate without location
	}

	qualityScoresStr, ok := data["quality_scores_json"].(string)
	if !ok {
		return
	}

	var scores map[string]float64
	if err := json.Unmarshal([]byte(qualityScoresStr), &scores); err != nil {
		log.Printf("Error processing quality scores: %v", err)
		return
	}

	for carrier, score := range scores {
		c.updateEMA(h3Index, carrier, score)
	}
}

func (c *SwitchEventConsumer) updateEMA(h3Index string, carrier string, newScore float64) {
	key := fmt.Sprintf("advisory:h3:%s:%s", h3Index, carrier)
	alpha := 0.2

	ctx := context.Background()
	currentStr, err := c.redisClient.Get(ctx, key).Result()
	if err == redis.Nil {
		c.redisClient.Set(ctx, key, newScore, 7*24*time.Hour)
	} else if err == nil {
		var current float64
		fmt.Sscanf(currentStr, "%f", &current)
		ema := (newScore * alpha) + (current * (1 - alpha))
		c.redisClient.Set(ctx, key, ema, 7*24*time.Hour)
	} else {
		log.Printf("Error getting redis key %s: %v", key, err)
	}
}
