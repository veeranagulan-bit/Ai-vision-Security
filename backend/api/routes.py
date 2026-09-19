from fastapi import APIRouter
from .endpoints import analyze, cameras, detections, analytics, websockets

api_router = APIRouter()

api_router.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
api_router.include_router(cameras.router, prefix="/cameras", tags=["cameras"])
api_router.include_router(detections.router, prefix="/detections", tags=["detections"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(websockets.router, prefix="/ws", tags=["websockets"])
