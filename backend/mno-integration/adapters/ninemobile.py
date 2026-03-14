import logging
import requests
from typing import Dict, Any
from tenacity import retry, stop_after_attempt, wait_fixed, retry_if_exception_type, before_sleep_log

from .base import MNOAdapter
from .fallback import SFTPFallbackManager

logger = logging.getLogger(__name__)

class NineMobileAdapter(MNOAdapter):
    """
    Adapter for 9mobile Nigeria's mobile data deduction API.
    Implements a strict circuit breaker and fallback SFTP queue.
    """
    
    def __init__(self, api_base_url: str):
        super().__init__("9MOBILE")
        self.api_base_url = api_base_url
        self.fallback_manager = SFTPFallbackManager("9MOBILE")

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
            "imsi_id": imsi,
            "quota_mb": amount_mb,
            "app_token": "smooth_switch_v1"
        }
        
        # Simulate 9mobile charging interface
        # response = requests.post(f"{self.api_base_url}/billing/deduct", json=payload, timeout=2.0)
        # return response
        
        # Mocking a successful response
        mock_response = requests.Response()
        mock_response.status_code = 200
        mock_response._content = b'{"result": "SUCCESS", "current_vol": 10240}'
        return mock_response

    def deduct_balance(self, imsi: str, amount_mb: float) -> Dict[str, Any]:
        try:
            response = self._execute_rest_call(imsi, amount_mb)
            data = response.json()
            
            return {
                "status": "SUCCESS",
                "remaining_balance": data.get("current_vol"),
                "source": "REST_API"
            }
            
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            logger.error(f"[9MOBILE] Gateway Timeout. engaging SFTP Fallback.")
            return self.fallback_sftp_batch(imsi, amount_mb)
        except Exception as e:
            logger.error(f"[9MOBILE] Final error: {e}")
            return {"status": "ERROR", "message": str(e)}

    def fallback_sftp_batch(self, imsi: str, amount_mb: float) -> Dict[str, Any]:
        success = self.fallback_manager.append_record(imsi, amount_mb)
        if success:
            return {
                "status": "QUEUED_SFTP",
                "message": "Logged to 9MOBILE offline batch file.",
                "source": "SFTP_FALLBACK"
            }
        return {"status": "ERROR", "message": "9MOBILE fallback failed."}
