"use client";

import Link from "next/link";
import { UploadCloud, FileVideo, ShieldAlert, ShieldCheck, Scan, Loader2, Database, Image as ImageIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DataNode from "@/components/3d/DataNode";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<"idle" | "uploading" | "processing" | "result">("idle");
  const [result, setResult] = useState<any>(null);
  
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const [imgScale, setImgScale] = useState({ x: 1, y: 1 });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    setStep("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStep("processing");
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/api/analyze/image`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "API request failed");
      }
      
      const data = await response.json();
      
      setResult({
        status: data.status === "detected" ? "THREAT DETECTED" : "CLEAR",
        frames_analyzed: 1,
        threat_events: data.detections.length,
        detections: data.detections.map((d: any) => ({
          object: d.class_name,
          confidence: (d.confidence * 100).toFixed(1) + "%",
          time: "00:00",
          x: d.x, y: d.y, width: d.width, height: d.height
        })),
        imageUrl: URL.createObjectURL(file)
      });
      
      setStep("result");
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message || "Failed to connect to the AI backend."}`);
      setStep("idle");
    }
  };

  // Calculate scale factor for bounding boxes to match rendered media size
  useEffect(() => {
    if (step === "result" && mediaRef.current) {
      const handleResize = () => {
        if (mediaRef.current) {
          const el = mediaRef.current;
          let naturalWidth, naturalHeight;
          if (el instanceof HTMLImageElement) {
            naturalWidth = el.naturalWidth;
            naturalHeight = el.naturalHeight;
          } else if (el instanceof HTMLVideoElement) {
            naturalWidth = el.videoWidth;
            naturalHeight = el.videoHeight;
          }
          if (naturalWidth && naturalHeight) {
            setImgScale({
              x: el.clientWidth / naturalWidth,
              y: el.clientHeight / naturalHeight
            });
          }
        }
      };
      
      if (mediaRef.current instanceof HTMLImageElement) {
         mediaRef.current.onload = handleResize;
      } else if (mediaRef.current instanceof HTMLVideoElement) {
         mediaRef.current.onloadeddata = handleResize;
      }
      
      handleResize(); // immediate check
      
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [step, result]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <nav className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold text-electric-blue neon-text">GUARDIANVISION AI</Link>
        <span className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-400">Advanced AI Scanner</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Left Column: Upload & Visualizer */}
        <div className="space-y-6">
          
          {step !== "result" && (
            <div 
              className="border-2 border-dashed border-gray-700 hover:border-electric-blue rounded-xl p-12 text-center transition-colors cursor-pointer bg-gray-900/30 group"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <UploadCloud size={64} className="mx-auto text-gray-500 mb-4 group-hover:text-electric-blue transition-colors" />
              <h3 className="text-2xl font-bold mb-2">Initialize Security Scan</h3>
              <p className="text-gray-500 text-sm mb-6">Drag and drop footage or click to browse (JPG, PNG, WEBM, MP4)</p>
              
              <input 
                type="file" 
                className="hidden" 
                id="file-upload" 
                accept="video/*,image/*" 
                onChange={(e) => {
                  if(e.target.files) setFile(e.target.files[0]);
                }}
              />
              <label htmlFor="file-upload" className="bg-gray-800 text-white px-8 py-3 rounded-full text-sm cursor-pointer hover:bg-gray-700 transition-colors inline-block font-bold">
                BROWSE FILES
              </label>
            </div>
          )}

          {file && step === "idle" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-electric-blue">
              <div className="flex items-center gap-4">
                <div className="bg-electric-blue/20 p-3 rounded-full">
                  {file.type.startsWith("video/") ? <FileVideo className="text-electric-blue" size={24} /> : <ImageIcon className="text-electric-blue" size={24} />}
                </div>
                <div>
                  <p className="font-bold text-lg max-w-[200px] truncate">{file.name}</p>
                  <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis</p>
                </div>
              </div>
              <button 
                onClick={startAnalysis}
                className="bg-electric-blue text-black px-6 py-3 rounded-full font-bold hover:bg-opacity-80 transition-opacity whitespace-nowrap shadow-[0_0_15px_rgba(0,210,255,0.5)] cursor-pointer"
              >
                START AI ANALYSIS
              </button>
            </motion.div>
          )}

          {/* Render Result Image with Bounding Boxes */}
          {step === "result" && result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-4 border border-gray-800 rounded-xl relative">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-300">Analysis Frame</h3>
                 <span className="text-xs text-gray-500 truncate max-w-[200px]">{file?.name}</span>
               </div>
               
               <div className="relative w-full rounded overflow-hidden bg-black flex items-center justify-center min-h-[200px]">
                 <div className="relative inline-block">
                   {file?.type.startsWith('video/') ? (
                     <video 
                       ref={mediaRef as React.RefObject<HTMLVideoElement>}
                       src={result.imageUrl} 
                       className="max-h-[500px] w-auto block"
                       controls
                       onLoadedData={() => setResult({...result})}
                     />
                   ) : (
                     <img 
                       ref={mediaRef as React.RefObject<HTMLImageElement>}
                       src={result.imageUrl} 
                       alt="Analyzed Frame" 
                       className="max-h-[500px] w-auto block"
                       onLoad={() => setResult({...result})}
                     />
                   )}
                   
                   {/* Render Bounding Boxes */}
                   {result.detections.map((det: any, idx: number) => (
                     <div 
                       key={idx}
                       className="absolute border-2 border-threat-red shadow-[0_0_10px_rgba(255,51,51,0.5)] pointer-events-none"
                       style={{
                         left: det.x * imgScale.x,
                         top: det.y * imgScale.y,
                         width: det.width * imgScale.x,
                         height: det.height * imgScale.y,
                       }}
                     >
                       {/* Label */}
                       <div className="absolute top-0 left-0 -translate-y-full bg-threat-red text-white text-xs font-bold px-1 whitespace-nowrap">
                         {det.object.toUpperCase()} {det.confidence}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </motion.div>
          )}

          {/* 3D Visualizer when active */}
          <AnimatePresence>
            {(step === "uploading" || step === "processing") && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }}
                className="glass-panel rounded-xl overflow-hidden relative border border-electric-blue/30"
              >
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-electric-blue font-mono text-sm bg-black/50 px-3 py-1 rounded">
                  <Database size={16} className="animate-pulse" />
                  {step === "uploading" ? "INGESTING MEDIA..." : "NEURAL NET ACTIVE..."}
                </div>
                <div className="h-[400px]">
                  <DataNode />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Status & Results */}
        <div>
          {step === "idle" && (
            <div className="glass-panel p-8 h-full flex flex-col border border-gray-800 relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <h2 className="text-2xl font-bold text-electric-blue mb-6 border-b border-gray-800 pb-4 flex items-center gap-2">
                <Scan size={24} /> System Directives
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">Detection Capabilities</h3>
                  <p className="text-sm text-gray-400 mb-3">The neural network is trained to instantly identify the following harmful objects:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-threat-red/10 border border-threat-red/30 text-threat-red px-3 py-1 rounded text-sm font-bold">Handguns</span>
                    <span className="bg-threat-red/10 border border-threat-red/30 text-threat-red px-3 py-1 rounded text-sm font-bold">Assault Rifles</span>
                    <span className="bg-threat-red/10 border border-threat-red/30 text-threat-red px-3 py-1 rounded text-sm font-bold">Knives / Blades</span>
                    <span className="bg-threat-red/10 border border-threat-red/30 text-threat-red px-3 py-1 rounded text-sm font-bold">Explosive Devices</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">System Purpose</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Our mission is to proactively neutralize security risks before they escalate. By leveraging advanced real-time computer vision, GuardianVision provides an unblinking eye that constantly monitors for lethal threats, ensuring the safety of people in public and private environments.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">Primary Use Cases</h3>
                  <ul className="text-sm text-gray-400 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-electric-blue mt-0.5">▹</span> 
                      <span><strong className="text-gray-300">Schools & Campuses:</strong> Early warning systems for active shooter scenarios.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-electric-blue mt-0.5">▹</span> 
                      <span><strong className="text-gray-300">Airports & Transit:</strong> Automated luggage and passenger screening assistance.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-electric-blue mt-0.5">▹</span> 
                      <span><strong className="text-gray-300">Retail & Banking:</strong> Preventing armed robberies through immediate alert generation.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {(step === "uploading" || step === "processing") && (
            <div className="glass-panel p-8 h-full flex flex-col justify-center border border-gray-800">
              <h2 className="text-2xl font-bold mb-8 text-electric-blue flex items-center gap-3">
                <Loader2 className="animate-spin" /> 
                {step === "uploading" ? "Stage 1: Secure Upload" : "Stage 2: Inference"}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Media Ingestion</span>
                    <span className={step === "uploading" ? "text-electric-blue" : "text-green-400"}>
                      {step === "uploading" ? "In Progress" : "Complete"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-electric-blue h-full"
                      initial={{ width: "0%" }}
                      animate={{ width: step === "processing" ? "100%" : "50%" }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                </div>
                
                <div className="opacity-50 transition-opacity" style={{ opacity: step === "processing" ? 1 : 0.3 }}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">YOLOv8 Detection Pass</span>
                    <span className="text-neon-purple animate-pulse">Running...</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-neon-purple h-full"
                      initial={{ width: "0%" }}
                      animate={step === "processing" ? { width: "100%" } : { width: "0%" }}
                      transition={{ duration: 5 }}
                    />
                  </div>
                </div>

                {step === "processing" && (
                   <div className="mt-8 pt-8 border-t border-gray-800">
                     <p className="text-sm text-gray-500 font-mono mb-4">FRAME LOG</p>
                     <div className="space-y-2 font-mono text-xs text-green-500">
                       <p>{">"} Loading weights: yolov8n.pt...</p>
                       <p>{">"} Tensor processing...</p>
                       <p className="text-yellow-500">{">"} Identifying bounding boxes...</p>
                     </div>
                   </div>
                )}
              </div>
            </div>
          )}

          {step === "result" && result && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className={`glass-panel p-8 border-t-4 ${result.threat_events > 0 ? "border-t-threat-red" : "border-t-green-500"} relative overflow-hidden`}
            >
              {/* Threat Background Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 ${result.threat_events > 0 ? "bg-threat-red/10" : "bg-green-500/10"} rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none`}></div>

              <div className={`flex items-center gap-3 mb-8 ${result.threat_events > 0 ? "text-threat-red" : "text-green-500"} relative z-10`}>
                {result.threat_events > 0 ? <ShieldAlert size={40} className="animate-pulse" /> : <ShieldCheck size={40} />}
                <h2 className="text-3xl font-bold tracking-tight">
                  {result.threat_events > 0 ? "THREAT DETECTED" : "NO THREATS FOUND"}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800">
                  <p className="text-sm text-gray-400 mb-1">Frames Analyzed</p>
                  <p className="text-3xl font-bold text-white">{result.frames_analyzed.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800">
                  <p className="text-sm text-gray-400 mb-1">Total Detections</p>
                  <p className={`text-3xl font-bold ${result.threat_events > 0 ? "text-threat-red" : "text-green-500"}`}>{result.threat_events}</p>
                </div>
              </div>

              {result.threat_events > 0 && (
                <>
                  <h3 className="text-lg font-bold text-gray-300 mb-4 border-b border-gray-800 pb-2 relative z-10">Identified Objects</h3>
                  <ul className="space-y-3 relative z-10">
                    {result.detections.map((det: any, idx: number) => (
                      <li key={idx} className="flex justify-between items-center bg-gray-900/80 border border-threat-red/30 p-4 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-threat-red font-bold text-lg uppercase">🔴 {det.object}</span>
                          <span className="text-xs text-gray-500">Timestamp: {det.time}</span>
                        </div>
                        <span className="text-white font-mono bg-threat-red/20 border border-threat-red/50 px-3 py-1 rounded text-sm shadow-[0_0_10px_rgba(255,51,51,0.2)]">
                          {det.confidence} confidence
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-800 flex gap-4 relative z-10">
                <button 
                  onClick={() => { setStep("idle"); setFile(null); setResult(null); }}
                  className="px-6 py-3 border border-gray-600 rounded hover:bg-gray-800 transition-colors w-full cursor-pointer"
                >
                  NEW SCAN
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
