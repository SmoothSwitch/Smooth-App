import unittest
from core.h3_mapper import get_h3_hex, is_valid_coordinate

class TestH3Mapper(unittest.TestCase):
    def test_valid_coordinates(self):
        self.assertTrue(is_valid_coordinate(6.5244, 3.3792)) # Lagos
        self.assertFalse(is_valid_coordinate(91.0, 0.0))    # Invalid Lat
        self.assertFalse(is_valid_coordinate(0.0, 181.0))   # Invalid Lng
        
    def test_h3_conversion(self):
        # Using a known coordinate (Lagos, Nigeria)
        lat, lng = 6.5244, 3.3792
        hex_index = get_h3_hex(lat, lng)
        
        # H3 indices are string representations of 64-bit integers
        self.assertIsInstance(hex_index, str)
        self.assertTrue(len(hex_index) > 10)

if __name__ == '__main__':
    unittest.main()
