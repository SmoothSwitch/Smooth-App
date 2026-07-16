package adapters

type DeductionResult struct {
	Status           string  `json:"status"`
	RemainingBalance float64 `json:"remaining_balance,omitempty"`
	Source           string  `json:"source"`
	Message          string  `json:"message,omitempty"`
}

type MNOAdapter interface {
	DeductBalance(imsi string, amountMB float64) DeductionResult
	FallbackSFTPBatch(imsi string, amountMB float64) DeductionResult
	CarrierName() string
}
