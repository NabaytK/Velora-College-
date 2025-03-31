import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class EncryptionService:
    """
    Service for encrypting and decrypting sensitive data using Fernet
    (symmetric encryption)
    """
    
    def __init__(self, encryption_key=None, salt=None):
        """
        Initialize the encryption service with a key
        
        Args:
            encryption_key (str, optional): Base64 encoded key or passphrase
            salt (bytes, optional): Salt for key derivation
        """
        # If no key is provided, try to get from environment
        self.encryption_key = encryption_key or os.environ.get('ENCRYPTION_KEY')
        
        # If we still don't have a key, generate one and warn user
        if not self.encryption_key:
            print("WARNING: No encryption key provided. Generating a random key for this session only.")
            print("In production, you should specify a key and keep it secure.")
            self._key = Fernet.generate_key()
        else:
            # If provided key is not a valid Fernet key (32 url-safe base64-encoded bytes),
            # derive one using the provided key as a passphrase
            try:
                # Try to decode it as a Fernet key
                base64.urlsafe_b64decode(self.encryption_key)
                self._key = self.encryption_key.encode()
            except Exception:
                # Use the provided key as a passphrase to derive a Fernet key
                self._key = self._derive_key(self.encryption_key, salt)
        
        # Initialize Fernet cipher
        self.cipher = Fernet(self._key)
    
    def _derive_key(self, passphrase, salt=None):
        """
        Derive a Fernet key from a passphrase
        
        Args:
            passphrase (str): Passphrase to derive key from
            salt (bytes, optional): Salt for key derivation
            
        Returns:
            bytes: Derived key
        """
        if not salt:
            # Use a fixed salt in production to generate consistent keys
            # In a real app, this should be securely stored
            salt = b'velora-encryption-salt'
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        
        # Derive a key from the passphrase
        key = base64.urlsafe_b64encode(kdf.derive(passphrase.encode()))
        return key
    
    def encrypt(self, data):
        """
        Encrypt data using Fernet symmetric encryption
        
        Args:
            data (str): Plain text data to encrypt
            
        Returns:
            str: Base64 encoded encrypted data
        """
        if not data:
            return None
            
        # Convert string to bytes
        data_bytes = data.encode()
        
        # Encrypt
        encrypted_bytes = self.cipher.encrypt(data_bytes)
        
        # Convert to base64 string for storage
        encrypted_data = encrypted_bytes.decode()
        
        return encrypted_data
    
    def decrypt(self, encrypted_data):
        """
        Decrypt data using Fernet symmetric encryption
        
        Args:
            encrypted_data (str): Base64 encoded encrypted data
            
        Returns:
            str: Decrypted plain text
        """
        if not encrypted_data:
            return None
            
        # Convert back to bytes
        encrypted_bytes = encrypted_data.encode()
        
        # Decrypt
        try:
            decrypted_bytes = self.cipher.decrypt(encrypted_bytes)
            
            # Convert back to string
            decrypted_data = decrypted_bytes.decode()
            
            return decrypted_data
        except Exception as e:
            print(f"Error decrypting data: {e}")
            return None
