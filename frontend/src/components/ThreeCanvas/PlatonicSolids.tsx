import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlatonicSolidsProps {
  viewMode: string;
}

export const PlatonicSolids: React.FC<PlatonicSolidsProps> = ({
  viewMode,
}) => {
  const icoRef = useRef<THREE.Mesh>(null);
  const dodecaRef = useRef<THREE.Mesh>(null);
  const octaRef = useRef<THREE.Mesh>(null);
  const tetraRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (icoRef.current) {
      icoRef.current.rotation.x += delta * 0.05;
      icoRef.current.rotation.y += delta * 0.08;
    }

    if (dodecaRef.current) {
      dodecaRef.current.rotation.x -= delta * 0.035;
      dodecaRef.current.rotation.z += delta * 0.05;
    }

    if (octaRef.current) {
      octaRef.current.rotation.y += delta * 0.045;
      octaRef.current.rotation.z -= delta * 0.035;
    }

    if (tetraRef.current) {
      tetraRef.current.rotation.x += delta * 0.055;
      tetraRef.current.rotation.y -= delta * 0.04;
    }
  });

  /*
    These geometries belong ONLY to the dedicated
    sacred/geometric visualization modes.

    They should not surround Gaia during the normal
    Earth/interface view.
  */

  const showSacred =
    viewMode === "SACRED_GEOMETRY" ||
    viewMode === "GEOMETRIC_LAYERS";

  const showOrbit =
    viewMode === "ORBIT_VIEW";

  if (!showSacred && !showOrbit) {
    return null;
  }

  return (
    <group>
      {/* ICOSAHEDRON */}
      {showSacred && (
        <mesh ref={icoRef}>
          <icosahedronGeometry args={[1.72, 0]} />

          <meshBasicMaterial
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* DODECAHEDRON */}
      {showSacred && (
        <mesh ref={dodecaRef}>
          <dodecahedronGeometry args={[2.05, 0]} />

          <meshBasicMaterial
            color="#ffb700"
            wireframe
            transparent
            opacity={0.16}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* OCTAHEDRON */}
      {showSacred && (
        <mesh ref={octaRef}>
          <octahedronGeometry args={[2.35, 0]} />

          <meshBasicMaterial
            color="#00ff9d"
            wireframe
            transparent
            opacity={0.13}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* TETRAHEDRON */}
      {showSacred && (
        <mesh ref={tetraRef}>
          <tetrahedronGeometry args={[2.55, 0]} />

          <meshBasicMaterial
            color="#bf5af2"
            wireframe
            transparent
            opacity={0.11}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ORBIT MODE GETS ONLY A CLEAN ORBITAL GUIDE */}
      {showOrbit && (
        <mesh rotation={[Math.PI / 2.8, 0, 0]}>
          <torusGeometry args={[2.15, 0.008, 8, 160]} />

          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
};