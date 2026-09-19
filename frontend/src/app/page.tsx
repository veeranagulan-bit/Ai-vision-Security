"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SecurityCamera from "@/components/3d/SecurityCamera";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Full Screen 3D Camera Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <SecurityCamera />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 glass-panel mx-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-electric-blue flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 rounded-full bg-navy"></div>
          </div>
          <span className="text-xl font-bold tracking-wider text-electric-blue">GUARDIANVISION AI</span>
        </div>
        <div className="flex gap-6">
          <Link href="/dashboard" className="text-sm hover:text-electric-blue transition-colors">Dashboard</Link>
          <Link href="/live" className="text-sm hover:text-electric-blue transition-colors">Live Camera</Link>
          <Link href="/analyze" className="text-sm hover:text-electric-blue transition-colors">AI Scanner</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center mt-10 pointer-events-none">
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight relative z-10 mt-[20vh] pointer-events-auto"
        >
          See the Threat.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-purple">
            Detect the Risk.
          </span>
          <br/>Protect Everyone.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-2xl text-lg text-gray-400 mb-10 relative z-10"
        >
          Analyze images, videos and live camera streams using computer vision to identify potential security threats in real time.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4 relative z-10 mb-20 pointer-events-auto"
        >
          <Link href="/analyze" className="px-8 py-3 rounded-full bg-electric-blue text-navy font-bold hover:shadow-[0_0_20px_var(--color-electric-blue)] transition-all">
            START AI SCAN
          </Link>
          <Link href="/live" className="px-8 py-3 rounded-full border border-electric-blue text-electric-blue hover:bg-electric-blue/10 transition-all">
            LIVE CAMERA
          </Link>
          <Link href="/dashboard" className="px-8 py-3 rounded-full border border-gray-600 text-gray-300 hover:border-gray-400 transition-all">
            EXPLORE DASHBOARD
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
