import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Globe() {
  const globeRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.12;
    }
  });
  import { useRef } from "react";
  import { useFrame } from "@react-three/fiber";
  import * as THREE from "three";
  
  export default function Globe() {
    const globeRef = useRef<THREE.Mesh>(null!);
  
    useFrame((_, delta) => {
      if (globeRef.current) {
        globeRef.current.rotation.y += delta * 0.12;
      }
    });
  
    return (
      <group>
        {/* Main Globe */}
        <mesh ref={globeRef}>
          <sphereGeometry args={[0.8, 128, 128]} />
          <meshPhysicalMaterial
            color="#0b1f33"
            emissive="#00d9ff"
            emissiveIntensity={0.18}
            roughness={0.28}
            metalness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>
  
        {/* Outer Glow */}
        <mesh scale={1.02}>
          <sphereGeometry args={[0.8, 128, 128]} />
          <meshBasicMaterial
            color="#00e5ff"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>
  
        {/* Wireframe */}
        <mesh>
          <sphereGeometry args={[0.81, 64, 64]} />
          <meshBasicMaterial
            color="#32f5ff"
            wireframe
            transparent
            opacity={0.22}
          />
        </mesh>
      </group>
    );
  }