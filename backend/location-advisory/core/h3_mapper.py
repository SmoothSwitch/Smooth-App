import h3

# Constants defined by LLD
H3_RESOLUTION = 9  # Approx 500m radius

def get_h3_hex(lat: float, lng: float) -> str:
    """
    Converts a raw GPS coordinate into an H3 hexagonal grid index.
    
    This abstracts away exact user location into a ~500m hex tile,
    ensuring compliance with our zero-raw-GPS privacy policy.
    
    Args:
        lat: Latitude of the device
        lng: Longitude of the device
        
    Returns:
        The string representation of the H3 index (e.g., '89283082a0fffff')
    """
    # h3.geo_to_h3 is used in h3-py v3.7.x
    return h3.geo_to_h3(lat, lng, H3_RESOLUTION)

def is_valid_coordinate(lat: float, lng: float) -> bool:
    """Validates real-world bounds"""
    return -90.0 <= lat <= 90.0 and -180.0 <= lng <= 180.0
