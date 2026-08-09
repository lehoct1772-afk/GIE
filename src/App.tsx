/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavTab, ViewMode, GeoNode, MathConstant, GlobeLayers } from './types';
import { Header } from './components/Header';
import { GlobeScene } from './components/ThreeCanvas/GlobeScene';
import { ProjectPreviews } from './components/ProjectPreviews/ProjectPreviews';
import { Heart } from 'lucide-react';

// Side Controls & Dock
import { CompactLeftToolbar } from './components/Sidebars/CompactLeftToolbar';
import { CompactRightToolbar } from './components/Sidebars/CompactRightToolbar';

// Modals
import { LaunchEngineModal } from './components/Modals/LaunchEngineModal';
import { BlueprintLibraryModal } from './components/Modals/BlueprintLibraryModal';
import { MathVisualizerModal } from './components/Modals/MathVisualizerModal';
import { ActivityLogModal } from './components/Modals/ActivityLogModal';
import { ConstantDetailModal } from './components/Modals/ConstantDetailModal';

// Views
import { TabViews } from './components/Views/TabViews';

// Audio
import { soundManager } from './utils/audio';

const INITIAL_LAYERS: GlobeLayers = {
  continents: true,
  countries: false,
  coastlines: true,
  rivers: false,
  mountains: false,
  bathymetry: false,
  oceanTrenches: false,
  volcanoes: false,
  earthquakes: false,
  tectonicPlates: false,
  leyLines: false,
  ancientSites: false,
  cropCircles: false,
  mathOverlays: true,
  userUploads: false,
  researchMarkers: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('HOME');
  const [viewMode, setViewMode] = useState<ViewMode>('ORBIT_VIEW');
  const [selectedNode, setSelectedNode] = useState<GeoNode | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Focus Mode State
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Globe Layers State
  const [layers, setLayers] = useState(INITIAL_LAYERS);

  // Modals State
  const [isLaunchEngineOpen, setIsLaunchEngineOpen] = useState(false);
  const [isBlueprintLibraryOpen, setIsBlueprintLibraryOpen] = useState(false);
  const [isMathVisualizerOpen, setIsMathVisualizerOpen] = useState(false);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [selectedConstant, setSelectedConstant] =
    useState<MathConstant | null>(null);

  const handleToggleAudio = () => {
    const next = !audioEnabled;

    setAudioEnabled(next);
    soundManager.setEnabled(next);

    if (next) {
      soundManager.playChime();
    }
  };

  const handleSelectMode = (mode: ViewMode) => {
    setViewMode(mode);

    if (mode === 'MATH_VISUALIZER') {
      setIsMathVisualizerOpen(true);
    } else if (
      mode === 'SACRED_GEOMETRY' ||
      mode === 'GEOMETRIC_LAYERS'
    ) {
      soundManager.playScan();
    }
  };

  const handleToggleLayer = (key: keyof GlobeLayers) => {
    setLayers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleResetLayers = () => {
    setLayers(INITIAL_LAYERS);
  };

  const handleToggleFocusMode = (focus?: boolean) => {
    const next =
      focus !== undefined
        ? focus
        : !isFocusMode;

    setIsFocusMode(next);

    if (next) {
      soundManager.playClick();
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#020611] text-white">

      {/* FINE CYBER GRID BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,245,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* FOCUS MODE BANNER */}
      {isFocusMode && (
        <div className="absolute left-1/2 top-3 z-40 flex -translate-x-1/2 items-center space-x-3 rounded-full border border-amber-400/80 bg-amber-950/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-200 shadow-[0_0_20px_rgba(255,183,0,0.4)] backdrop-blur-md">
          <span>
            [ FOCUS MODE ACTIVE ] • DOUBLE-CLICK GLOBE TO RESTORE INTERFACE
          </span>

          <button
            onClick={() => setIsFocusMode(false)}
            className="cursor-pointer rounded bg-amber-500 px-2 py-0.5 font-bold text-slate-950 transition-colors hover:bg-amber-400"
          >
            EXIT FOCUS
          </button>
        </div>
      )}

      {/* HEADER */}
      <div
        className={`z-30 transition-opacity duration-500 ${
          isFocusMode
            ? 'pointer-events-none opacity-0'
            : 'opacity-100'
        }`}
      >
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLaunchEngine={() => setIsLaunchEngineOpen(true)}
          audioEnabled={audioEnabled}
          onToggleAudio={handleToggleAudio}
        />
      </div>

      {/* HOME */}
      {activeTab === 'HOME' ? (
        <main className="relative z-10 flex flex-1 flex-col justify-between overflow-hidden">

          {/* LIVE 3D GLOBE */}
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <GlobeScene
              viewMode={viewMode}
              selectedNodeId={
                selectedNode
                  ? selectedNode.id
                  : null
              }
              onSelectNode={(node) => {
                soundManager.playClick();
                setSelectedNode(node);
              }}
              showNodes={viewMode !== 'GEOMETRIC_LAYERS'}
              showWireframe={viewMode !== 'DATA_POINTS'}
              isFocusMode={isFocusMode}
              onToggleFocusMode={handleToggleFocusMode}
              layers={layers}
              onToggleLayer={handleToggleLayer}
              onResetLayers={handleResetLayers}
            />
          </div>

          {/* SIX GIE PROJECT PREVIEWS */}
          <div
            className={`transition-opacity duration-500 ${
              isFocusMode
                ? 'pointer-events-none opacity-0'
                : 'opacity-100'
            }`}
          >
            <ProjectPreviews />
          </div>

          {/* LEFT + RIGHT TOOLBARS */}
          <div
            className={`pointer-events-none absolute inset-0 z-20 flex items-start justify-between p-1.5 transition-opacity duration-500 md:p-2 ${
              isFocusMode
                ? 'opacity-0'
                : 'opacity-100'
            }`}
          >
            {/* LEFT TOOLBAR */}
            <div
              className={
                isFocusMode
                  ? 'pointer-events-none'
                  : 'pointer-events-auto'
              }
            >
              <CompactLeftToolbar
                currentMode={viewMode}
                onSelectMode={handleSelectMode}
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onResetLayers={handleResetLayers}
                onOpenBlueprintLibrary={() =>
                  setIsBlueprintLibraryOpen(true)
                }
                onOpenMathVisualizer={() =>
                  setIsMathVisualizerOpen(true)
                }
                onOpenActivityLog={() =>
                  setIsActivityLogOpen(true)
                }
                audioEnabled={audioEnabled}
                onToggleAudio={handleToggleAudio}
                onSelectConstant={(c) =>
                  setSelectedConstant(c)
                }
              />
            </div>

            {/* RIGHT TOOLBAR */}
            <div
              className={
                isFocusMode
                  ? 'pointer-events-none'
                  : 'pointer-events-auto'
              }
            >
              <CompactRightToolbar
                onOpenActivityLog={() =>
                  setIsActivityLogOpen(true)
                }
                onSelectConstant={(c) =>
                  setSelectedConstant(c)
                }
                onOpenMathVisualizer={() =>
                  setIsMathVisualizerOpen(true)
                }
              />
            </div>
          </div>
        </main>
      ) : (
        /* OTHER SITE PAGES */
        <main className="z-10 flex-1 overflow-hidden">
          <TabViews
            activeTab={activeTab}
            onLaunchEngine={() =>
              setIsLaunchEngineOpen(true)
            }
            onOpenBlueprintLibrary={() =>
              setIsBlueprintLibraryOpen(true)
            }
          />
        </main>
      )}

      {/* SUPPORT / DONATE */}
      <button
        onClick={() => {
          soundManager.playChime();
          setActiveTab('SUPPORT_GIE');
        }}
        onMouseEnter={() =>
          soundManager.playHover()
        }
        className={`fixed bottom-4 right-4 z-40 flex cursor-pointer items-center space-x-2 rounded-lg border px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-all ${
          activeTab === 'SUPPORT_GIE'
            ? 'scale-105 border-amber-300 bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(255,183,0,0.8)]'
            : 'border-amber-400/80 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(255,183,0,0.35)] hover:bg-amber-500/40 hover:shadow-[0_0_25px_rgba(255,183,0,0.75)]'
        }`}
        title="Support GIE / Donate"
      >
        <Heart className="h-4 w-4 animate-pulse fill-amber-400 text-amber-400" />
        <span>SUPPORT GIE / DONATE</span>
      </button>

      {/* MODALS */}
      <LaunchEngineModal
        isOpen={isLaunchEngineOpen}
        onClose={() =>
          setIsLaunchEngineOpen(false)
        }
      />

      <BlueprintLibraryModal
        isOpen={isBlueprintLibraryOpen}
        onClose={() =>
          setIsBlueprintLibraryOpen(false)
        }
      />

      <MathVisualizerModal
        isOpen={isMathVisualizerOpen}
        onClose={() =>
          setIsMathVisualizerOpen(false)
        }
      />

      <ActivityLogModal
        isOpen={isActivityLogOpen}
        onClose={() =>
          setIsActivityLogOpen(false)
        }
      />

      <ConstantDetailModal
        constant={selectedConstant}
        onClose={() =>
          setSelectedConstant(null)
        }
      />
    </div>
  );
}