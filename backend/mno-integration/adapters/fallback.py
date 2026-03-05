import os
import csv
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class SFTPFallbackManager:
    """
    Manages writing offline deductions to a CSV cache.
    A separate cron job will use Paramiko to upload these to the MNO's SFTP server
    when the REST API outage exceeds 5 minutes.
    """
    
    def __init__(self, carrier_name: str, cache_dir: str = "/tmp/smoothswitch/sftp"):
        self.carrier_name = carrier_name
        self.cache_dir = cache_dir
        os.makedirs(self.cache_dir, exist_ok=True)
        
        # Format: MTN_fallback_20231024.csv
        self.current_file = os.path.join(
            self.cache_dir, 
            f"{self.carrier_name}_fallback_{datetime.now().strftime('%Y%m%d')}.csv"
        )
        self._ensure_header()

    def _ensure_header(self):
        if not os.path.exists(self.current_file):
            with open(self.current_file, mode='w', newline='') as f:
                writer = csv.writer(f)
                writer.writerow(["timestamp", "imsi", "deduction_mb", "status"])

    def append_record(self, imsi: str, amount_mb: float) -> bool:
        try:
            with open(self.current_file, mode='a', newline='') as f:
                writer = csv.writer(f)
                writer.writerow([
                    datetime.utcnow().isoformat(),
                    imsi,
                    amount_mb,
                    "PENDING_SFTP"
                ])
            logger.info(f"[{self.carrier_name}] Fallback record written for IMSI {imsi}")
            return True
        except Exception as e:
            logger.error(f"[{self.carrier_name}] Failed to write SFTP fallback: {e}")
            return False
