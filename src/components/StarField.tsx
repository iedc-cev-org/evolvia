"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Stars() {
  const stars = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400; // X range -200 to 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400; // Y range -200 to 200
      positions[i * 3 + 2] = -Math.random() * 600; // Z range -600 to 0
    }
    return positions;
  }, []);

  return (
    <Points positions={stars}>
      <PointMaterial
        transparent
        color="white"
        size={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

function CameraController() {
  const { camera } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const timeRef = useRef(0);
  const target = useRef(new THREE.Vector3(0, 0, 1));

  // Capture mouse movement
  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  useFrame((_, delta) => {
    timeRef.current += delta;

    // 🚀 Faster & larger drift
    const driftX = Math.sin(timeRef.current * 0.5) * 2.0; // faster + bigger
    const driftY = Math.cos(timeRef.current * 0.4) * 2.0;

    // 🚀 Stronger mouse movement influence
    const targetX = mouse.current.x * 10 + driftX;
    const targetY = mouse.current.y * 10 + driftY;

    // Faster smoothing (0.15 instead of 0.05)
    target.current.x += (targetX - target.current.x) * 0.15;
    target.current.y += (targetY - target.current.y) * 0.15;

    camera.position.x = target.current.x;
    camera.position.y = target.current.y;
    camera.lookAt(0, 0, -200);
  });

  return null;
}

export default function StarField() {
  return (
    <Canvas camera={{ position: [0, 0, 1], fov: 100 }}>
      <CameraController />
      <Stars />
    </Canvas>
  );
}
