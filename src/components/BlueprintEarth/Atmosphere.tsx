import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Atmosphere() {
  const atmosphere = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (atmosphere.current) {
      atmosphere.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <mesh ref={atmosphere} scale={1.05}>
      <sphereGeometry args={[2.35, 64, 64]} />
      <meshBasicMaterial
        color="#00e5ff"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </mesh>
  );
}