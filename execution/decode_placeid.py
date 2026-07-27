import base64
import struct

def hex_to_place_id(hex_cid1, hex_cid2):
    # Construct Google Place ID protobuf bytes
    # Protobuf structure for Place ID:
    # 0x0a, 0x10, 8 bytes of cid1, 0x12, 0x10, 8 bytes of cid2
    cid1 = int(hex_cid1, 16)
    cid2 = int(hex_cid2, 16)
    
    # Pack as little-endian or big-endian 64-bit uint
    # Let's test standard struct packing
    bytes1 = struct.pack('<Q', cid1)
    bytes2 = struct.pack('<Q', cid2)
    
    proto = bytes([0x0a, 0x10]) + bytes1 + bytes([0x12, 0x10]) + bytes2
    place_id = base64.b64encode(proto).decode('utf-8').rstrip('=')
    return place_id

cid1_hex = "0x89e4e5d68ce37a53"
cid2_hex = "0x9f9a291c8092f71d"

pid = hex_to_place_id(cid1_hex, cid2_hex)
print(f"Computed Place ID: {pid}")
print(f"Test URL: https://search.google.com/local/writereview?placeid={pid}")
