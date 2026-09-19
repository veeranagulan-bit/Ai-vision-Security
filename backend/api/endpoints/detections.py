from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_detections():
    return [
        {
            "id": "det-1",
            "object": "Gun",
            "confidence": 0.96,
            "source": "Camera 01",
            "time": "11:42",
            "status": "Alert"
        }
    ]
