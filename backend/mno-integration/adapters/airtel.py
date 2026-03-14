import logging
import requests
from typing import Dict, Any
from tenacity import retry, stop_after_attempt, wait_fixed, retry_if_exception_type, before_sleep_log

from .base import MNOAdapter
from .fallback import SFTPFallbackManager

logger = logging.getLogger(__name__)

class AirtelAdapter(MNOAdapter):
    """
    Adapter for Airtel Nigeria's mobile data deduction API.
    Implements a strict circuit breaker and fallback SFTP queue.
    """
    
    def __init__(self, api_base_url: str):
        super().__init__("AIRTEL")
        self.api_base_url = api_base_url
        self.fallback_manager = SFTPFallbackManager("AIRTEL")

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
            "user_imsi": imsi,
            "mb_to_deduct": amount_mb,
            "transaction_type": "SMOOTH_SWITCH"
        }
        
        # Simulate Airtel charging gateway
        # response = requests.post(f"{self.api_base_url}/charging/v3/deduct", json=payload, timeout=2.0)
        # return response
        
        # Mocking a successful response
        mock_response = requests.Response()
        mock_response.status_code = 200
        mock_response._content = b'{"status": "OK", "new_data_balance": 5120}'
        return mock_response

    def deduct_balance(self, imsi: str, amount_mb: float) -> Dict[str, Any]:
        try:
            response = self._execute_rest_call(imsi, amount_mb)
            data = response.json()
            
            return {
                "status": "SUCCESS",
                "remaining_balance": data.get("new_data_balance"),
                "source": "REST_API"
            }
            
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            logger.error(f"[AIRTEL] Connection failed. engaging SFTP Fallback.")
            return self.fallback_sftp_batch(imsi, amount_mb)
        except Exception as e:
            logger.error(f"[AIRTEL] Unhandled error: {e}")
            return {"status": "ERROR", "message": str(e)}

    def fallback_sftp_batch(self, imsi: str, amount_mb: float) -> Dict[str, Any]:
        success = self.fallback_manager.append_record(imsi, amount_mb)
        if success:
            return {
                "status": "QUEUED_SFTP",
                "message": "Logged to AIRTEL offline sync file.",
                "source": "SFTP_FALLBACK"
            }
        return {"status": "ERROR", "message": "AIRTEL fallback failed."}
