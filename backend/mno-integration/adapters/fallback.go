package adapters

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"
	"time"
)

type SFTPFallbackManager struct {
	carrierName string
	cacheDir    string
	mu          sync.Mutex
}

func NewSFTPFallbackManager(carrierName string, cacheDir string) *SFTPFallbackManager {
	if cacheDir == "" {
		cacheDir = "/tmp/smoothswitch/sftp"
	}
	os.MkdirAll(cacheDir, 0755)

	return &SFTPFallbackManager{
		carrierName: carrierName,
		cacheDir:    cacheDir,
	}
}

func (m *SFTPFallbackManager) currentFile() string {
	dateStr := time.Now().Format("20060102")
	return filepath.Join(m.cacheDir, fmt.Sprintf("%s_fallback_%s.csv", m.carrierName, dateStr))
}

func (m *SFTPFallbackManager) ensureHeader(filename string) error {
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		f, err := os.OpenFile(filename, os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			return err
		}
		defer f.Close()

		writer := csv.NewWriter(f)
		defer writer.Flush()
		return writer.Write([]string{"timestamp", "imsi", "deduction_mb", "status"})
	}
	return nil
}

func (m *SFTPFallbackManager) AppendRecord(imsi string, amountMB float64) bool {
	m.mu.Lock()
	defer m.mu.Unlock()

	filename := m.currentFile()
	if err := m.ensureHeader(filename); err != nil {
		log.Printf("[%s] Failed to create SFTP fallback header: %v", m.carrierName, err)
		return false
	}

	f, err := os.OpenFile(filename, os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		log.Printf("[%s] Failed to open SFTP fallback file: %v", m.carrierName, err)
		return false
	}
	defer f.Close()

	writer := csv.NewWriter(f)
	defer writer.Flush()

	record := []string{
		time.Now().UTC().Format(time.RFC3339),
		imsi,
		fmt.Sprintf("%f", amountMB),
		"PENDING_SFTP",
	}

	if err := writer.Write(record); err != nil {
		log.Printf("[%s] Failed to write SFTP fallback: %v", m.carrierName, err)
		return false
	}

	log.Printf("[%s] Fallback record written for IMSI %s", m.carrierName, imsi)
	return true
}
