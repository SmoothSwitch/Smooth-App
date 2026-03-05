package engine

import (
	"testing"
	"time"
)

func TestEvaluateSwitchCondition_Emergency(t *testing.T) {
	decision := EvaluateSwitchCondition(80, 50, -111.0, true, 5*time.Second, 10*time.Second)
	if !decision.ShouldSwitch || decision.WaitDuration != 0 {
		t.Errorf("Expected immediate switch for emergency, got %+v", decision)
	}
}

func TestEvaluateSwitchCondition_AntiFlap(t *testing.T) {
	// Too soon since last switch
	dec1 := EvaluateSwitchCondition(50, 90, -80.0, false, 20*time.Second, 100*time.Second)
	if dec1.ShouldObserve || dec1.ShouldSwitch {
		t.Errorf("Expected anti-flap rejection for timeSinceLastSwitch < 30s, got %+v", dec1)
	}

	// Too soon since last command
	dec2 := EvaluateSwitchCondition(50, 90, -80.0, false, 40*time.Second, 80*time.Second)
	if dec2.ShouldObserve || dec2.ShouldSwitch {
		t.Errorf("Expected anti-flap rejection for timeSinceLastCommand < 90s, got %+v", dec2)
	}
}

func TestEvaluateSwitchCondition_CallProtection(t *testing.T) {
	// Candidate score is 90, Active is 50. Gap = 40. With call active, gap = 10.
	// Band 6-14 requires 30s wait.
	dec := EvaluateSwitchCondition(50, 90, -80.0, true, 100*time.Second, 100*time.Second)
	if !dec.ShouldObserve || dec.WaitDuration != 30*time.Second {
		t.Errorf("Expected 30s wait (gap 10 after penalty). Got %+v", dec)
	}

	// Gap = 30. With call, gap = 0. Should be ignored.
	dec2 := EvaluateSwitchCondition(50, 80, -80.0, true, 100*time.Second, 100*time.Second)
	if dec2.ShouldObserve {
		t.Errorf("Expected ignore due to call protection penalty, got %+v", dec2)
	}
}

func TestEvaluateSwitchCondition_Bands(t *testing.T) {
	tests := []struct {
		gap      float64
		expected time.Duration
	}{
		{4, 0},                           // Ignore
		{10, 30 * time.Second},           // 6-14 pass 30s
		{20, 60 * time.Second},           // 15-29 watch 60s
		{40, 30 * time.Second},           // 30-49 watch 30s
		{80, 10 * time.Second},           // 50+ rapid 10s
	}

	for _, tc := range tests {
		dec := EvaluateSwitchCondition(50, 50+tc.gap, -80.0, false, 100*time.Second, 100*time.Second)
		if tc.gap < 6 && dec.ShouldObserve {
			t.Errorf("Gap %.1f expected to be ignored", tc.gap)
		} else if tc.gap >= 6 && dec.WaitDuration != tc.expected {
			t.Errorf("Gap %.1f expected wait %v, got %v", tc.gap, tc.expected, dec.WaitDuration)
		}
	}
}
