package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smoothswitch/mno-integration/adapters"
)

type Router struct {
	adapters map[string]adapters.MNOAdapter
}

func NewRouter(adaptersMap map[string]adapters.MNOAdapter) *Router {
	return &Router{adapters: adaptersMap}
}

func (r *Router) RegisterRoutes(engine *gin.Engine) {
	v1 := engine.Group("/v1/mno")
	{
		v1.POST("/deduct", r.deductBalance)
	}
}

type DeductRequest struct {
	IMSI     string  `json:"imsi" binding:"required"`
	Carrier  string  `json:"carrier" binding:"required"`
	AmountMB float64 `json:"amount_mb" binding:"required"`
}

func (r *Router) deductBalance(c *gin.Context) {
	var req DeductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "imsi, carrier, and amount_mb are required"})
		return
	}

	adapter, ok := r.adapters[req.Carrier]
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported carrier"})
		return
	}

	result := adapter.DeductBalance(req.IMSI, req.AmountMB)

	if result.Status == "ERROR" {
		c.JSON(http.StatusInternalServerError, result)
		return
	}

	// 202 Accepted for QUEUED_SFTP, 200 OK for SUCCESS
	status := http.StatusOK
	if result.Status == "QUEUED_SFTP" {
		status = http.StatusAccepted
	}

	c.JSON(status, result)
}
