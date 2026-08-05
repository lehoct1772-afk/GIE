import { useFrame, useThree } from "@react-three/fiber";

export default function CameraRig() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    camera.position.x = Math.sin(t * 0.15) * 0.25;
    camera.position.y = Math.cos(t * 0.12) * 0.15;
    camera.lookAt(0, 0, 0);
  });

  return null;
}