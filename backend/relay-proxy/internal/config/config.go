package config

import (
	"os"
	"log"
)

// Config holds all environmental settings for the Relay Proxy
type Config struct {
	CloudflareTeam   string
	CloudflareClient string
	CloudflareSecret string
	RedisAddr        string
	ListenAddr       string
}

// LoadConfig reads settings from environment variables
func LoadConfig() *Config {
	cfg := &Config{
		CloudflareTeam:   os.Getenv("CF_TEAM_NAME"),
		CloudflareClient: os.Getenv("CF_CLIENT_ID"),
		CloudflareSecret: os.Getenv("CF_CLIENT_SECRET"),
		RedisAddr:        os.Getenv("REDIS_ADDR"),
		ListenAddr:       ":4433", // Default QUIC port
	}

	if cfg.RedisAddr == "" {
		cfg.RedisAddr = "localhost:6379"
	}

	if cfg.CloudflareTeam == "" || cfg.CloudflareClient == "" || cfg.CloudflareSecret == "" {
		log.Println("[Config] WARNING: Cloudflare Zero Trust Service credentials incomplete. Falling back to native bridge mode.")
	}

	return cfg
}
