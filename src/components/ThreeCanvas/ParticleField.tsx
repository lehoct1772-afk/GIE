import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const ParticleField: React.FC = () => {
  const pointsRefFar = useRef<THREE.Points>(null);
  const pointsRefNear = useRef<THREE.Points>(null);

  const countFar = 900;
  const countNear = 300;

  // Layer 1: Distant Background Stars
  const [posFar, colFar] = useMemo(() => {
    const pos = new Float32Array(countFar * 3);
    const col = new Float32Array(countFar * 3);

    const colorCyan = new THREE.Color("#00f0ff");
    const colorGold = new THREE.Color("#ffb700");
    const colorWhite = new THREE.Color("#ffffff");

    for (let i = 0; i < countFar; i++) {
      const r = 8 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const rand = Math.random();
      const c =
        rand > 0.7
          ? colorCyan
          : rand > 0.4
            ? colorWhite
            : colorGold;

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, []);

  // Layer 2: Near Foreground Stars
  const [posNear, colNear] = useMemo(() => {
    const pos = new Float32Array(countNear * 3);
    const col = new Float32Array(countNear * 3);

    const colorCyan = new THREE.Color("#00f0ff");
    const colorEmerald = new THREE.Color("#00ff9d");

    for (let i = 0; i < countNear; i++) {
      const r = 4.5 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c =
        Math.random() > 0.5
          ? colorCyan
          : colorEmerald;

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, []);

  // Independent automatic movement.
  // NO pointer or mouse tracking.
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (pointsRefFar.current) {
      pointsRefFar.current.rotation.y += delta * 0.015;
      pointsRefFar.current.rotation.x =
        Math.sin(t * 0.08) * 0.015;

      pointsRefFar.current.position.x =
        Math.sin(t * 0.05) * 0.08;

      pointsRefFar.current.position.y =
        Math.cos(t * 0.04) * 0.05;
    }

    if (pointsRefNear.current) {
      pointsRefNear.current.rotation.y += delta * 0.03;
      pointsRefNear.current.rotation.x =
        Math.cos(t * 0.11) * 0.025;

      pointsRefNear.current.position.x =
        Math.sin(t * 0.08) * 0.14;

      pointsRefNear.current.position.y =
        Math.cos(t * 0.07) * 0.09;
    }
  });

  return (
    <group>
      {/* Background Deep Starfield */}
      <points ref={pointsRefFar}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[posFar, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colFar, 3]}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Foreground Floating Particles */}
      <points ref={pointsRefNear}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[posNear, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colNear, 3]}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.055}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};