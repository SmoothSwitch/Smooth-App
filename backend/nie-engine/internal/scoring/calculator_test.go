package scoring

import (
	"testing"
)

func TestCalculateStabilityFactor(t *testing.T) {
	tests := []struct {
		name     string
		variance float64
		expected float64
	}{
		{"Low variance", 3.0, 1.00},
		{"Boundary 5", 5.0, 1.00},
		{"Medium variance", 10.0, 0.85},
		{"Boundary 15", 15.0, 0.85},
		{"High variance", 20.0, 0.70},
		{"Boundary 25", 25.0, 0.70},
		{"Extreme variance", 30.0, 0.50},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			actual := CalculateStabilityFactor(tc.variance)
			if actual != tc.expected {
				t.Errorf("Expected %.2f, got %.2f", tc.expected, actual)
			}
		})
	}
}

func TestCalculateQualityScore(t *testing.T) {
	w := Weights{
		SignalWeight:  1.0,
		SpeedWeight:   1.0,
		LatencyWeight: 1.0,
		CostWeight:    1.0,
	}

	// Normal scenario
	score := CalculateQualityScore(0.8, 0.9, 0.2, 0.5, 1.00, w)
	if score <= 0 || score > 100 {
		t.Errorf("Score out of bounds: %f", score)
	}

	// Division by zero safety
	wZero := Weights{1.0, 1.0, 0.0, 1.0}
	scoreZ := CalculateQualityScore(0.8, 0.9, 0.0, 0.5, 1.00, wZero)
	if scoreZ != 100 {
		t.Errorf("Expected cap at 100 for zero denominator, got %f", scoreZ)
	}
}
