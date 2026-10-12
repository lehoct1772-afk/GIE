import { useMemo } from "react";
import * as THREE from "three";

export default function Nodes() {
  const nodes = useMemo(
    () => [
      { p: [-0.56, 0.36, 0.56], c: "#00F5FF", s: 0.030 },
      { p: [0.48, -0.16, 0.64], c: "#66FFFF", s: 0.034 },
      { p: [-0.24, -0.56, 0.52], c: "#00E5FF", s: 0.030 },
      { p: [0.60, 0.40, 0.32], c: "#7AFFFF", s: 0.034 },
      { p: [-0.68, 0.04, 0.28], c: "#00F5FF", s: 0.028 },
      { p: [0.12, 0.72, 0.24], c: "#7AFFD7", s: 0.036 },
      { p: [0.00, -0.72, 0.36], c: "#00E5FF", s: 0.030 },
      { p: [0.72, 0.12, 0.28], c: "#66FFFF", s: 0.032 },
      { p: [-0.52, 0.60, 0.20], c: "#00F5FF", s: 0.028 },
      { p: [0.36, -0.48, 0.60], c: "#7AFFFF", s: 0.032 },
      { p: [-0.08, 0.16, 0.76], c: "#FFFFFF", s: 0.040 },
      { p: [0.24, -0.36, 0.72], c: "#00F5FF", s: 0.034 },
      { p: [0.00, 0.00, 0.80], c: "#FFD54A", s: 0.042 },
      { p: [-0.40, 0.00, 0.68], c: "#66FFFF", s: 0.032 },
      { p: [0.40, 0.00, 0.68], c: "#66FFFF", s: 0.032 },
      { p: [0.00, 0.40, 0.68], c: "#00F5FF", s: 0.032 },
      { p: [0.00, -0.40, 0.68], c: "#00F5FF", s: 0.032 },
    ],
    []
  );

  return (
    <>
      {nodes.map((node, i) => (
        <group key={i} position={node.p as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[node.s, 24, 24]} />
            <meshBasicMaterial
              color={node.c}
              toneMapped={false}
            />
          </mesh>

          <mesh scale={2}>
            <sphereGeometry args={[node.s, 24, 24]} />
            <meshBasicMaterial
              color={node.c}
              transparent
              opacity={0.30}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <mesh scale={3.5}>
            <sphereGeometry args={[node.s, 20, 20]} />
            <meshBasicMaterial
              color={node.c}
              transparent
              opacity={0.10}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}