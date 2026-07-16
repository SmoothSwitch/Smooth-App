package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/smoothswitch/auth-service/controllers"
	"github.com/smoothswitch/auth-service/models"
	"github.com/smoothswitch/auth-service/utils"
)

func main() {
	// ── Initialize infrastructure ──────────────────────────────────
	if err := models.InitDB(); err != nil {
		log.Fatalf("Database initialization failed: %v", err)
	}

	if err := utils.InitRedis(); err != nil {
		log.Fatalf("Redis initialization failed: %v", err)
	}

	// ── Gin router setup ───────────────────────────────────────────
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	// Health check — for Prometheus / Datadog monitoring
	startTime := time.Now()
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":    "ok",
			"service":   "auth-service",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
			"uptime":    time.Since(startTime).Seconds(),
		})
	})

	// ── Auth routes ────────────────────────────────────────────────
	auth := router.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
		auth.POST("/verify-2fa", controllers.VerifyTwoFactor)
		auth.POST("/logout", controllers.Logout)
	}

	// ── Start server ───────────────────────────────────────────────
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	fmt.Printf("Auth service listening on :%s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
