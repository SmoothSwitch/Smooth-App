// Package mobile provides gomobile-compatible bindings for the SmoothSwitch
// NIE (Network Intelligence Engine). All exported functions use only primitive
// types (string, int, float64, bool) so that gomobile can generate valid
// JNI wrappers (.aar) and Objective-C wrappers (.framework).
//
// The native mobile app calls these functions via the generated bindings.
// Complex state (goroutines, channels, contexts) is managed internally.
package mobile

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"
)

// ──────────────────────────────────────────────────────────────────────────────
// Constants (mirrored from internal/engine for gomobile isolation)
// ──────────────────────────────────────────────────────────────────────────────

const (
	carrierMTN      = "MTN"
	carrierGLO      = "GLO"
	carrierAIRTEL   = "AIRTEL"
	carrier9MOBILE  = "9MOBILE"
)

var allCarriers = []string{carrierMTN, carrierGLO, carrierAIRTEL, carrier9MOBILE}

// ──────────────────────────────────────────────────────────────────────────────
// Observation Bands (from state_machine.go)
// ──────────────────────────────────────────────────────────────────────────────

type observationBand struct {
	MinGap   float64
	MaxGap   float64
	Duration time.Duration
}

var observationBands = []observationBand{
	{0, 5, 0},
	{6, 14, 30 * time.Second},
	{15, 29, 60 * time.Second},
	{30, 49, 30 * time.Second},
	{50, 100, 10 * time.Second},
}

// ──────────────────────────────────────────────────────────────────────────────
// Engine State — managed as a singleton on the mobile device
// ──────────────────────────────────────────────────────────────────────────────

type engineState struct {
	mu                 sync.Mutex
	running            bool
	stopCh             chan struct{}
	pollIntervalSec    int
	lastSwitchTime     time.Time
	lastCommandTime    time.Time
	activeCarrier      string
	callbackJSON       func(string)  // set via SetEventCallback
}

var engine = &engineState{
	pollIntervalSec: 10,
	activeCarrier:   carrierMTN,
	lastSwitchTime:  time.Now().Add(-5 * time.Minute),
	lastCommandTime: time.Now().Add(-5 * time.Minute),
}

// ──────────────────────────────────────────────────────────────────────────────
// Scoring (from internal/scoring/calculator.go)
// ──────────────────────────────────────────────────────────────────────────────

// CalculateStabilityFactor returns a stability multiplier based on signal variance.
// variance ≤5 → 1.00, ≤15 → 0.85, ≤25 → 0.70, else → 0.50
func CalculateStabilityFactor(variance float64) float64 {
	if variance <= 5.0 {
		return 1.00
	} else if variance <= 15.0 {
		return 0.85
	} else if variance <= 25.0 {
		return 0.70
	}
	return 0.50
}

// CalculateQualityScore computes the NIE quality score for a single carrier.
// All inputs are normalized 0–1. Weights default to 1.0 each.
// Formula: (Signal × Speed) / (Latency × Cost) × StabilityFactor, capped [0, 100].
func CalculateQualityScore(signal, speed, latency, cost, stabilityFactor float64) float64 {
	den := latency * cost
	if den == 0 {
		den = 0.001
	}
	score := (signal * speed / den) * stabilityFactor
	if score > 100 {
		return 100
	}
	if score < 0 {
		return 0
	}
	return score
}

// ──────────────────────────────────────────────────────────────────────────────
// Switch Decision (from internal/engine/state_machine.go)
// ──────────────────────────────────────────────────────────────────────────────

// EvaluateSwitchDecision evaluates whether a network switch should occur.
// Returns a JSON string with the decision fields:
//
//	{
//	  "should_observe": bool,
//	  "should_switch": bool,
//	  "wait_duration_ms": int,
//	  "reason": string
//	}
//
// Parameters:
//   - activeScore, candidateScore: current quality scores (0–100)
//   - activeRSRP: active carrier RSRP in dBm (e.g., -85.0)
//   - isCallActive: true if a voice call is in progress
//   - msSinceLastSwitch: milliseconds since the last network switch
//   - msSinceLastCommand: milliseconds since the last switch command was issued
func EvaluateSwitchDecision(activeScore, candidateScore, activeRSRP float64, isCallActive bool, msSinceLastSwitch, msSinceLastCommand int64) string {
	type decision struct {
		ShouldObserve  bool   `json:"should_observe"`
		ShouldSwitch   bool   `json:"should_switch"`
		WaitDurationMs int64  `json:"wait_duration_ms"`
		Reason         string `json:"reason"`
	}

	tSinceSwitch := time.Duration(msSinceLastSwitch) * time.Millisecond
	tSinceCommand := time.Duration(msSinceLastCommand) * time.Millisecond

	// 1. Emergency override — active network collapse
	if activeRSRP <= -110.0 {
		d := decision{ShouldSwitch: true, Reason: "Emergency (RSRP <= -110dBm)"}
		b, _ := json.Marshal(d)
		return string(b)
	}

	// 2. Anti-flap hysteresis
	if tSinceSwitch < 30*time.Second {
		d := decision{Reason: "Anti-flap: 30s hysteresis after switch"}
		b, _ := json.Marshal(d)
		return string(b)
	}
	if tSinceCommand < 90*time.Second {
		d := decision{Reason: "Anti-flap: 90s minimum between commands"}
		b, _ := json.Marshal(d)
		return string(b)
	}

	// 3. Gap calculation
	gap := candidateScore - activeScore

	// 4. Call protection penalty
	if isCallActive {
		gap -= 30.0
	}

	// 5. Gap evaluation
	if gap < 6.0 {
		d := decision{Reason: "Score gap too low (ignore band or penalized)"}
		b, _ := json.Marshal(d)
		return string(b)
	}
	if gap > 100.0 {
		gap = 100.0
	}

	var waitMs int64
	for _, band := range observationBands {
		if gap >= band.MinGap && gap <= band.MaxGap {
			waitMs = band.Duration.Milliseconds()
			break
		}
	}

	d := decision{
		ShouldObserve:  true,
		WaitDurationMs: waitMs,
		Reason:         "Observation window triggered",
	}
	b, _ := json.Marshal(d)
	return string(b)
}

// ──────────────────────────────────────────────────────────────────────────────
// Polling Engine — lifecycle managed from mobile
// ──────────────────────────────────────────────────────────────────────────────

// StartEngine begins the background network polling loop.
// pollIntervalSec sets the poll frequency (default 10).
// Returns "ok" on success, or an error string.
func StartEngine(pollIntervalSec int) string {
	engine.mu.Lock()
	defer engine.mu.Unlock()

	if engine.running {
		return "already_running"
	}

	if pollIntervalSec <= 0 {
		pollIntervalSec = 10
	}
	engine.pollIntervalSec = pollIntervalSec
	engine.stopCh = make(chan struct{})
	engine.running = true

	go engine.pollingLoop()

	return "ok"
}

// StopEngine gracefully stops the background polling loop.
func StopEngine() string {
	engine.mu.Lock()
	defer engine.mu.Unlock()

	if !engine.running {
		return "not_running"
	}

	close(engine.stopCh)
	engine.running = false
	return "ok"
}

// IsEngineRunning returns true if the polling loop is active.
func IsEngineRunning() bool {
	engine.mu.Lock()
	defer engine.mu.Unlock()
	return engine.running
}

// SetActiveCarrier updates which carrier the device is currently connected to.
func SetActiveCarrier(carrier string) {
	engine.mu.Lock()
	defer engine.mu.Unlock()
	engine.activeCarrier = carrier
}

// GetActiveCarrier returns the currently active carrier name.
func GetActiveCarrier() string {
	engine.mu.Lock()
	defer engine.mu.Unlock()
	return engine.activeCarrier
}

// RecordSwitchComplete should be called by the mobile app after a SIM switch completes.
// This resets the anti-flap timers.
func RecordSwitchComplete() {
	engine.mu.Lock()
	defer engine.mu.Unlock()
	engine.lastSwitchTime = time.Now()
	engine.lastCommandTime = time.Now()
}

// ──────────────────────────────────────────────────────────────────────────────
// Poll a single carrier — called from mobile to inject real telemetry
// ──────────────────────────────────────────────────────────────────────────────

// SubmitCarrierTelemetry allows the mobile app to submit real signal metrics
// for a carrier. The engine scores it and, if appropriate, emits a switch event.
// Returns a JSON string with the calculated quality score and any switch decision.
//
//	{
//	  "carrier": "MTN",
//	  "quality_score": 72.5,
//	  "decision": { ... }
//	}
func SubmitCarrierTelemetry(carrier string, signal, speed, latency, cost, variance float64, activeRSRP float64, isCallActive bool) string {
	stability := CalculateStabilityFactor(variance)
	score := CalculateQualityScore(signal, speed, latency, cost, stability)

	engine.mu.Lock()
	activeCarrier := engine.activeCarrier
	msSinceSwitch := time.Since(engine.lastSwitchTime).Milliseconds()
	msSinceCmd := time.Since(engine.lastCommandTime).Milliseconds()
	engine.mu.Unlock()

	type result struct {
		Carrier      string          `json:"carrier"`
		QualityScore float64         `json:"quality_score"`
		Decision     json.RawMessage `json:"decision,omitempty"`
	}

	r := result{
		Carrier:      carrier,
		QualityScore: score,
	}

	// Only evaluate switch decision if this carrier is NOT the active one
	if carrier != activeCarrier {
		// We need the active carrier's score — for now return the decision
		// based on a placeholder. In the real flow, the mobile app calls
		// this for each carrier, then calls EvaluateSwitchDecision itself.
		decJSON := EvaluateSwitchDecision(50, score, activeRSRP, isCallActive, msSinceSwitch, msSinceCmd)
		r.Decision = json.RawMessage(decJSON)
	}

	b, _ := json.Marshal(r)
	return string(b)
}

// ──────────────────────────────────────────────────────────────────────────────
// Internal polling loop (runs in a goroutine)
// ──────────────────────────────────────────────────────────────────────────────

func (e *engineState) pollingLoop() {
	ticker := time.NewTicker(time.Duration(e.pollIntervalSec) * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-e.stopCh:
			return
		case <-ticker.C:
			e.emitPollEvent()
		}
	}
}

// emitPollEvent signals the mobile app that it's time to collect telemetry.
// The mobile layer reads this and calls SubmitCarrierTelemetry with real data.
func (e *engineState) emitPollEvent() {
	e.mu.Lock()
	cb := e.callbackJSON
	e.mu.Unlock()

	event := fmt.Sprintf(`{"type":"poll_tick","timestamp":"%s","carriers":["%s","%s","%s","%s"]}`,
		time.Now().UTC().Format(time.RFC3339),
		carrierMTN, carrierGLO, carrierAIRTEL, carrier9MOBILE)

	if cb != nil {
		cb(event)
	}
}

// ──────────────────────────────────────────────────────────────────────────────
// Version / Health
// ──────────────────────────────────────────────────────────────────────────────

// Version returns the SDK version string for debugging.
func Version() string {
	return "smoothswitch-nie-mobile/1.0.0"
}

// HealthCheck returns a JSON string with engine status.
func HealthCheck() string {
	engine.mu.Lock()
	defer engine.mu.Unlock()

	type health struct {
		Version       string `json:"version"`
		Running       bool   `json:"running"`
		ActiveCarrier string `json:"active_carrier"`
		PollInterval  int    `json:"poll_interval_sec"`
	}

	h := health{
		Version:       "smoothswitch-nie-mobile/1.0.0",
		Running:       engine.running,
		ActiveCarrier: engine.activeCarrier,
		PollInterval:  engine.pollIntervalSec,
	}

	b, _ := json.Marshal(h)
	return string(b)
}

// ExecuteMobileSwitch triggers a manual network switch from the UI.
func ExecuteMobileSwitch(simType string, iccid string) string {
	engine.mu.Lock()
	engine.activeCarrier = simType
	engine.mu.Unlock()

	type response struct {
		Status  string `json:"status"`
		Message string `json:"message"`
	}

	resp := response{
		Status:  "success",
		Message: fmt.Sprintf("Switched to %s (ICCID: %s)", simType, iccid),
	}

	b, _ := json.Marshal(resp)
	return string(b)
}
