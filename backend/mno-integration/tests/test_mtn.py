import unittest
from adapters.mtn import MTNAdapter
from adapters.fallback import SFTPFallbackManager
import os

class TestMTNAdapter(unittest.TestCase):
    
    def setUp(self):
        self.adapter = MTNAdapter("http://mock-mtn.local")
        # Ensure clean state for fallback
        if os.path.exists(self.adapter.fallback_manager.current_file):
            os.remove(self.adapter.fallback_manager.current_file)

    def test_circuit_breaker_and_fallback(self):
        # We designed the mock class to inherently fail with a ConnectionError
        # This should trigger Tenacity 3x, then fall down to our except block and trigger the SFTP fallback
        
        result = self.adapter.deduct_balance("123456789012345", 50.0)
        
        # Validate that it hit the fallback
        self.assertEqual(result["status"], "QUEUED_SFTP")
        self.assertEqual(result["source"], "SFTP_FALLBACK")
        
        # Validate that a file was written to disk
        self.assertTrue(os.path.exists(self.adapter.fallback_manager.current_file))

if __name__ == '__main__':
    unittest.main()
