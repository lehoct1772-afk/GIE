import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const ParticleField: React.FC = () => {
  const farRef = useRef<THREE.Points>(null);
  const nodeRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Points>(null);

  const farCount = 700;
  const nodeCount = 150;

  const [farPositions, farColors] = useMemo(() => {
    const positions = new Float32Array(farCount * 3);
    const colors = new Float32Array(farCount * 3);

    const cyan = new THREE.Color("#00eaff");
    const white = new THREE.Color("#d8ffff");
    const gold = new THREE.Color("#ffbf00");

    for (let i = 0; i < farCount; i++) {
      positions[i * 3] =
        (Math.random() - 0.5) * 18;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 10;

      positions[i * 3 + 2] =
        -4 - Math.random() * 6;

      const random = Math.random();

      const color =
        random > 0.9
          ? gold
          : random > 0.5
          ? white
          : cyan;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return [positions, colors];
  }, []);

  const [nodePositions, nodeColors] = useMemo(() => {
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    const cyan = new THREE.Color("#00f5ff");
    const brightCyan = new THREE.Color("#8cffff");
    const emerald = new THREE.Color("#00ff9d");
    const gold = new THREE.Color("#ffd000");

    for (let i = 0; i < nodeCount; i++) {
      positions[i * 3] =
        (Math.random() - 0.5) * 15;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 8;

      positions[i * 3 + 2] =
        -2.8 - Math.random() * 3.2;

      const random = Math.random();

      const color =
        random > 0.88
          ? gold
          : random > 0.65
          ? emerald
          : random > 0.35
          ? brightCyan
          : cyan;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (farRef.current) {
      farRef.current.rotation.y += delta * 0.001;
    }

    if (nodeRef.current) {
      const material =
        nodeRef.current.material as THREE.PointsMaterial;

      material.opacity =
        0.78 + Math.sin(time * 1.7) * 0.16;
    }

    if (glowRef.current) {
      const material =
        glowRef.current.material as THREE.PointsMaterial;

      material.opacity =
        0.18 + Math.sin(time * 1.7) * 0.07;
    }
  });

  return (
    <group>
      {/* DEEP BACKGROUND DATA FIELD */}
      <points ref={farRef} renderOrder={-30}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[farPositions, 3]}
          />

          <bufferAttribute
            attach="attributes-color"
            args={[farColors, 3]}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.52}
          sizeAttenuation
          depthWrite={false}
          depthTest
        />
      </points>

      {/* SOFT NODE GLOW */}
      <points ref={glowRef} renderOrder={-20}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />

          <bufferAttribute
            attach="attributes-color"
            args={[nodeColors, 3]}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.19}
          vertexColors
          transparent
          opacity={0.2}
          sizeAttenuation
          depthWrite={false}
          depthTest
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* BRIGHT BACKGROUND NODES */}
      <points ref={nodeRef} renderOrder={-10}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />

          <bufferAttribute
            attach="attributes-color"
            args={[nodeColors, 3]}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.09}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          depthTest
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};