package scoring

// Weights represents the configurable weights for scoring
type Weights struct {
	SignalWeight  float64
	SpeedWeight   float64
	LatencyWeight float64
	CostWeight    float64
}

// CalculateStabilityFactor determines the stability multiplier based on variance
// Stability factor: variance ≤5 → 1.00, ≤15 → 0.85, ≤25 → 0.70, default → 0.50
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

// CalculateQualityScore computes the final score for a network
// FINAL SCORE = (Signal × Speed) / (Latency × Cost) × Stability Factor
// Inputs normalized 0–1. 
func CalculateQualityScore(signal, speed, latency, cost float64, stabilityFactor float64, weights Weights) float64 {
	// Apply weights
	wSignal := signal * weights.SignalWeight
	wSpeed := speed * weights.SpeedWeight
	wLatency := latency * weights.LatencyWeight
	wCost := cost * weights.CostWeight

	// Avoid division by zero
	den := wLatency * wCost
	if den == 0 {
		den = 0.001
	}

	num := wSignal * wSpeed
	score := (num / den) * stabilityFactor

	// Cap score at 100 and floor at 0
	if score > 100 {
		return 100
	}
	if score < 0 {
		return 0
	}
	return score
}
