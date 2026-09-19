"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Camera, StopCircle, Pause, AlertTriangle } from "lucide-react";

export default function LiveCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera", err);
      alert("Camera permission denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsStreaming(false);
      setDetections([]);
    }
  };

  // Mock detection loop for UI purposes (simulating backend WebSocket)
  useEffect(() => {
    if (!isStreaming) return;
    
    const interval = setInterval(() => {
      // 10% chance to detect something randomly to demonstrate the UI
      if (Math.random() > 0.9) {
        setDetections([{
          class_name: "gun",
          confidence: (Math.random() * 0.2 + 0.75).toFixed(2),
          x: Math.random() * 200 + 50,
          y: Math.random() * 100 + 50,
          width: 150,
          height: 100
        }]);
      } else {
        setDetections([]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Draw bounding boxes
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear previous
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    detections.forEach(det => {
      ctx.strokeStyle = "#ff3333";
      ctx.lineWidth = 3;
      ctx.strokeRect(det.x, det.y, det.width, det.height);

      ctx.fillStyle = "#ff3333";
      ctx.fillRect(det.x, det.y - 25, det.width, 25);
      
      ctx.fillStyle = "#fff";
      ctx.font = "16px Arial";
      ctx.fillText(`${det.class_name.toUpperCase()} ${(parseFloat(det.confidence)*100).toFixed(0)}%`, det.x + 5, det.y - 8);
    });

  }, [detections]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <nav className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold text-electric-blue neon-text">GUARDIANVISION AI</Link>
        <span className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-400">Live AI Camera</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden neon-border">
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 flex-col gap-4">
                <Camera size={48} className="text-gray-700" />
                <p>Camera is offline. Click Start to begin AI scanning.</p>
              </div>
            )}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay Canvas for Bounding Boxes */}
            <canvas 
              ref={canvasRef}
              width={640}
              height={360}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
            
            {/* Threat Warning Overlay */}
            {detections.length > 0 && (
              <div className="absolute top-4 right-4 bg-threat-red text-white px-4 py-2 rounded font-bold flex items-center gap-2 threat-pulse">
                <AlertTriangle />
                POTENTIAL WEAPON DETECTED
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            {!isStreaming ? (
              <button onClick={startCamera} className="bg-electric-blue text-navy px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-opacity-80">
                <Camera size={20} /> START CAMERA
              </button>
            ) : (
              <button onClick={stopCamera} className="bg-gray-700 text-white px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-gray-600">
                <StopCircle size={20} /> STOP CAMERA
              </button>
            )}
            <button className="border border-gray-600 px-6 py-2 rounded flex items-center gap-2 hover:bg-gray-800">
              <Pause size={20} /> PAUSE DETECTION
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-xl font-bold text-electric-blue mb-4">DETECTION STATUS</h3>
            
            {detections.length > 0 ? (
              <div className="space-y-4">
                {detections.map((d, i) => (
                  <div key={i} className="bg-threat-red/10 border border-threat-red p-4 rounded text-threat-red">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold uppercase text-lg">{d.class_name}</span>
                      <span className="font-bold">{(parseFloat(d.confidence)*100).toFixed(1)}%</span>
                    </div>
                    <p className="text-sm opacity-80">Risk Level: HIGH</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-green-500 p-4 border border-green-500/30 bg-green-500/10 rounded">
                ● STATUS: CLEAR. Scanning for threats...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
