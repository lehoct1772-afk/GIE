import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

import Globe from "./Globe";
import GeometryGrid from "./GeometryGrid";
import Atmosphere from "./Atmosphere";
import Connections from "./Connections";
import Nodes from "./Nodes";
import FormulaOverlay from "./FormulaOverlay";
import CropCirclePreview from "./CropCirclePreview";
import CameraRig from "./CameraRig";

function EarthSystem({ focused }: { focused: boolean }) {
  const system = useRef<THREE.Group>(null!);
  const targetScale = focused ? 1.14 : 1;

  useFrame((_, delta) => {
    if (!system.current) return;

    system.current.rotation.y += delta * 0.055;
    const next = THREE.MathUtils.lerp(
      system.current.scale.x,
      targetScale,
      1 - Math.exp(-delta * 5),
    );
    system.current.scale.setScalar(next);
  });

  return (
    <group ref={system} rotation={[0.08, -0.25, 0]}>
      <Atmosphere />
      <Globe />
      <GeometryGrid />
      <Connections />
      <Nodes />
    </group>
  );
}

function OrbitalRings() {
  const group = useRef<THREE.Group>(null!);

  const rings = useMemo(
    () => [
      { radius: 2.62, rotation: [Math.PI / 2.8, 0.25, 0.08] as [number, number, number] },
      { radius: 2.82, rotation: [Math.PI / 2.05, -0.35, 0.18] as [number, number, number] },
      { radius: 3.02, rotation: [Math.PI / 1.62, 0.18, -0.28] as [number, number, number] },
    ],
    [],
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.018;
  });

  return (
    <group ref={group}>
      {rings.map((ring, index) => (
        <mesh key={ring.radius} rotation={ring.rotation}>
          <torusGeometry args={[ring.radius, index === 1 ? 0.006 : 0.004, 8, 220]} />
          <meshBasicMaterial
            color={index === 1 ? "#ffd84d" : "#18e7ff"}
            transparent
            opacity={index === 1 ? 0.38 : 0.22}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function HudCorner({ className }: { className: string }) {
  return (
    <div
      className={`absolute h-16 w-16 border-cyan-300/55 ${className}`}
      aria-hidden="true"
    />
  );
}

export default function BlueprintEarth() {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#01050b]"
      onDoubleClick={() => setFocused((value) => !value)}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{
          position: [0, 0, focused ? 3.15 : 3.72],
          fov: 42,
          near: 0.1,
          far: 500,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
      >
        <color attach="background" args={["#01050b"]} />
        <fog attach="fog" args={["#01050b", 9, 30]} />

        <ambientLight intensity={0.34} />

        <directionalLight
          position={[4, 5, 6]}
          intensity={2.2}
          color="#9afcff"
        />
        <directionalLight
          position={[-5, -2, 3]}
          intensity={0.72}
          color="#356dff"
        />
        <pointLight
          position={[0, 0, 3]}
          intensity={1.6}
          color="#00efff"
        />
        <pointLight
          position={[2.8, -1.6, 1.6]}
          intensity={0.9}
          color="#ffd84d"
        />

        <Stars
          radius={100}
          depth={50}
          count={6200}
          factor={3}
          saturation={0.12}
          fade
          speed={0.2}
        />

        <CameraRig />
        <EarthSystem focused={focused} />
        <OrbitalRings />
        <FormulaOverlay />
        <CropCirclePreview />

        <OrbitControls
          enablePan={false}
          enableZoom
          enableDamping
          dampingFactor={0.05}
          minDistance={2.35}
          maxDistance={5.2}
          rotateSpeed={0.42}
          zoomSpeed={0.5}
        />
      </Canvas>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, transparent 29%, rgba(1,5,11,0.12) 57%, rgba(1,5,11,0.88) 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,245,255,0.35) 4px)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,232,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,255,.16) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(circle at center, transparent 0%, transparent 28%, black 82%)",
        }}
      />

      {!focused && (
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="absolute left-7 top-1/2 w-44 -translate-y-1/2 border-l border-cyan-400/35 pl-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200/55">
            <div className="mb-3 text-cyan-300/80">Geometric Field</div>
            <div className="space-y-2 text-[9px] text-slate-400/70">
              <div>Topology / Active</div>
              <div>Node Mesh / Online</div>
              <div>Proof Trace / Ready</div>
              <div>World Graph / Linked</div>
            </div>
          </div>

          <div className="absolute right-7 top-1/2 w-48 -translate-y-1/2 border-r border-amber-300/35 pr-4 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/55">
            <div className="mb-3 text-amber-200/80">Analytical Layer</div>
            <div className="space-y-2 text-[9px] text-slate-400/70">
              <div>Relations / Visible</div>
              <div>Geometry / Verified</div>
              <div>Coordinates / Synced</div>
              <div>Inference / Explainable</div>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(70vw,70vh)] w-[min(70vw,70vh)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 shadow-[0_0_80px_rgba(0,225,255,0.08)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(78vw,78vh)] w-[min(78vw,78vh)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/[0.07]" />

      <HudCorner className="left-5 top-5 border-l border-t" />
      <HudCorner className="right-5 top-5 border-r border-t" />
      <HudCorner className="bottom-5 left-5 border-b border-l" />
      <HudCorner className="bottom-5 right-5 border-b border-r" />

      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.32em] text-cyan-200/35">
        Double-click globe to isolate · scroll to zoom · drag to rotate
      </div>
    </div>
  );
}
