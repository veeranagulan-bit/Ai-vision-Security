import tempfile
import cv2
import os
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from services.ai_engine import ai_engine

router = APIRouter()

class DetectionResult(BaseModel):
    class_name: str
    confidence: float
    x: float
    y: float
    width: float
    height: float

class AnalysisResponse(BaseModel):
    status: str
    detections: list[DetectionResult]

@router.post("/image", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        # Check if it's a video based on content type or extension
        is_video = file.content_type and file.content_type.startswith("video/")
        if not is_video and file.filename:
            is_video = file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.webm'))
            
        if is_video:
            # Save to temp file to read with cv2
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
                tmp.write(contents)
                tmp_path = tmp.name
            
            cap = cv2.VideoCapture(tmp_path)
            ret, frame = cap.read()
            cap.release()
            os.remove(tmp_path)
            
            if not ret:
                raise HTTPException(status_code=400, detail="Could not read video frame")
                
            # Convert BGR to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            from PIL import Image
            import io
            img = Image.fromarray(frame_rgb)
            buf = io.BytesIO()
            img.save(buf, format="JPEG")
            contents = buf.getvalue()
            
        results = ai_engine.analyze_image(contents)
        return results
    except Exception as e:
        print(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/video")
async def analyze_video(file: UploadFile = File(...)):
    # Not fully implemented for video in this demo, just return processing
    return {"status": "processing", "video_id": "demo-123"}
