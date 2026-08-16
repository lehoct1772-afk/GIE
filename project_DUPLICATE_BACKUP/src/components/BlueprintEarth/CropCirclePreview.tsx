import { Float, Ring, Line } from "@react-three/drei";
import * as THREE from "three";

export default function CropCirclePreview() {
  return (
    <group position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <Float
        speed={0.8}
        rotationIntensity={0.08}
        floatIntensity={0.08}
      >
        <Ring args={[0.12, 0.13, 128]}>
          <meshBasicMaterial
            color="#00F5FF"
            transparent
            opacity={1}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </Ring>

        <Ring args={[0.24, 0.25, 128]}>
          <meshBasicMaterial
            color="#00E5FF"
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </Ring>

        <Ring args={[0.38, 0.39, 128]}>
          <meshBasicMaterial
            color="#66FFFF"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </Ring>

        <Ring args={[0.52, 0.53, 128]}>
          <meshBasicMaterial
            color="#00F5FF"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </Ring>

        <Line
          points={[
            [-0.55, 0, 0],
            [0.55, 0, 0],
          ]}
          color="#00F5FF"
          lineWidth={2}
        />

        <Line
          points={[
            [0, -0.55, 0],
            [0, 0.55, 0],
          ]}
          color="#00F5FF"
          lineWidth={2}
        />

        <Line
          points={[
            [-0.39, -0.39, 0],
            [0.39, 0.39, 0],
          ]}
          color="#66FFFF"
          lineWidth={1.5}
        />

        <Line
          points={[
            [-0.39, 0.39, 0],
            [0.39, -0.39, 0],
          ]}
          color="#66FFFF"
          lineWidth={1.5}
        />
      </Float>
    </group>
  );
}