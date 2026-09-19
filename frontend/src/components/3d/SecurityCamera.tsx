"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Cylinder, Sphere, Ring, Points, PointMaterial } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

function Particles({ count = 500 }) {
  const points = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
      points.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <Points ref={points} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00d2ff" size={0.05} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function HolographicRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.rotation.x = time * 0.5;
      ring1.current.rotation.y = time * 0.2;
    }
    if (ring2.current) {
      ring2.current.rotation.y = time * -0.6;
      ring2.current.rotation.z = time * 0.3;
    }
    if (ring3.current) {
      ring3.current.rotation.x = time * 0.4;
      ring3.current.rotation.z = time * -0.5;
    }
  });

  return (
    <group position={[0, 1, 0]}>
      <Ring ref={ring1} args={[1.5, 1.55, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#00d2ff" transparent opacity={0.5} side={THREE.DoubleSide} />
      </Ring>
      <Ring ref={ring2} args={[1.8, 1.83, 64]} rotation={[0, Math.PI / 2, 0]}>
        <meshBasicMaterial color="#b52aff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </Ring>
      <Ring ref={ring3} args={[2.1, 2.12, 64]}>
        <meshBasicMaterial color="#00ffff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </Ring>
    </group>
  );
}

function CameraModel() {
  const groupRef = useRef<THREE.Group>(null);
  const scannerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
    if (scannerRef.current) {
      scannerRef.current.position.z = 1.05 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      (scannerRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 8);
    }
  });

  return (
    <group ref={groupRef} scale={1.5}>
      {/* Base */}
      <Box args={[1, 0.2, 1]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#2a3b5c" metalness={0.5} roughness={0.4} />
      </Box>
      
      {/* Stand */}
      <Cylinder args={[0.1, 0.1, 0.8]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Body */}
      <Box args={[0.8, 0.8, 1.5]} position={[0, 1, 0.2]}>
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.1} />
      </Box>
      
      {/* Lens Housing */}
      <Cylinder args={[0.35, 0.35, 0.2]} position={[0, 1, 1]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color="#444" metalness={0.9} roughness={0.1} />
      </Cylinder>

      {/* Lens Glass */}
      <Sphere args={[0.25, 32, 32]} position={[0, 1, 1.05]}>
        <meshPhysicalMaterial color="#000" metalness={0.9} roughness={0} transmission={0.9} thickness={0.5} />
      </Sphere>

      {/* Glowing Scanner Ring */}
      <Ring ref={scannerRef} args={[0.26, 0.32, 32]} position={[0, 1, 1.15]}>
        <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={3} side={THREE.DoubleSide} />
      </Ring>
    </group>
  );
}

export default function SecurityCamera() {
  return (
    <div className="w-full h-full min-h-screen">
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <ambientLight intensity={1.5} />
        
        {/* Stronger directional lights to illuminate the white camera body */}
        <directionalLight position={[5, 10, 10]} intensity={3} color="#ffffff" />
        <directionalLight position={[-5, 5, 5]} intensity={2} color="#00d2ff" />
        
        <spotLight position={[5, 10, 5]} intensity={3} color="#00d2ff" penumbra={1} />
        <spotLight position={[-5, 5, 5]} intensity={3} color="#b52aff" penumbra={1} />
        <pointLight position={[0, 1, 1.5]} intensity={2} color="#ff3333" distance={5} />
        
        <CameraModel />
        <HolographicRings />
        <Particles count={1500} />
        
        {/* Grid Floor */}
        <gridHelper args={[40, 80, "#00d2ff", "#002a40"]} position={[0, -2, 0]} />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI/2 - 0.1} minPolarAngle={Math.PI/3} />
      </Canvas>
    </div>
  );
}
