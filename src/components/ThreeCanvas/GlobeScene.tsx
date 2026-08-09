import React, { useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GlobeSphere } from './GlobeSphere';
import { PlatonicSolids } from './PlatonicSolids';
import { SacredGeometry3D } from './SacredGeometry3D';
import { ParticleField } from './ParticleField';
import { GeoNode, GlobeLayers, GISZoomLevel } from '../../types';
import { GlobeLayerControl } from './GlobeLayerControl';
import { GISZoomHUD } from './GISZoomHUD';

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

// Camera Distance Tracker Component inside Canvas
function ZoomTracker({ onDistanceUpdate }: { onDistanceUpdate: (dist: number) => void }) {
  const { camera } = useThree();
  useFrame(() => {
    onDistanceUpdate(camera.position.length());
  });
  return null;
}

// Smooth Continuous Camera Drift Component
function CameraDriftController({ isFocusMode }: { isFocusMode: boolean }) {
  useFrame((state) => {
    if (!isFocusMode) {
      const t = state.clock.getElapsedTime();
      state.camera.position.x += Math.sin(t * 0.15) * 0.001;
      state.camera.position.y += Math.cos(t * 0.12) * 0.001;
      state.camera.lookAt(0, 0, 0);
    }
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
  onToggleLayer,
  onResetLayers
}) => {
  const [cameraDistance, setCameraDistance] = useState(6.0);

  // Compute Zoom Level based on camera distance
  const zoomLevel: GISZoomLevel =
    cameraDistance > 6.8
      ? 'GLOBAL'
      : cameraDistance > 5.4
      ? 'REGIONAL'
      : cameraDistance > 4.5
      ? 'GEOLOGICAL'
      : cameraDistance > 3.8
      ? 'RESEARCH'
      : 'LOCAL';

  return (
    <div
      className="w-full h-full relative"
      onDoubleClick={() => onToggleFocusMode(false)}
    >
      {/* 3D Canvas Scene */}
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.9} color="#ffb700" />

        <group scale={0.88}>
          {/* 3D GIS Earth Sphere */}
          <GlobeSphere
            viewMode={viewMode}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            showNodes={showNodes}
            showWireframe={showWireframe}
            layers={layers}
          />

          {/* Floating Platonic Solids wireframes */}
          <PlatonicSolids viewMode={viewMode} />

          {/* 3D Sacred Geometry Curves */}
          <SacredGeometry3D viewMode={viewMode} />
        </group>

        {/* Background Multi-layer Stars */}
        <ParticleField />

        {/* Camera Drift Controller */}
        <CameraDriftController isFocusMode={isFocusMode} />

        {/* Zoom Distance Tracker */}
        <ZoomTracker onDistanceUpdate={setCameraDistance} />

        {/* Interactive Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3.2}
          maxDistance={9.5}
          rotateSpeed={0.6}
          autoRotate={viewMode === 'ORBIT_VIEW' && !isFocusMode}
          autoRotateSpeed={0.5}
          onStart={() => onToggleFocusMode(true)}
        />
      </Canvas>
    </div>
  );
};
