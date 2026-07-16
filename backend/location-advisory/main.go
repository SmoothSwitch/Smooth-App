package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/smoothswitch/location-advisory/api"
	"github.com/smoothswitch/location-advisory/consumer"
)

func main() {
	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "localhost"
	}
	redisPort := os.Getenv("REDIS_PORT")
	if redisPort == "" {
		redisPort = "6379"
	}

	redisClient := redis.NewClient(&redis.Options{
		Addr: redisHost + ":" + redisPort,
		DB:   0,
	})

	// Setup API
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()
	
	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":    "ok",
			"service":   "location-advisory",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	apiRouter := api.NewRouter(redisClient)
	apiRouter.RegisterRoutes(router)

	// Setup Kafka Consumer
	kafkaBrokers := os.Getenv("KAFKA_BROKERS")
	if kafkaBrokers == "" {
		kafkaBrokers = "localhost:9092"
	}

	eventConsumer, err := consumer.NewSwitchEventConsumer(kafkaBrokers, "location-advisory-group", redisClient)
	if err != nil {
		log.Printf("Warning: Failed to initialize Kafka consumer: %v. Running in API-only mode.", err)
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if eventConsumer != nil {
		go eventConsumer.Start(ctx)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	go func() {
		log.Printf("Location Advisory API listening on :%s", port)
		if err := router.Run(":" + port); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down service...")
}
