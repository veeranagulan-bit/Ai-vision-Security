"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function RadarBeam() {
  const beamRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.rotation.y = -state.clock.elapsedTime * 2;
    }
  });

  return (
    <mesh ref={beamRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <circleGeometry args={[2, 64, 0, Math.PI / 4]} />
      <meshBasicMaterial color="#00d2ff" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Blips() {
  const blipsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (blipsRef.current) {
      blipsRef.current.children.forEach((child, i) => {
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = Math.sin(state.clock.elapsedTime * 3 + i) * 0.5 + 0.5;
      });
    }
  });

  return (
    <group ref={blipsRef}>
      <mesh position={[1, 0.02, -1]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial color="#ff3333" transparent />
      </mesh>
      <mesh position={[-1.2, 0.02, 0.5]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial color="#ff3333" transparent />
      </mesh>
      <mesh position={[0.5, 0.02, 1.5]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial color="#00ffff" transparent />
      </mesh>
    </group>
  );
}

export default function Radar() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 3, 3], fov: 50 }}>
        <ambientLight intensity={1} />
        
        {/* Radar Base Circles */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.95, 2, 64]} />
          <meshBasicMaterial color="#00d2ff" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.45, 1.5, 64]} />
          <meshBasicMaterial color="#00d2ff" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1, 64]} />
          <meshBasicMaterial color="#00d2ff" transparent opacity={0.2} />
        </mesh>
        
        {/* Grid Lines */}
        <gridHelper args={[4, 10, "#00d2ff", "#00d2ff"]} position={[0, -0.01, 0]} material-opacity={0.1} material-transparent />
        
        <RadarBeam />
        <Blips />
        
      </Canvas>
    </div>
  );
}
