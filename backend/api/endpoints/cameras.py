from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_cameras():
    return [{"id": "cam-1", "name": "Main Entrance", "status": "ONLINE"}]
