import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlatonicSolidsProps {
  viewMode: string;
}

export const PlatonicSolids: React.FC<PlatonicSolidsProps> = ({ viewMode }) => {
  const icoRef = useRef<THREE.Mesh>(null);
  const dodecaRef = useRef<THREE.Mesh>(null);
  const octaRef = useRef<THREE.Mesh>(null);
  const tetraRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (icoRef.current) {
      icoRef.current.rotation.x += delta * 0.15;
      icoRef.current.rotation.y += delta * 0.25;
    }
    if (dodecaRef.current) {
      dodecaRef.current.rotation.x -= delta * 0.1;
      dodecaRef.current.rotation.z += delta * 0.18;
    }
    if (octaRef.current) {
      octaRef.current.rotation.y += delta * 0.2;
      octaRef.current.rotation.z -= delta * 0.15;
    }
    if (tetraRef.current) {
      tetraRef.current.rotation.x += delta * 0.3;
      tetraRef.current.rotation.y -= delta * 0.2;
    }
  });

  const isSacred = viewMode === 'SACRED_GEOMETRY' || viewMode === 'GEOMETRIC_LAYERS' || viewMode === 'ORBIT_VIEW';

  return (
    <group>
      {/* Central Blueprint Icosahedron (Water element / 20 faces) */}
      <mesh ref={icoRef}>
        <icosahedronGeometry args={[1.75, 0]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={isSacred ? 0.35 : 0.15}
        />
      </mesh>

      {/* Concentric Dodecahedron (Ether element / 12 pentagonal faces) */}
      <mesh ref={dodecaRef}>
        <dodecahedronGeometry args={[2.2, 0]} />
        <meshBasicMaterial
          color="#ffb700"
          wireframe
          transparent
          opacity={isSacred ? 0.28 : 0.1}
        />
      </mesh>

      {/* Outer Octahedron (Air element / 8 triangular faces) */}
      <mesh ref={octaRef}>
        <octahedronGeometry args={[3.2, 0]} />
        <meshBasicMaterial
          color="#00ff9d"
          wireframe
          transparent
          opacity={isSacred ? 0.22 : 0.08}
        />
      </mesh>

      {/* Outer Tetrahedron Orbit */}
      <mesh ref={tetraRef} position={[0, 0, 0]}>
        <tetrahedronGeometry args={[4.1, 0]} />
        <meshBasicMaterial
          color="#bf5af2"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
};
