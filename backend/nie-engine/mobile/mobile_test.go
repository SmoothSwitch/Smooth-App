package mobile

import (
	"encoding/json"
	"testing"
)

func TestVersion(t *testing.T) {
	v := Version()
	if v != "smoothswitch-nie-mobile/1.0.0" {
		t.Errorf("Expected version 'smoothswitch-nie-mobile/1.0.0', got '%s'", v)
	}
}

func TestCalculateStabilityFactor(t *testing.T) {
	tests := []struct {
		variance float64
		expected float64
	}{
		{3.0, 1.00},
		{5.0, 1.00},
		{10.0, 0.85},
		{15.0, 0.85},
		{20.0, 0.70},
		{25.0, 0.70},
		{30.0, 0.50},
	}

	for _, tc := range tests {
		got := CalculateStabilityFactor(tc.variance)
		if got != tc.expected {
			t.Errorf("variance=%.1f: expected %.2f, got %.2f", tc.variance, tc.expected, got)
		}
	}
}

func TestCalculateQualityScore(t *testing.T) {
	// Normal case
	score := CalculateQualityScore(0.8, 0.9, 0.2, 0.5, 1.00)
	if score <= 0 || score > 100 {
		t.Errorf("Score out of bounds: %f", score)
	}

	// Near-zero denominator -> cap at 100
	score2 := CalculateQualityScore(0.8, 0.9, 0.0, 0.5, 1.00)
	if score2 != 100 {
		t.Errorf("Expected cap at 100, got %f", score2)
	}
}

func TestEvaluateSwitchDecision_Emergency(t *testing.T) {
	result := EvaluateSwitchDecision(80, 50, -111.0, true, 5000, 10000)
	var dec map[string]interface{}
	json.Unmarshal([]byte(result), &dec)

	if dec["should_switch"] != true {
		t.Errorf("Expected emergency switch, got %+v", dec)
	}
}

func TestEvaluateSwitchDecision_AntiFlap(t *testing.T) {
	// Too soon since last switch (20s < 30s)
	result := EvaluateSwitchDecision(50, 90, -80.0, false, 20000, 100000)
	var dec map[string]interface{}
	json.Unmarshal([]byte(result), &dec)

	if dec["should_observe"] == true || dec["should_switch"] == true {
		t.Errorf("Expected anti-flap rejection, got %+v", dec)
	}

	// Too soon since last command (80s < 90s)
	result2 := EvaluateSwitchDecision(50, 90, -80.0, false, 40000, 80000)
	var dec2 map[string]interface{}
	json.Unmarshal([]byte(result2), &dec2)

	if dec2["should_observe"] == true || dec2["should_switch"] == true {
		t.Errorf("Expected anti-flap rejection for command, got %+v", dec2)
	}
}

func TestEvaluateSwitchDecision_CallProtection(t *testing.T) {
	// Gap = 40, call penalty = -30, effective gap = 10 → band 6-14 → 30s wait
	result := EvaluateSwitchDecision(50, 90, -80.0, true, 100000, 100000)
	var dec map[string]interface{}
	json.Unmarshal([]byte(result), &dec)

	if dec["should_observe"] != true {
		t.Errorf("Expected observation, got %+v", dec)
	}
	if dec["wait_duration_ms"] != float64(30000) {
		t.Errorf("Expected 30000ms wait, got %v", dec["wait_duration_ms"])
	}
}

func TestEvaluateSwitchDecision_Bands(t *testing.T) {
	tests := []struct {
		gap        float64
		expectedMs float64
	}{
		{10, 30000},  // 6-14 → 30s
		{20, 60000},  // 15-29 → 60s
		{40, 30000},  // 30-49 → 30s
		{80, 10000},  // 50-100 → 10s
	}

	for _, tc := range tests {
		result := EvaluateSwitchDecision(50, 50+tc.gap, -80.0, false, 100000, 100000)
		var dec map[string]interface{}
		json.Unmarshal([]byte(result), &dec)

		if dec["wait_duration_ms"] != tc.expectedMs {
			t.Errorf("Gap %.0f: expected %v ms, got %v", tc.gap, tc.expectedMs, dec["wait_duration_ms"])
		}
	}
}

func TestStartStopEngine(t *testing.T) {
	res := StartEngine(5)
	if res != "ok" {
		t.Errorf("Expected 'ok', got '%s'", res)
	}

	if !IsEngineRunning() {
		t.Error("Engine should be running")
	}

	// Double start should return already_running
	res2 := StartEngine(5)
	if res2 != "already_running" {
		t.Errorf("Expected 'already_running', got '%s'", res2)
	}

	res3 := StopEngine()
	if res3 != "ok" {
		t.Errorf("Expected 'ok', got '%s'", res3)
	}

	if IsEngineRunning() {
		t.Error("Engine should be stopped")
	}
}

func TestHealthCheck(t *testing.T) {
	result := HealthCheck()
	var h map[string]interface{}
	if err := json.Unmarshal([]byte(result), &h); err != nil {
		t.Fatalf("Failed to parse health check JSON: %v", err)
	}

	if h["version"] != "smoothswitch-nie-mobile/1.0.0" {
		t.Errorf("Unexpected version in health check: %v", h["version"])
	}
}

func TestSetGetActiveCarrier(t *testing.T) {
	SetActiveCarrier("GLO")
	if GetActiveCarrier() != "GLO" {
		t.Errorf("Expected GLO, got %s", GetActiveCarrier())
	}
	SetActiveCarrier("MTN") // reset
}

func TestSubmitCarrierTelemetry(t *testing.T) {
	SetActiveCarrier("MTN")
	RecordSwitchComplete() // reset timers

	// Submit for a non-active carrier → should include a decision
	result := SubmitCarrierTelemetry("GLO", 0.9, 0.85, 0.15, 0.3, 4.0, -75.0, false)
	var r map[string]interface{}
	if err := json.Unmarshal([]byte(result), &r); err != nil {
		t.Fatalf("Failed to parse telemetry result: %v", err)
	}

	if r["carrier"] != "GLO" {
		t.Errorf("Expected carrier GLO, got %v", r["carrier"])
	}

	score, ok := r["quality_score"].(float64)
	if !ok || score <= 0 {
		t.Errorf("Expected positive quality_score, got %v", r["quality_score"])
	}
}
