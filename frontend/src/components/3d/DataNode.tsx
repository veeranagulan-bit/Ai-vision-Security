"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Box, Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function ProcessingCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.5;
      meshRef.current.rotation.y = time * 0.8;
    }
    
    if (glowRef.current) {
      const scale = 1.2 + Math.sin(time * 5) * 0.1;
      glowRef.current.scale.set(scale, scale, scale);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(time * 10) * 0.2;
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z = time;
      ringRef.current.rotation.x = Math.sin(time * 0.5) * 0.5;
    }
  });

  return (
    <group>
      {/* Wireframe Cube Core */}
      <Box ref={meshRef} args={[2, 2, 2]}>
        <meshBasicMaterial color="#00d2ff" wireframe />
      </Box>
      
      {/* Pulsing Glow */}
      <Sphere ref={glowRef} args={[1.2, 32, 32]}>
        <meshBasicMaterial color="#b52aff" transparent opacity={0.5} />
      </Sphere>

      {/* Orbiting Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.5, 0.05, 16, 100]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
    </group>
  );
}

export default function DataNode() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1} />
        <ProcessingCore />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
