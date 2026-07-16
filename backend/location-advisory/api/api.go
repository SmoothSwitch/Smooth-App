package api

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/smoothswitch/location-advisory/core"
)

var carriers = []string{"MTN", "GLO", "AIRTEL", "9MOBILE"}

type Router struct {
	redisClient *redis.Client
}

func NewRouter(redisClient *redis.Client) *Router {
	return &Router{redisClient: redisClient}
}

func (r *Router) RegisterRoutes(engine *gin.Engine) {
	v1 := engine.Group("/v1/advisory")
	{
		v1.GET("/quality", r.getAdvisoryQuality)
	}
}

func (r *Router) getAdvisoryQuality(c *gin.Context) {
	latStr := c.Query("lat")
	lngStr := c.Query("lng")

	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Invalid latitude"})
		return
	}

	lng, err := strconv.ParseFloat(lngStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Invalid longitude"})
		return
	}

	if !core.IsValidCoordinate(lat, lng) {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Invalid GPS coordinates"})
		return
	}

	// Privacy enforcement: Convert exact GPS to generalized hex grid index
	hexIndex := core.GetH3Hex(lat, lng)

	scores := make(map[string]float64)
	ctx := context.Background()

	var bestCarrier string
	var maxScore float64 = -1.0

	for _, carrier := range carriers {
		key := fmt.Sprintf("advisory:h3:%s:%s", hexIndex, carrier)
		val, err := r.redisClient.Get(ctx, key).Float64()
		if err == redis.Nil {
			// Fallback if no data collected in this region yet
			val = 50.0
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"detail": "Internal server error"})
			return
		}

		scores[carrier] = val
		if val > maxScore {
			maxScore = val
			bestCarrier = carrier
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"location_grid":  hexIndex,
		"resolution":     "9 (~500m)",
		"recommendation": bestCarrier,
		"grid_scores":    scores,
	})
}
