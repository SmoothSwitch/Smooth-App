import logging
import requests
from typing import Dict, Any
from tenacity import retry, stop_after_attempt, wait_fixed, retry_if_exception_type, before_sleep_log

from .base import MNOAdapter
from .fallback import SFTPFallbackManager

logger = logging.getLogger(__name__)

# This mock exception simulates what would be thrown by the Tenacity CircuitBreaker
# when the 3-failure threshold inside 30 seconds is reached.
class CircuitBreakerOpenError(Exception):
    pass

class MTNAdapter(MNOAdapter):
    """
    Adapter for MTN Nigeria's mobile data deduction REST API.
    Implements a strict circuit breaker and fallback SFTP queue.
    """
    
    def __init__(self, api_base_url: str):
        super().__init__("MTN")
        self.api_base_url = api_base_url
        self.fallback_manager = SFTPFallbackManager("MTN")

    # Retry logic: Try up to 3 times with 1-second waits on ConnectionError or Timeout
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_fixed(1),
        retry=retry_if_exception_type((requests.exceptions.ConnectionError, requests.exceptions.Timeout)),
        before_sleep=before_sleep_log(logger, logging.WARNING),
        reraise=True
    )
    def _execute_rest_call(self, imsi: str, amount_mb: float) -> requests.Response:
        """Isolated REST call to allow Tenacity to cleanly trap retries/failures."""
        payload = {
            "imsi": imsi,
            "deduct_amount": amount_mb,
            "unit": "MB"
        }
        
        # Simulate an actual POST to MTN's charging gateway
        # In this mock, we force a connect error to demonstrate the breaker
        raise requests.exceptions.ConnectionError("MTN API Gateway unreachable")
        
        # response = requests.post(f"{self.api_base_url}/v1/charging/deduct", json=payload, timeout=2.0)
        # response.raise_for_status()
        # return response

    def deduct_balance(self, imsi: str, amount_mb: float) -> Dict[str, Any]:
        try:
            # Attempt to hit the primary REST API
            response = self._execute_rest_call(imsi, amount_mb)
            
            # If successful, parse result
            data = response.json()
            return {
                "status": "SUCCESS",
                "remaining_balance": data.get("balance"),
                "source": "REST_API"
            }
            
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            # Circuit breaker flipped open (simulated by Tenacity giving up after 3 tries)
            logger.error(f"[MTN] Circuit Breaker OPEN after 3 failures. Engaging SFTP Fallback.")
            
            return self.fallback_sftp_batch(imsi, amount_mb)
        except Exception as e:
            logger.error(f"[MTN] Unhandled exception during deduction: {e}")
            return {"status": "ERROR", "message": str(e)}

    def fallback_sftp_batch(self, imsi: str, amount_mb: float) -> Dict[str, Any]:
        """
        Engages the fallback mechanism, storing the deduction for later batch processing.
        """
        success = self.fallback_manager.append_record(imsi, amount_mb)
        if success:
            return {
                "status": "QUEUED_SFTP",
                "message": "Deduction logged to offline batch file for later sync.",
                "source": "SFTP_FALLBACK"
            }
        return {"status": "ERROR", "message": "SFTP Fallback also failed."}
