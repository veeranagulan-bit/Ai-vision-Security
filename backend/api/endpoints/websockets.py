from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.ai_engine import ai_engine
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

manager = ConnectionManager()

@router.websocket("/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Receive frame data (assuming base64 or binary, in this demo we just accept JSON or text)
            data = await websocket.receive_text()
            
            # Simulate analyzing the frame
            # In a real scenario, decode base64 to numpy array and pass to YOLO
            results = await ai_engine.analyze_frame(data)
            
            # Send results back to the client
            await websocket.send_json(results)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
