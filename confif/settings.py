import os

class BaseConfig:
    """Base configuration settings."""
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default-secret-key')
    
    # API Configuration
    API_VERSION = 'v1'
    API_TITLE = 'Velora College API'
    
    # CORS Configuration
    CORS_ORIGINS = ['http://localhost:3000', 'https://velora-college.vercel.app']
    
    # Firebase Configuration
    FIREBASE_PROJECT_ID = os.environ.get('FIREBASE_PROJECT_ID')
    
    # OpenAI Configuration
    OPENAI_MODEL = 'gpt-3.5-turbo'

class DevelopmentConfig(BaseConfig):
    """Development configuration settings."""
    DEBUG = True
    CORS_ORIGINS = ['*']

class TestingConfig(BaseConfig):
    """Testing configuration settings."""
    TESTING = True
    DEBUG = True

class ProductionConfig(BaseConfig):
    """Production configuration settings."""
    # In production, CORS origins should be strictly defined
    CORS_ORIGINS = [
        'https://velora-college.vercel.app',
        'https://www.velora-college.com'
    ]

def get_settings():
    """Get the appropriate settings based on environment."""
    env = os.environ.get('FLASK_ENV', 'development')
    
    if env == 'production':
        return ProductionConfig
    elif env == 'testing':
        return TestingConfig
    else:
        return DevelopmentConfig
