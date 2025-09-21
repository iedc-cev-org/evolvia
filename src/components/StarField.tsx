"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

function Stars() {
  const stars = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = -Math.random() * 600;
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
  const mouse = useRef(new THREE.Vector2(0, 0));       // smoothed target
  const rawInput = useRef(new THREE.Vector2(0, 0));   // raw device/mouse/touch input
  const timeRef = useRef(0);
  const target = useRef(new THREE.Vector3(0, 0, 1));

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      rawInput.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      rawInput.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        rawInput.current.x = (t.clientX / window.innerWidth) * 2 - 1;
        rawInput.current.y = -(t.clientY / window.innerHeight) * 2 + 1;
      }
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma = left/right, beta = up/down
        rawInput.current.x = THREE.MathUtils.clamp(e.gamma / 45, -1, 1);
        rawInput.current.y = THREE.MathUtils.clamp(e.beta / 90, -1, 1);
      }
    };

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("touchmove", handleTouch, { passive: true });
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;

    // Smooth input with lerp → makes it buttery on mobile
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, rawInput.current.x, 0.05);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, rawInput.current.y, 0.05);

    // drifting background motion
    const driftX = Math.sin(timeRef.current * 0.4) * 1.5;
    const driftY = Math.cos(timeRef.current * 0.3) * 1.5;

    // smaller sensitivity on mobile
    const targetX = mouse.current.x * 6 + driftX;
    const targetY = mouse.current.y * 6 + driftY;

    target.current.x += (targetX - target.current.x) * 0.1;
    target.current.y += (targetY - target.current.y) * 0.1;

    camera.position.x = target.current.x;
    camera.position.y = target.current.y;
    camera.lookAt(0, 0, -200);
  });

  return null;
}

export default function StarField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 100 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <CameraController />
      <Stars />
    </Canvas>
  );
}


// "use client";

// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { Points, PointMaterial } from "@react-three/drei";
// import { useMemo, useRef } from "react";
// import * as THREE from "three";

// function Stars() {
//   const stars = useMemo(() => {
//     const positions = new Float32Array(1000 * 3);
//     for (let i = 0; i < 1000; i++) {
//       positions[i * 3] = (Math.random() - 0.5) * 400; // X range -200 to 200
//       positions[i * 3 + 1] = (Math.random() - 0.5) * 400; // Y range -200 to 200
//       positions[i * 3 + 2] = -Math.random() * 600; // Z range -600 to 0
//     }
//     return positions;
//   }, []);

//   return (
//     <Points positions={stars}>
//       <PointMaterial
//         transparent
//         color="white"
//         size={0.5}
//         sizeAttenuation
//         depthWrite={false}
//       />
//     </Points>
//   );
// }

// function CameraController() {
//   const { camera } = useThree();
//   const mouse = useRef(new THREE.Vector2(0, 0));
//   const timeRef = useRef(0);
//   const target = useRef(new THREE.Vector3(0, 0, 1));

//   // Capture mouse movement
//   if (typeof window !== "undefined") {
//     window.addEventListener("mousemove", (e) => {
//       mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
//       mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
//     });
//   }

//   useFrame((_, delta) => {
//     timeRef.current += delta;

//     // 🚀 Faster & larger drift
//     const driftX = Math.sin(timeRef.current * 0.5) * 2.0; // faster + bigger
//     const driftY = Math.cos(timeRef.current * 0.4) * 2.0;

//     // 🚀 Stronger mouse movement influence
//     const targetX = mouse.current.x * 10 + driftX;
//     const targetY = mouse.current.y * 10 + driftY;

//     // Faster smoothing (0.15 instead of 0.05)
//     target.current.x += (targetX - target.current.x) * 0.15;
//     target.current.y += (targetY - target.current.y) * 0.15;

//     camera.position.x = target.current.x;
//     camera.position.y = target.current.y;
//     camera.lookAt(0, 0, -200);
//   });

//   return null;
// }

// export default function StarField() {
//   return (
//     <Canvas camera={{ position: [0, 0, 1], fov: 100 }}>
//       <CameraController />
//       <Stars />
//     </Canvas>
//   );
// }