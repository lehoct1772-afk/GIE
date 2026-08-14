import React, { useState } from 'react';
import {
  Orbit,
  Move3D,
  Layers3,
  Network,
  Calculator,
  Library,
  Activity,
  Volume2,
  VolumeX,
  RotateCcw,
  Pin,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';

import { ViewMode, MathConstant, GlobeLayers } from '../../types';
import { soundManager } from '../../utils/audio';

interface CompactLeftToolbarProps {
  currentMode: ViewMode;
  onSelectMode: (mode: ViewMode) => void;

  layers: GlobeLayers;
  onToggleLayer: (key: keyof GlobeLayers) => void;
  onResetLayers: () => void;

  onOpenBlueprintLibrary?: () => void;
  onOpenMathVisualizer?: () => void;
  onOpenActivityLog?: () => void;

  audioEnabled: boolean;
  onToggleAudio: () => void;

  onSelectConstant?: (c: MathConstant) => void;
}

type LeftCategory =
  | 'view'
  | 'geometry'
  | 'layers'
  | 'library'
  | 'activity'
  | 'audio';

interface LeftCategoryDef {
  id: LeftCategory;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: LeftCategoryDef[] = [
  {
    id: 'view',
    label: 'VIEW MODE',
    icon: <Orbit className="h-4 w-4 text-cyan-400" />,
  },
  {
    id: 'geometry',
    label: 'GEOMETRY',
    icon: <Move3D className="h-4 w-4 text-emerald-400" />,
  },
  {
    id: 'layers',
    label: 'GLOBE LAYERS',
    icon: <Layers3 className="h-4 w-4 text-amber-400" />,
  },
  {
    id: 'library',
    label: 'BLUEPRINT LIBRARY',
    icon: <Library className="h-4 w-4 text-cyan-300" />,
  },
  {
    id: 'activity',
    label: 'ACTIVITY LOG',
    icon: <Activity className="h-4 w-4 text-indigo-400" />,
  },
  {
    id: 'audio',
    label: 'AUDIO',
    icon: <Volume2 className="h-4 w-4 text-purple-400" />,
  },
];

const VIEW_MODES: {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'ORBIT_VIEW',
    label: 'ORBIT VIEW',
    icon: <Orbit className="h-3.5 w-3.5" />,
  },
  {
    id: 'SACRED_GEOMETRY',
    label: 'SACRED GEOMETRY',
    icon: <Network className="h-3.5 w-3.5" />,
  },
  {
    id: 'GEOMETRIC_LAYERS',
    label: 'GEOMETRIC LAYERS',
    icon: <Layers3 className="h-3.5 w-3.5" />,
  },
  {
    id: 'MATH_VISUALIZER',
    label: 'MATH VISUALIZER',
    icon: <Calculator className="h-3.5 w-3.5" />,
  },
];

const LAYER_OPTIONS: {
  key: keyof GlobeLayers;
  label: string;
}[] = [
  { key: 'continents', label: 'CONTINENTS' },
  { key: 'countries', label: 'COUNTRIES' },
  { key: 'coastlines', label: 'COASTLINES' },
  { key: 'rivers', label: 'RIVERS' },
  { key: 'mountains', label: 'MOUNTAINS' },
  { key: 'bathymetry', label: 'BATHYMETRY' },
  { key: 'oceanTrenches', label: 'OCEAN TRENCHES' },
  { key: 'volcanoes', label: 'VOLCANOES' },
  { key: 'earthquakes', label: 'EARTHQUAKES' },
  { key: 'tectonicPlates', label: 'TECTONIC PLATES' },
  { key: 'leyLines', label: 'LEY LINES' },
  { key: 'ancientSites', label: 'ANCIENT SITES' },
  { key: 'cropCircles', label: 'CROP CIRCLES' },
  { key: 'mathOverlays', label: 'MATH OVERLAYS' },
  { key: 'userUploads', label: 'USER UPLOADS' },
  { key: 'researchMarkers', label: 'RESEARCH MARKERS' },
  { key: 'latitudeLongitude', label: 'LAT / LONG GRID' },
  { key: 'connectionArcs', label: 'CONNECTION ARCS' },
  { key: 'harmonicRing', label: 'HARMONIC RING' },
  { key: 'gieNodes', label: 'GIE NODES' },
  { key: 'globeWireframe', label: 'WIREFRAME' },
];

export const CompactLeftToolbar: React.FC<
  CompactLeftToolbarProps
> = ({
  currentMode,
  onSelectMode,
  layers,
  onToggleLayer,
  onResetLayers,
  onOpenBlueprintLibrary = () => {},
  onOpenMathVisualizer = () => {},
  onOpenActivityLog = () => {},
  audioEnabled,
  onToggleAudio,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const [expandedCategory, setExpandedCategory] =
    useState<LeftCategory | null>(null);

  const isExpanded = isHovered || isPinned;

  const toggleCategory = (id: LeftCategory) => {
    soundManager.playClick();

    setExpandedCategory((prev) =>
      prev === id ? null : id
    );
  };

  const selectMode = (mode: ViewMode) => {
    soundManager.playClick();
    onSelectMode(mode);

    if (mode === 'MATH_VISUALIZER') {
      onOpenMathVisualizer();
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto z-30 flex h-[500px] max-h-[calc(100vh-125px)] select-none flex-col rounded-r-md border border-cyan-500/25 bg-slate-950/88 font-mono shadow-[0_0_18px_rgba(0,240,255,0.12)] backdrop-blur-md transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-[230px]' : 'w-[52px]'
      }`}
    >
      {/* HEADER */}
      <div className="flex min-h-[44px] items-center justify-between border-b border-cyan-500/20 p-1.5">
        {isExpanded ? (
          <div className="flex w-full items-center justify-between px-1.5">
            <span className="truncate text-[11px] font-bold tracking-wider text-cyan-300">
              CONTROL DOCK
            </span>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsPinned(!isPinned);
              }}
              className={`rounded p-1 transition-colors hover:bg-cyan-950/60 ${
                isPinned
                  ? 'text-amber-400'
                  : 'text-slate-400'
              }`}
              title={
                isPinned
                  ? 'Unpin Left Toolbar'
                  : 'Pin Left Toolbar Open'
              }
            >
              <Pin className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <Zap className="h-4 w-4 animate-pulse text-cyan-400" />
          </div>
        )}
      </div>

      {/* CATEGORIES */}
      <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-1.5">
        {CATEGORIES.map((cat) => {
          const isCatExpanded =
            expandedCategory === cat.id;

          return (
            <div
              key={cat.id}
              className={`overflow-hidden rounded border transition-all duration-200 ${
                isCatExpanded
                  ? 'border-cyan-500/40 bg-slate-900/80 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                  : 'border-cyan-500/15 bg-slate-900/40 hover:bg-slate-900/60'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                title={cat.label}
                className={`flex w-full items-center justify-between text-left transition-colors ${
                  isExpanded
                    ? 'min-h-[38px] px-2 py-1'
                    : 'h-[38px] px-0'
                }`}
              >
                <div
                  className={`flex items-center ${
                    isExpanded
                      ? 'space-x-2'
                      : 'w-full justify-center'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {cat.icon}
                  </div>

                  {isExpanded && (
                    <span className="truncate text-[9px] font-bold tracking-wider text-slate-200">
                      {cat.label}
                    </span>
                  )}
                </div>

                {isExpanded && (
                  <div>
                    {isCatExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                    )}
                  </div>
                )}
              </button>

              {isExpanded && isCatExpanded && (
                <div className="custom-scrollbar max-h-[245px] overflow-y-auto border-t border-cyan-500/15 bg-slate-950/80 p-1.5 text-[9px]">
                  {cat.id === 'view' && (
                    <div className="space-y-1">
                      {VIEW_MODES.map((mode) => {
                        const active =
                          currentMode === mode.id;

                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() =>
                              selectMode(mode.id)
                            }
                            className={`flex w-full items-center gap-2 rounded border px-2 py-1.5 text-left transition ${
                              active
                                ? 'border-cyan-400/50 bg-cyan-950/60 text-cyan-200'
                                : 'border-cyan-500/10 bg-slate-900/40 text-slate-300 hover:border-cyan-500/30 hover:bg-slate-900/70'
                            }`}
                          >
                            {mode.icon}
                            <span>{mode.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {cat.id === 'geometry' && (
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() =>
                          selectMode('SACRED_GEOMETRY')
                        }
                        className="flex w-full items-center gap-2 rounded border border-cyan-500/15 bg-slate-900/40 px-2 py-1.5 text-left text-slate-300 transition hover:border-cyan-400/40 hover:bg-slate-900/70"
                      >
                        <Network className="h-3.5 w-3.5 text-emerald-400" />
                        SACRED GEOMETRY
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          selectMode('GEOMETRIC_LAYERS')
                        }
                        className="flex w-full items-center gap-2 rounded border border-cyan-500/15 bg-slate-900/40 px-2 py-1.5 text-left text-slate-300 transition hover:border-cyan-400/40 hover:bg-slate-900/70"
                      >
                        <Move3D className="h-3.5 w-3.5 text-cyan-400" />
                        GEOMETRIC LAYERS
                      </button>

                      <button
                        type="button"
                        onClick={onOpenMathVisualizer}
                        className="flex w-full items-center gap-2 rounded border border-cyan-500/15 bg-slate-900/40 px-2 py-1.5 text-left text-slate-300 transition hover:border-cyan-400/40 hover:bg-slate-900/70"
                      >
                        <Calculator className="h-3.5 w-3.5 text-indigo-400" />
                        MATH VISUALIZER
                      </button>
                    </div>
                  )}

                  {cat.id === 'layers' && (
                    <div className="space-y-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[8px] font-bold tracking-wider text-cyan-300/70">
                          MAP LAYERS
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            onResetLayers();
                          }}
                          className="rounded p-1 text-slate-400 transition hover:bg-cyan-950/60 hover:text-cyan-200"
                          title="Reset Layers"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </button>
                      </div>

                      {LAYER_OPTIONS.map((layer) => {
                        const enabled = layers[layer.key];

                        return (
                          <button
                            key={layer.key}
                            type="button"
                            onClick={() => {
                              soundManager.playClick();
                              onToggleLayer(layer.key);
                            }}
                            className={`flex w-full items-center justify-between rounded border px-2 py-1 text-left transition ${
                              enabled
                                ? 'border-cyan-400/30 bg-cyan-950/40 text-cyan-200'
                                : 'border-cyan-500/10 bg-slate-900/30 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <span>{layer.label}</span>

                            {enabled ? (
                              <Eye className="h-3 w-3 text-cyan-400" />
                            ) : (
                              <EyeOff className="h-3 w-3 text-slate-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {cat.id === 'library' && (
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        onOpenBlueprintLibrary();
                      }}
                      className="flex w-full items-center gap-2 rounded border border-cyan-500/20 bg-slate-900/50 px-2 py-2 text-left font-bold text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-950/40"
                    >
                      <Library className="h-3.5 w-3.5" />
                      OPEN BLUEPRINT LIBRARY
                    </button>
                  )}

                  {cat.id === 'activity' && (
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        onOpenActivityLog();
                      }}
                      className="flex w-full items-center gap-2 rounded border border-cyan-500/20 bg-slate-900/50 px-2 py-2 text-left font-bold text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-950/40"
                    >
                      <Activity className="h-3.5 w-3.5" />
                      OPEN ACTIVITY LOG
                    </button>
                  )}

                  {cat.id === 'audio' && (
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        onToggleAudio();
                      }}
                      className="flex w-full items-center justify-between rounded border border-cyan-500/20 bg-slate-900/50 px-2 py-2 text-left font-bold text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-950/40"
                    >
                      <span>
                        {audioEnabled
                          ? 'SYSTEM AUDIO ON'
                          : 'SYSTEM AUDIO OFF'}
                      </span>

                      {audioEnabled ? (
                        <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <VolumeX className="h-3.5 w-3.5 text-slate-500" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="border-t border-cyan-500/20 p-1.5 text-center">
        {isExpanded ? (
          <div className="text-[8px] font-bold tracking-[0.12em] text-cyan-300/70">
            GIE CONTROL
          </div>
        ) : (
          <div className="mx-auto h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
        )}
      </div>
    </div>
  );
};