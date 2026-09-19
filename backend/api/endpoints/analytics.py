from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_analytics():
    return {
        "total_scans": 1248,
        "threats_detected": 27,
        "live_cameras": 4,
        "detection_accuracy": 94.6
    }
