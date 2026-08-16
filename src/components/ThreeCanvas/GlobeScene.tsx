import React, { useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GlobeSphere } from "./GlobeSphere";
import { PlatonicSolids } from "./PlatonicSolids";
import { SacredGeometry3D } from "./SacredGeometry3D";
import { ParticleField } from "./ParticleField";
import { GeoNode, GlobeLayers, GISZoomLevel } from "../../types";

interface GlobeSceneProps {
  viewMode: string;
  selectedNodeId: string | null;
  onSelectNode: (node: GeoNode) => void;
  showNodes?: boolean;
  showWireframe?: boolean;
  isFocusMode: boolean;
  onToggleFocusMode: (focus?: boolean) => void;
  layers: GlobeLayers;
  onToggleLayer: (key: keyof GlobeLayers) => void;
  onResetLayers: () => void;
}

function ZoomTracker({
  onDistanceUpdate,
}: {
  onDistanceUpdate: (dist: number) => void;
}) {
  const { camera } = useThree();

  useFrame(() => {
    onDistanceUpdate(camera.position.length());
  });

  return null;
}

export const GlobeScene: React.FC<GlobeSceneProps> = ({
  viewMode,
  selectedNodeId,
  onSelectNode,
  showNodes = true,
  showWireframe = true,
  isFocusMode,
  onToggleFocusMode,
  layers,
}) => {
  const [cameraDistance, setCameraDistance] = useState(9.1);

  const zoomLevel: GISZoomLevel =
    cameraDistance > 6.8
      ? "GLOBAL"
      : cameraDistance > 5.4
      ? "REGIONAL"
      : cameraDistance > 4.5
      ? "GEOLOGICAL"
      : cameraDistance > 3.8
      ? "RESEARCH"
      : "LOCAL";

  void zoomLevel;

  const handleDoubleClick = () => {
    onToggleFocusMode(!isFocusMode);
  };

  return (
    <div
      className="relative h-full w-full"
      onDoubleClick={handleDoubleClick}
    >
      <Canvas
        camera={{
          position: [0, 0, 9.1],
          fov: 42,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.75]}
        style={{
          background: "transparent",
        }}
      >
        <ambientLight intensity={0.82} />

        <directionalLight
          position={[8, 8, 10]}
          intensity={1.18}
          color="#00f0ff"
        />

        <pointLight
          position={[-8, -6, -8]}
          intensity={0.24}
          color="#ffb700"
        />

        {/* BACKGROUND FIELD - STAYS BEHIND GLOBE */}
        <ParticleField />

        {/* MAIN GLOBE */}
        <group scale={1.0}>
          <GlobeSphere
            viewMode={viewMode}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            showNodes={showNodes}
            showWireframe={showWireframe}
            layers={layers}
          />

          {/* ONLY SHOW THESE WHEN THEIR VIEW MODES REQUIRE THEM */}
          {(viewMode === "SACRED_GEOMETRY" ||
            viewMode === "GEOMETRIC_LAYERS") && (
            <PlatonicSolids viewMode={viewMode} />
          )}

          {(viewMode === "FIBONACCI_SPIRAL" ||
            viewMode === "SACRED_GEOMETRY" ||
            viewMode === "GEOMETRIC_LAYERS") && (
            <SacredGeometry3D viewMode={viewMode} />
          )}
        </group>

        <ZoomTracker onDistanceUpdate={setCameraDistance} />

        <OrbitControls
          enableZoom
          enableRotate
          enablePan={false}
          minDistance={3.8}
          maxDistance={10}
          rotateSpeed={0.5}
          zoomSpeed={0.7}
          dampingFactor={0.08}
          enableDamping
          autoRotate={viewMode === "ORBIT_VIEW" && !isFocusMode}
          autoRotateSpeed={0.35}
        />
      </Canvas>
    </div>
  );
};