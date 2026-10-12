import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SacredGeometry3DProps {
  viewMode: string;
}

export const SacredGeometry3D: React.FC<SacredGeometry3DProps> = ({ viewMode }) => {
  const spiralGroupRef = useRef<THREE.Group>(null);
  const flowerGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (spiralGroupRef.current) {
      spiralGroupRef.current.rotation.z += delta * 0.15;
    }
    if (flowerGroupRef.current) {
      flowerGroupRef.current.rotation.y -= delta * 0.05;
    }
  });

  // Generate 3D Golden Spiral Points (Logarithmic spiral: r = a * e^(b * theta))
  const spiralPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const a = 0.08;
    const b = 0.1705; // golden ratio b factor
    const turns = 4.5 * Math.PI * 2;
    const steps = 300;

    for (let i = 0; i < steps; i++) {
      const theta = (i / steps) * turns;
      const r = a * Math.exp(b * theta);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = (theta / turns) * 1.5 - 0.75; // 3D elevation
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);

  // Flower of Life 6 overlapping rings in 3D plane
  const flowerRings = useMemo(() => {
    const ringRadius = 1.2;
    const centers: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0)];
    
    // 6 outer circles
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      centers.push(new THREE.Vector3(ringRadius * Math.cos(angle), ringRadius * Math.sin(angle), 0));
    }

    return centers;
  }, []);

  const showSpiral = viewMode === 'FIBONACCI_SPIRAL' || viewMode === 'SACRED_GEOMETRY';
  const showFlower = viewMode === 'SACRED_GEOMETRY' || viewMode === 'GEOMETRIC_LAYERS';

  return (
    <group>
      {/* 3D Golden Logarithmic Spiral Line */}
      {showSpiral && (
        <group ref={spiralGroupRef} position={[0, 0, 0]}>
          <line>
            <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints(spiralPoints)} />
            <lineBasicMaterial attach="material" color="#ffb700" transparent opacity={0.8} linewidth={2.5} />
          </line>
        </group>
      )}

      {/* Flower of Life 3D Circle Network */}
      {showFlower && (
        <group ref={flowerGroupRef} rotation={[Math.PI / 4, 0, 0]}>
          {flowerRings.map((center, idx) => {
            const circlePoints: THREE.Vector3[] = [];
            const segs = 48;
            for (let i = 0; i <= segs; i++) {
              const theta = (i / segs) * Math.PI * 2;
              circlePoints.push(
                new THREE.Vector3(
                  center.x + 1.2 * Math.cos(theta),
                  center.y + 1.2 * Math.sin(theta),
                  center.z
                )
              );
            }
            const circleGeo = new THREE.BufferGeometry().setFromPoints(circlePoints);
            return (
              <line key={idx}>
                <primitive object={circleGeo} />
                <lineBasicMaterial color="#00f0ff" transparent opacity={0.45} linewidth={1.2} />
              </line>
            );
          })}
        </group>
      )}
    </group>
  );
};
