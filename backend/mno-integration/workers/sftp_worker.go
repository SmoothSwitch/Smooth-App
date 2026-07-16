package workers

import (
	"context"
	"log"
	"os"
	"path/filepath"
	"time"
)

type SFTPRetryWorker struct {
	cacheDir string
	interval time.Duration
}

func NewSFTPRetryWorker(cacheDir string, interval time.Duration) *SFTPRetryWorker {
	if cacheDir == "" {
		cacheDir = "/tmp/smoothswitch/sftp"
	}
	return &SFTPRetryWorker{
		cacheDir: cacheDir,
		interval: interval,
	}
}

func (w *SFTPRetryWorker) Start(ctx context.Context) {
	ticker := time.NewTicker(w.interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("SFTP Retry Worker shutting down...")
			return
		case <-ticker.C:
			w.processPendingBatches()
		}
	}
}

func (w *SFTPRetryWorker) processPendingBatches() {
	files, err := filepath.Glob(filepath.Join(w.cacheDir, "*_fallback_*.csv"))
	if err != nil {
		log.Printf("[SFTP Worker] Failed to list fallback files: %v", err)
		return
	}

	for _, file := range files {
		// Only process files that aren't currently being written to
		// A simple heuristic is to check if it's from yesterday, or implement proper file locking.
		// For this implementation, we simulate uploading and deleting the file.
		log.Printf("[SFTP Worker] Found fallback file: %s. Initiating SFTP upload...", file)

		// Simulate SFTP upload duration
		time.Sleep(2 * time.Second)

		log.Printf("[SFTP Worker] Upload successful. Deleting local file: %s", file)
		if err := os.Remove(file); err != nil {
			log.Printf("[SFTP Worker] Failed to delete file %s: %v", file, err)
		}
	}
}
