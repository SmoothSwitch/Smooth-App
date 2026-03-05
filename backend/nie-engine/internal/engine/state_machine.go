package engine

import (
	"time"
)

type NetworkState string

const (
	StateMonitoring NetworkState = "MONITORING"
	StateObserving  NetworkState = "OBSERVING"
	StateSwitching  NetworkState = "SWITCHING"
	StateIdle       NetworkState = "IDLE"
)

type ObservationBand struct {
	MinGap   float64
	MaxGap   float64
	Duration time.Duration
}

var ObservationBands = []ObservationBand{
	{0, 5, 0},                           // Ignore gap 0-5
	{6, 14, 30 * time.Second},           // Passive 30s check
	{15, 29, 60 * time.Second},          // Watch 60s
	{30, 49, 30 * time.Second},          // Watch 30s
	{50, 100, 10 * time.Second},         // Rapid 10s
}

type SwitchDecision struct {
	ShouldObserve  bool
	ShouldSwitch   bool
	WaitDuration   time.Duration
	Reason         string
}

// EvaluateSwitchCondition evaluates the gap between active and candidate networks and returns the observation decision
func EvaluateSwitchCondition(activeScore, candidateScore, activeRSRP float64, isCallActive bool, timeSinceLastSwitch, timeSinceLastCommand time.Duration) SwitchDecision {
	// 1. Emergency override (active network collapses) - ignore anti-flap and call protection
	if activeRSRP <= -110.0 {
		return SwitchDecision{ShouldObserve: false, ShouldSwitch: true, WaitDuration: 0, Reason: "Emergency (RSRP <= -110dBm)"}
	}

	// 2. Anti-flap hysteresis checks
	if timeSinceLastSwitch < 30*time.Second {
		return SwitchDecision{Reason: "Anti-flap: 30s hysteresis after switch"}
	}
	if timeSinceLastCommand < 90*time.Second {
		return SwitchDecision{Reason: "Anti-flap: 90s minimum between commands"}
	}

	// 3. Gap calculation
	gap := candidateScore - activeScore

	// 4. Call protection penalty
	if isCallActive {
		gap -= 30.0
	}

	// 5. Gap Evaluation
	if gap < 6.0 {
		return SwitchDecision{Reason: "Score gap too low (ignore band or penalized)"}
	}

	// Fallback cap if gap somehow exceeds 100
	if gap > 100.0 {
		gap = 100.0
	}

	var duration time.Duration
	for _, band := range ObservationBands {
		if gap >= band.MinGap && gap <= band.MaxGap {
			duration = band.Duration
			break
		}
	}

	return SwitchDecision{
		ShouldObserve: true,
		WaitDuration:  duration,
		Reason:        "Observation window triggered",
	}
}
