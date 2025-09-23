import os
from datetime import timedelta

class Config:
    # Configuração do banco de dados PostgreSQL
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    PROJECT_DIR = os.path.dirname(BASE_DIR)
    INSTANCE_DIR = os.path.join(PROJECT_DIR, 'instance')
    
    # Garantir que o diretório instance existe
    os.makedirs(INSTANCE_DIR, exist_ok=True)
    
    # Configuração PostgreSQL
    POSTGRES_USER = os.environ.get("POSTGRES_USER", "meialua_user")
    POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD", "meialua_password")
    POSTGRES_HOST = os.environ.get("POSTGRES_HOST", "localhost")
    POSTGRES_PORT = os.environ.get("POSTGRES_PORT", "5432")
    POSTGRES_DB = os.environ.get("POSTGRES_DB", "meialua_db")
    
    # Usando SQLite como banco de dados padrão
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", 
        f"sqlite:///{os.path.join(INSTANCE_DIR, 'meialua.db')}"
    )
    
    # Mantendo a referência para o fallback, mas não será necessário
    SQLALCHEMY_DATABASE_URI_FALLBACK = SQLALCHEMY_DATABASE_URI
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET", "meialua-super-secret-key-2024-production")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    CORS_HEADERS = "Content-Type"
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:5500").split(",")
    SCHEDULE_DAYS = os.environ.get("SCHEDULE_DAYS", "Tue,Wed,Thu").split(",")
    SCHEDULE_START = os.environ.get("SCHEDULE_START", "06:00")
    SCHEDULE_END = os.environ.get("SCHEDULE_END", "12:00")
    ALLOW_STAFF_OVERRIDE = os.environ.get("ALLOW_STAFF_OVERRIDE", "true").lower() == "true"
    APP_TIMEZONE = os.environ.get("APP_TIMEZONE", "America/Bahia")
    
    # Configuração da Google Maps API
    GOOGLE_MAPS_API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY")


