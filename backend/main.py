from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import api_router

app = FastAPI(
    title="GuardianVision AI API",
    description="Backend API for AI Security Surveillance & Weapon Detection",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"status": "online", "message": "GuardianVision AI Backend API"}
