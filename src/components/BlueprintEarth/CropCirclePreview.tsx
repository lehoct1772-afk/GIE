import { Float, Ring } from "@react-three/drei";

export default function CropCirclePreview() {
  return (
    <group position={[0, -4.5, 0]}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
        <Ring
          args={[0.55, 0.75, 64]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            color="#00F5FF"
            transparent
            opacity={0.55}
          />
        </Ring>

        <Ring
          args={[0.95, 1.15, 64]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            color="#66FFFF"
            transparent
            opacity={0.35}
          />
        </Ring>

        <Ring
          args={[1.45, 1.65, 64]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            color="#00D8FF"
            transparent
            opacity={0.22}
          />
        </Ring>
      </Float>
    </group>
  );
}