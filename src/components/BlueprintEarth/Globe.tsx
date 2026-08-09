import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Globe() {
  const globeRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (!globeRef.current) return;

    globeRef.current.rotation.y += delta * 0.12;
    globeRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.025;
  });

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;

    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#02060d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#00F5FF";
    ctx.fillStyle = "rgba(0,245,255,.18)";
    ctx.lineWidth = 4;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#00F5FF";

    function land(points: number[][]) {
      ctx.beginPath();

      points.forEach((p, i) => {
        const x = p[0] * canvas.width;
        const y = p[1] * canvas.height;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    land([
      [.09,.18],[.18,.10],[.27,.15],[.31,.28],[.24,.40],[.18,.42],[.10,.30]
    ]);

    land([
      [.23,.44],[.29,.49],[.31,.63],[.27,.82],[.21,.70],[.20,.53]
    ]);

    land([
      [.43,.17],[.55,.12],[.69,.18],[.82,.29],[.76,.42],[.60,.39],[.47,.29]
    ]);

    land([
      [.48,.42],[.56,.49],[.57,.67],[.52,.80],[.46,.62]
    ]);

    land([
      [.80,.68],[.89,.71],[.86,.81],[.79,.77]
    ]);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <group>
      <mesh ref={globeRef}>
        <sphereGeometry args={[0.8,128,128]} />

        <meshPhysicalMaterial
          map={texture}
          color="#051019"
          emissive="#00F5FF"
          emissiveIntensity={0.55}
          metalness={0.9}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>

      <mesh scale={1.015}>
        <sphereGeometry args={[0.8,128,128]} />

        <meshBasicMaterial
          map={texture}
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh scale={1.03}>
        <sphereGeometry args={[0.8,128,128]} />

        <meshBasicMaterial
          color="#00F5FF"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.805,96,96]} />

        <meshBasicMaterial
          color="#6EFCFF"
          wireframe
          transparent
          opacity={0.38}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}