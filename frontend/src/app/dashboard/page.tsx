"use client";

import Link from "next/link";
import { BarChart, Activity, AlertTriangle, ShieldCheck, Video, Sliders, Server, Cpu } from "lucide-react";
import { useState } from "react";
import Radar from "@/components/3d/Radar";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_scans: 1248,
    threats_detected: 27,
    live_cameras: 4,
    detection_accuracy: 94.6
  });

  const [threshold, setThreshold] = useState(70);

  return (
    <div className="min-h-screen bg-black text-white p-8 relative">
      
      <nav className="relative z-10 flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold text-electric-blue neon-text">GUARDIANVISION AI</Link>
        <div className="flex gap-4">
          <Link href="/live" className="text-gray-400 hover:text-white transition-colors">Live Camera</Link>
          <Link href="/analyze" className="text-gray-400 hover:text-white transition-colors">AI Scanner</Link>
        </div>
      </nav>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stat Cards */}
        <div className="glass-panel p-6 flex items-center gap-4 border-t-2 border-t-electric-blue hover:-translate-y-1 transition-transform">
          <div className="bg-electric-blue/20 p-4 rounded-full text-electric-blue animate-pulse"><Activity size={24} /></div>
          <div>
            <p className="text-gray-400 text-sm">Total Scans</p>
            <p className="text-3xl font-bold">{stats.total_scans.toLocaleString()}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4 border-t-2 border-t-threat-red hover:-translate-y-1 transition-transform">
          <div className="bg-threat-red/20 p-4 rounded-full text-threat-red threat-pulse"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-gray-400 text-sm">Threats Detected</p>
            <p className="text-3xl font-bold">{stats.threats_detected}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4 border-t-2 border-t-green-500 hover:-translate-y-1 transition-transform">
          <div className="bg-green-500/20 p-4 rounded-full text-green-500"><Video size={24} /></div>
          <div>
            <p className="text-gray-400 text-sm">Live Cameras</p>
            <p className="text-3xl font-bold">{stats.live_cameras}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4 border-t-2 border-t-neon-purple hover:-translate-y-1 transition-transform">
          <div className="bg-neon-purple/20 p-4 rounded-full text-neon-purple"><ShieldCheck size={24} /></div>
          <div>
            <p className="text-gray-400 text-sm">Detection Accuracy</p>
            <p className="text-3xl font-bold">{stats.detection_accuracy}%</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Radar & Maps */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-2 text-electric-blue flex items-center gap-2">
            <Activity size={20} /> LIVE THREAT RADAR
          </h3>
          <p className="text-gray-400 text-sm mb-4">Real-time geospatial anomaly tracking</p>
          <div className="flex-1 bg-black/50 rounded-lg overflow-hidden relative neon-border">
            <Radar />
            <div className="absolute top-2 left-2 text-xs text-threat-red font-mono animate-pulse">2 UNKNOWN ENTITIES</div>
          </div>
        </div>

        {/* Chart & Settings */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-2">
              <BarChart size={20} /> Detection Activity
            </h3>
            <div className="h-[150px] flex items-end gap-2 justify-between">
              {[40, 20, 60, 10, 80, 30, 50, 90, 20, 40].map((val, i) => (
                <div key={i} className="w-full bg-electric-blue/20 rounded-t hover:bg-electric-blue transition-colors cursor-pointer group relative" style={{ height: `${val}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100">{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-bold mb-4 text-neon-purple flex items-center gap-2">
              <Sliders size={20} /> AI Confidence Threshold
            </h3>
            <p className="text-sm text-gray-400 mb-4">Adjust the sensitivity of the detection engine. Lower values may result in false positives.</p>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="50" max="99" 
                value={threshold} 
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-neon-purple cursor-pointer" 
              />
              <span className="font-mono bg-neon-purple/20 text-neon-purple px-3 py-1 rounded font-bold">{threshold}%</span>
            </div>
          </div>
        </div>

        {/* Recent Threats & System */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-6 flex-1">
            <h3 className="text-xl font-bold mb-4 text-gray-200">Recent Threats</h3>
            <div className="space-y-4">
              {[
                { id: "TR-882", object: "Gun", conf: "96%", time: "11:42 AM", cam: "Cam 01" },
                { id: "TR-881", object: "Knife", conf: "89%", time: "10:18 AM", cam: "Upload" },
                { id: "TR-880", object: "Gun", conf: "91%", time: "08:15 AM", cam: "Cam 03" },
              ].map(threat => (
                <div key={threat.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded border border-gray-700 hover:border-electric-blue transition-colors cursor-pointer">
                  <div>
                    <p className="text-threat-red font-bold">{threat.object} <span className="text-gray-400 text-xs">({threat.conf})</span></p>
                    <p className="text-xs text-gray-500">{threat.time} • {threat.cam}</p>
                  </div>
                  <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">Review</button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6">
             <h3 className="text-xl font-bold mb-4 text-gray-200 flex items-center gap-2">
              <Server size={20} /> System Health
            </h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400"><Cpu size={14} className="inline mr-2"/>AI Core</span>
                <span className="text-green-400">ONLINE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400"><Server size={14} className="inline mr-2"/>Database</span>
                <span className="text-green-400">ONLINE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400"><Video size={14} className="inline mr-2"/>WebSocket Stream</span>
                <span className="text-electric-blue animate-pulse">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
