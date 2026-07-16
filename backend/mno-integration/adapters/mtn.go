package adapters

import (
	"errors"
	"log"
	"time"

	"github.com/sony/gobreaker"
)

type MTNAdapter struct {
	apiBaseUrl      string
	fallbackManager *SFTPFallbackManager
	cb              *gobreaker.CircuitBreaker
}

func NewMTNAdapter(apiBaseUrl string) *MTNAdapter {
	cbSettings := gobreaker.Settings{
		Name:        "MTN",
		MaxRequests: 1,
		Interval:    30 * time.Second,
		Timeout:     60 * time.Second,
		ReadyToTrip: func(counts gobreaker.Counts) bool {
			// Trip circuit breaker after 3 consecutive failures
			return counts.ConsecutiveFailures >= 3
		},
		OnStateChange: func(name string, from gobreaker.State, to gobreaker.State) {
			log.Printf("[MTN] Circuit Breaker state changed from %v to %v", from, to)
		},
	}

	return &MTNAdapter{
		apiBaseUrl:      apiBaseUrl,
		fallbackManager: NewSFTPFallbackManager("MTN", ""),
		cb:              gobreaker.NewCircuitBreaker(cbSettings),
	}
}

func (a *MTNAdapter) CarrierName() string {
	return "MTN"
}

func (a *MTNAdapter) executeRestCall(imsi string, amountMB float64) (map[string]interface{}, error) {
	// Simulate an actual POST to MTN's charging gateway
	// In this mock, we force a connect error to demonstrate the breaker
	time.Sleep(50 * time.Millisecond)
	return nil, errors.New("MTN API Gateway unreachable")
}

func (a *MTNAdapter) DeductBalance(imsi string, amountMB float64) DeductionResult {
	res, err := a.cb.Execute(func() (interface{}, error) {
		return a.executeRestCall(imsi, amountMB)
	})

	if err != nil {
		if errors.Is(err, gobreaker.ErrOpenState) || errors.Is(err, gobreaker.ErrTooManyRequests) || err.Error() == "MTN API Gateway unreachable" {
			log.Printf("[MTN] Circuit Breaker OPEN or request failed. Engaging SFTP Fallback.")
			return a.FallbackSFTPBatch(imsi, amountMB)
		}
		
		log.Printf("[MTN] Unhandled exception during deduction: %v", err)
		return DeductionResult{
			Status:  "ERROR",
			Message: err.Error(),
		}
	}

	data := res.(map[string]interface{})
	balance, _ := data["balance"].(float64)

	return DeductionResult{
		Status:           "SUCCESS",
		RemainingBalance: balance,
		Source:           "REST_API",
	}
}

func (a *MTNAdapter) FallbackSFTPBatch(imsi string, amountMB float64) DeductionResult {
	success := a.fallbackManager.AppendRecord(imsi, amountMB)
	if success {
		return DeductionResult{
			Status:  "QUEUED_SFTP",
			Message: "Deduction logged to offline batch file for later sync.",
			Source:  "SFTP_FALLBACK",
		}
	}
	return DeductionResult{
		Status:  "ERROR",
		Message: "SFTP Fallback also failed.",
	}
}
