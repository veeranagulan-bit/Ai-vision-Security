from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GuardianVision AI"
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "guardianvision"
    
    # Model config
    CONFIDENCE_THRESHOLD: float = 0.70
    AI_MODE: str = "demo" # or "real"

    class Config:
        env_file = ".env"

settings = Settings()
