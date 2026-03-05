from fastapi import FastAPI, HTTPException, Query
import redis
import os
from typing import Dict

from core.h3_mapper import get_h3_hex, is_valid_coordinate

app = FastAPI(
    title="SmoothSwitch Location Advisory API",
    description="Provides privacy-first network quality recommendations based on H3 Hex grids."
)

# In production this would come from env vars
redis_client = redis.Redis(host=os.getenv("REDIS_HOST", "localhost"), port=6379, db=0)

CARRIERS = ["MTN", "GLO", "AIRTEL", "9MOBILE"]

@app.get("/v1/advisory/quality")
async def get_advisory_quality(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude")
) -> Dict[str, any]:
    """
    Returns the recommended carrier for a given GPS coordinate.
    Raw GPS coordinates are immediately discarded after being mapped to a ~500m H3 hex.
    """
    if not is_valid_coordinate(lat, lng):
        raise HTTPException(status_code=400, detail="Invalid GPS coordinates")

    # Privacy enforcement: Convert exact GPS to generalized hex grid index
    hex_index = get_h3_hex(lat, lng)
    
    scores = {}
    for carrier in CARRIERS:
        key = f"advisory:h3:{hex_index}:{carrier}"
        raw_score = redis_client.get(key)
        
        if raw_score:
            scores[carrier] = round(float(raw_score), 2)
        else:
            # Fallback if no data collected in this region yet
            scores[carrier] = 50.0 
            
    # Determine the recommended carrier (highest score)
    best_carrier = max(scores, key=scores.get)
    
    return {
        "location_grid": hex_index, # We return the grid ID, NOT the lat/lng
        "resolution": "9 (~500m)",
        "recommendation": best_carrier,
        "grid_scores": scores
    }
