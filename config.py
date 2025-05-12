"""  Archivo de configuración de la aplicación. """
import os
from datetime import timedelta
from dotenv import load_dotenv

class Config:
    """Configuración de la aplicación."""
    # Carga las variables desde el archivo .env
    load_dotenv()

    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY', 'dev_key')
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 280,
        'pool_timeout': 30,
        'pool_size': 5,
        'max_overflow': 10
    }
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt_dev_key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=6)
    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_OAUTH_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_OAUTH_CLIENT_SECRET')
    JWT_TOKEN_LOCATION = os.getenv('JWT_TOKEN_LOCATION', 'cookies')
    JWT_COOKIE_SECURE = os.getenv('JWT_COOKIE_SECURE', 'False')
    JWT_COOKIE_HTTPONLY = os.getenv('JWT_COOKIE_HTTPONLY', 'False')
