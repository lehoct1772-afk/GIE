import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Atmosphere() {
  const atmosphereRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.012;
    }
  });

  return (
    <group ref={atmosphereRef}>
      <mesh scale={1.03}>
        <sphereGeometry args={[0.8, 128, 128]} />
        <meshBasicMaterial
          color="#00F5FF"
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh scale={1.07}>
        <sphereGeometry args={[0.8, 128, 128]} />
        <meshBasicMaterial
          color="#00D8FF"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh scale={1.12}>
        <sphereGeometry args={[0.8, 96, 96]} />
        <meshBasicMaterial
          color="#66FFFF"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}