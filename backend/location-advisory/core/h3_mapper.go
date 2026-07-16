package core

import (
	"github.com/uber/h3-go/v4"
)

const H3Resolution = 9 // Approx 500m radius

// GetH3Hex converts a raw GPS coordinate into an H3 hexagonal grid index.
func GetH3Hex(lat, lng float64) string {
	latLng := h3.NewLatLng(lat, lng)
	cell := h3.LatLngToCell(latLng, H3Resolution)
	return cell.String()
}

// IsValidCoordinate validates real-world bounds.
func IsValidCoordinate(lat, lng float64) bool {
	return lat >= -90.0 && lat <= 90.0 && lng >= -180.0 && lng <= 180.0
}
