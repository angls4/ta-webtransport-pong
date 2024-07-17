import hashlib
import string
import asyncio

def hash_number_to_alphanumeric(num, length=5):
    # Convert number to string and hash it using SHA-256
    num_str = str(num).encode()
    hash_obj = hashlib.sha256(num_str)

    # Get the hexadecimal digest of the hash
    hex_digest = hash_obj.hexdigest()

    # Convert the hexadecimal to an integer
    int_digest = int(hex_digest, 16)

    # Define the alphanumeric characters
    chars = string.ascii_letters + string.digits

    # Convert the integer to a base-62 (alphanumeric) representation
    base = len(chars)
    alphanumeric = ""
    while int_digest > 0 and len(alphanumeric) < length:
        alphanumeric = chars[int_digest % base] + alphanumeric
        int_digest //= base

    # Pad with leading zeros if necessary
    return alphanumeric.zfill(length)

async def setInterval(func, seconds, *args, **kwargs):
    while True:
        await asyncio.sleep(seconds)
        if not func(*args, **kwargs):
            break

