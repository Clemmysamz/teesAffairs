"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";

function FashionForm() {
  const ref = useRef<any>(null);
  const reduceMotion = useReducedMotion();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * (reduceMotion ? 0.2 : 0.6);
    ref.current.rotation.x = -0.35 + Math.sin(state.clock.elapsedTime) * 0.12;
  });

  return (
    <Float speed={reduceMotion ? 0.5 : 1.6} rotationIntensity={reduceMotion ? 0.25 : 0.8} floatIntensity={reduceMotion ? 0.25 : 1.2}>
      <group ref={ref}>
        <mesh position={[0, 0.1, 0]}>
          <torusKnotGeometry args={[1.2, 0.28, 180, 28]} />
          <meshStandardMaterial color="#f4f2ed" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[-0.55, -0.7, 0.8]} rotation={[0.5, 0.9, 0]} scale={0.5}>
          <boxGeometry args={[1.1, 1.1, 1.1]} />
          <meshStandardMaterial color="#a4a4a4" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

function ThreeContent() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 42 }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 3]} intensity={1.6} color="#ffffff" />
      <Suspense fallback={null}>
        <FashionForm />
      </Suspense>
      <ContactShadows position={[0, -2.1, 0]} opacity={0.5} blur={2.5} scale={9} />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 1.8} />
    </Canvas>
  );
}

export function ThreeDViewer({ fallbackImage }: { fallbackImage: string }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <img src={fallbackImage} alt="Abstract fashion form" className="h-full w-full object-cover" />;
  }

  return (
    <div className="h-[420px] w-full overflow-hidden border border-[#080808]/10 bg-[#dedbd5]">
      <Suspense fallback={<img src={fallbackImage} alt="Abstract fashion form" className="h-full w-full object-cover" />}>
        <ThreeContent />
      </Suspense>
    </div>
  );
}
