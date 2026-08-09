import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraRig() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    const targetX = Math.sin(t * 0.12) * 0.05;
    const targetY = Math.cos(t * 0.10) * 0.03;

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetX,
      0.03
    );

    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetY,
      0.03
    );

    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      3.6,
      0.03
    );

    camera.lookAt(0, 0, 0);
  });

  return null;
}