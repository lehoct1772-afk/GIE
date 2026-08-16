import React, { useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GlobeSphere } from "./GlobeSphere";
import { PlatonicSolids } from "./PlatonicSolids";
import { SacredGeometry3D } from "./SacredGeometry3D";
import { ParticleField } from "./ParticleField";
import { GeoNode, GlobeLayers, GISZoomLevel } from "../../types";
import * as THREE from "three";

interface GlobeSceneProps {
  viewMode: string;
  selectedNodeId: string | null;
  onSelectNode: (node: GeoNode) => void;
  showNodes: boolean;
  showWireframe: boolean;
  isFocusMode: boolean;
  onToggleFocusMode: (focus?: boolean) => void;
  layers: GlobeLayers;
  onToggleLayer: (key: keyof GlobeLayers) => void;
  onResetLayers: () => void;
}

// Internal rotating rig to manage smooth continuous rotation and interactive controls together
function RotatingGlobeRig({ 
  children, 
  isFocusMode 
}: { 
  children: React.ReactNode; 
  isFocusMode: boolean; 
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smoothly auto-rotates the blueprint layout over time
      // Slows down rotation slightly during Focus Mode to allow closer inspection
      const speed = isFocusMode ? 0.03 : 0.08;
      groupRef.current.rotation.y += speed * delta;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export function GlobeScene({
  viewMode,
  selectedNodeId,
  onSelectNode,
  showNodes,
  showWireframe,
  isFocusMode,
  onToggleFocusMode,
  layers,
  onToggleLayer,
  onResetLayers
}: GlobeSceneProps) {
  return (
    <div 
      className="w-full h-full relative cursor-grab active:cursor-grabbing"
      onDoubleClick={() => onToggleFocusMode()}
    >
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        {/* Holographic Ambient Blueprint Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f5ff" />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#9000ff" />

        <RotatingGlobeRig isFocusMode={isFocusMode}>
          {/* 1. Core Globe Structure with Wireframe & Landmass Textures */}
          <GlobeSphere 
            showWireframe={showWireframe || layers.globeWireframe}
            showContinents={layers.continents}
            showCountries={layers.countries}
            showCoastlines={layers.coastlines}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            showNodes={showNodes}
            layers={layers}
          />

          {/* 2. Deep Space Vector Field / Star Grid */}
          <ParticleField active={layers.mathOverlays} />

          {/* 3. Sacred Geometry Blueprint Overlays */}
          {(viewMode === "SACRED_GEOMETRY" || viewMode === "GEOMETRIC_LAYERS" || layers.mathOverlays) && (
            <group>
              <SacredGeometry3D mode={viewMode} layers={layers} />
              <PlatonicSolids visible={viewMode === "GEOMETRIC_LAYERS"} />
            </group>
          )}
        </RotatingGlobeRig>

        {/* 4. Smooth Desktop Viewport Controls */}
        <OrbitControls 
          enableZoom={!isFocusMode} 
          enablePan={false}
          minDistance={8}
          maxDistance={25}
          makeDefault
        />
      </Canvas>

      {/* Cyber Grid HUD Watermark Indicator */}
      <div className="absolute bottom-4 left-4 pointer-events-none font-mono text-[9px] text-[#00f5ff]/40 uppercase tracking-widest bg-slate-950/40 p-2 rounded backdrop-blur-sm border border-[#00f5ff]/10">
        SYS_STATUS: ACTIVE // VIEW: {viewMode}<br />
        GRID_LAYER: {showWireframe || layers.globeWireframe ? "WIREFRAME_ON" : "VECTOR_MAP"}<br />
        AUTO_ROTATION: 0.08_RAD/S
      </div>
    </div>
  );
}

