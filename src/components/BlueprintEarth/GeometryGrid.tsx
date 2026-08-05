import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Globe() {
  const globe = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (!globe.current) return;

    globe.current.rotation.y += delta * 0.08;
    globe.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.03;
  });

  return (
    <group>
      <mesh ref={globe}>
        <sphereGeometry args={[2.25, 128, 128]} />

        <meshPhysicalMaterial
          color="#07131f"
          emissive="#00d8ff"
          emissiveIntensity={0.18}
          metalness={0.9}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={0.05}
          transparent
          opacity={0.96}
          wireframe
        />
      </mesh>
    </group>
  );
}