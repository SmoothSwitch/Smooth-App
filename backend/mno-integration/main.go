package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/smoothswitch/mno-integration/adapters"
	"github.com/smoothswitch/mno-integration/api"
	"github.com/smoothswitch/mno-integration/workers"
)

func main() {
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":    "ok",
			"service":   "mno-integration",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Initialize Adapters
	adaptersMap := map[string]adapters.MNOAdapter{
		"MTN":     adapters.NewMTNAdapter(os.Getenv("MTN_API_URL")),
		"GLO":     adapters.NewGloAdapter(os.Getenv("GLO_API_URL")),
		"AIRTEL":  adapters.NewAirtelAdapter(os.Getenv("AIRTEL_API_URL")),
		"9MOBILE": adapters.NewNineMobileAdapter(os.Getenv("NINEMOBILE_API_URL")),
	}

	apiRouter := api.NewRouter(adaptersMap)
	apiRouter.RegisterRoutes(router)

	// Start SFTP Retry Worker
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	
	sftpWorker := workers.NewSFTPRetryWorker("", 5*time.Minute)
	go sftpWorker.Start(ctx)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8001"
	}

	go func() {
		log.Printf("MNO Integration service listening on :%s", port)
		if err := router.Run(":" + port); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down service...")
}
