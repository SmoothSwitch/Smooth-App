package adapters

import (
	"errors"
	"log"
	"time"

	"github.com/sony/gobreaker"
)

type AirtelAdapter struct {
	apiBaseUrl      string
	fallbackManager *SFTPFallbackManager
	cb              *gobreaker.CircuitBreaker
}

func NewAirtelAdapter(apiBaseUrl string) *AirtelAdapter {
	cbSettings := gobreaker.Settings{
		Name:        "AIRTEL",
		MaxRequests: 1,
		Interval:    30 * time.Second,
		Timeout:     60 * time.Second,
		ReadyToTrip: func(counts gobreaker.Counts) bool {
			return counts.ConsecutiveFailures >= 3
		},
		OnStateChange: func(name string, from gobreaker.State, to gobreaker.State) {
			log.Printf("[AIRTEL] Circuit Breaker state changed from %v to %v", from, to)
		},
	}

	return &AirtelAdapter{
		apiBaseUrl:      apiBaseUrl,
		fallbackManager: NewSFTPFallbackManager("AIRTEL", ""),
		cb:              gobreaker.NewCircuitBreaker(cbSettings),
	}
}

func (a *AirtelAdapter) CarrierName() string {
	return "AIRTEL"
}

func (a *AirtelAdapter) executeRestCall(imsi string, amountMB float64) (map[string]interface{}, error) {
	time.Sleep(50 * time.Millisecond)
	return nil, errors.New("AIRTEL API Gateway unreachable")
}

func (a *AirtelAdapter) DeductBalance(imsi string, amountMB float64) DeductionResult {
	res, err := a.cb.Execute(func() (interface{}, error) {
		return a.executeRestCall(imsi, amountMB)
	})

	if err != nil {
		if errors.Is(err, gobreaker.ErrOpenState) || errors.Is(err, gobreaker.ErrTooManyRequests) || err.Error() == "AIRTEL API Gateway unreachable" {
			log.Printf("[AIRTEL] Circuit Breaker OPEN or request failed. Engaging SFTP Fallback.")
			return a.FallbackSFTPBatch(imsi, amountMB)
		}
		
		return DeductionResult{Status: "ERROR", Message: err.Error()}
	}

	data := res.(map[string]interface{})
	balance, _ := data["balance"].(float64)

	return DeductionResult{Status: "SUCCESS", RemainingBalance: balance, Source: "REST_API"}
}

func (a *AirtelAdapter) FallbackSFTPBatch(imsi string, amountMB float64) DeductionResult {
	success := a.fallbackManager.AppendRecord(imsi, amountMB)
	if success {
		return DeductionResult{Status: "QUEUED_SFTP", Message: "Deduction logged", Source: "SFTP_FALLBACK"}
	}
	return DeductionResult{Status: "ERROR", Message: "SFTP Fallback also failed."}
}
