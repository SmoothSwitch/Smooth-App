from abc import ABC, abstractmethod
from typing import Dict, Any

class MNOAdapter(ABC):
    """
    Abstract base class for all Mobile Network Operator adapters.
    Ensures a consistent interface for the orchestrator to interact with different carriers.
    """

    def __init__(self, carrier_name: str):
        self.carrier_name = carrier_name

    @abstractmethod
    def deduct_balance(self, imsi: str, amount_mb: float) -> Dict[str, Any]:
        """
        Deduct the specified data amount from the user's pool on the MNO's system.
        
        Args:
            imsi (str): The subscriber identity.
            amount_mb (float): The amount of data in MB to deduct.
            
        Returns:
            Dict containing the transaction status and remaining balance.
        """
        pass

    @abstractmethod
    def fallback_sftp_batch(self, imsi: str, amount_mb: float) -> bool:
        """
        Write the deduction to a local CSV buffer to be uploaded via SFTP
        if the MNO's REST API is down.
        """
        pass
