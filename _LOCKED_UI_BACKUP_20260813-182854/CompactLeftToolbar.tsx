import React, { useState } from 'react';
import { ViewMode, GlobeLayers, MathConstant } from '../../types';
import { soundManager } from '../../utils/audio';
import {
  Globe,
  Layers,
  Search,
  Ruler,
  Box,
  Cpu,
  FileText,
  Sliders,
  ChevronRight,
  ChevronDown,
  Pin,
  Check,
  Volume2,
  VolumeX,
  Activity,
  Disc,
  Grid,
  Sparkles,
  Map,
  Network
} from 'lucide-react';

interface CompactLeftToolbarProps {
  currentMode: ViewMode;
  onSelectMode: (mode: ViewMode) => void;
  layers: GlobeLayers;
  onToggleLayer: (key: keyof GlobeLayers) => void;
  onResetLayers: () => void;
  onOpenBlueprintLibrary: () => void;
  onOpenMathVisualizer: () => void;
  onOpenActivityLog: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onSelectConstant?: (c: MathConstant) => void;
}

type CategoryId =
  | 'globe'
  | 'layers'
  | 'research'
  | 'measurements'
  | 'geometry'
  | 'ai'
  | 'documents'
  | 'settings';

interface CategoryDef {
  id: CategoryId;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryDef[] = [
  { id: 'globe', label: 'GLOBE', icon: <Globe className="h-5 w-5 text-cyan-400" /> },
  { id: 'layers', label: 'LAYERS', icon: <Layers className="h-5 w-5 text-emerald-400" /> },
  { id: 'research', label: 'RESEARCH', icon: <Search className="h-5 w-5 text-amber-400" /> },
  { id: 'measurements', label: 'MEASUREMENTS', icon: <Ruler className="h-5 w-5 text-cyan-300" /> },
  { id: 'geometry', label: 'GEOMETRY', icon: <Box className="h-5 w-5 text-indigo-400" /> },
  { id: 'ai', label: 'AI', icon: <Cpu className="h-5 w-5 text-purple-400" /> },
  { id: 'documents', label: 'DOCUMENTS', icon: <FileText className="h-5 w-5 text-slate-300" /> },
  { id: 'settings', label: 'SETTINGS', icon: <Sliders className="h-5 w-5 text-emerald-300" /> }
];

export const CompactLeftToolbar: React.FC<CompactLeftToolbarProps> = ({
  currentMode,
  onSelectMode,
  layers,
  onToggleLayer,
  onResetLayers,
  onOpenBlueprintLibrary,
  onOpenMathVisualizer,
  onOpenActivityLog,
  audioEnabled,
  onToggleAudio
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const [expandedCategories, setExpandedCategories] = useState<
    Record<CategoryId, boolean>
  >({
    globe: false,
    layers: false,
    research: false,
    measurements: false,
    geometry: false,
    ai: false,
    documents: false,
    settings: false
  });

  const isExpanded = isHovered || isPinned;

  const toggleCategory = (id: CategoryId) => {
    soundManager.playClick();
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto z-30 flex h-[620px] max-h-[calc(100vh-150px)] select-none flex-col rounded-r-lg border border-cyan-500/30 bg-slate-950/90 font-mono shadow-[0_0_25px_rgba(0,240,255,0.15)] backdrop-blur-md transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-[280px]' : 'w-[72px]'
      }`}
    >
      {/* HEADER */}
      <div className="flex min-h-[58px] items-center justify-between border-b border-cyan-500/20 p-2">
        {isExpanded ? (
          <div className="flex w-full items-center justify-between px-2">
            <span className="truncate text-[13px] font-bold tracking-wider text-cyan-300">
              GIE TOOLBAR
            </span>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsPinned(!isPinned);
              }}
              className={`rounded p-1 transition-colors hover:bg-cyan-950/60 ${
                isPinned ? 'text-amber-400' : 'text-slate-400'
              }`}
              title={isPinned ? 'Unpin Toolbar' : 'Pin Toolbar Open'}
            >
              <Pin className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <Globe className="h-5 w-5 animate-pulse text-cyan-400" />
          </div>
        )}
      </div>

      {/* CATEGORIES */}
      <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-2">
        {CATEGORIES.map((cat) => {
          const catExpanded = expandedCategories[cat.id];

          return (
            <div
              key={cat.id}
              className="overflow-hidden rounded border border-cyan-500/15 bg-slate-900/40 transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`flex w-full items-center justify-between transition-colors hover:bg-cyan-950/40 ${
                  isExpanded ? 'min-h-[48px] px-3 py-2' : 'h-[48px] px-0'
                }`}
              >
                <div
                  className={`flex items-center ${
                    isExpanded
                      ? 'space-x-3'
                      : 'w-full justify-center'
                  }`}
                >
                  <div className="flex-shrink-0">{cat.icon}</div>

                  {isExpanded && (
                    <span className="truncate text-[12px] font-bold tracking-wider text-slate-200">
                      {cat.label}
                    </span>
                  )}
                </div>

                {isExpanded && (
                  <div>
                    {catExpanded ? (
                      <ChevronDown className="h-4 w-4 text-cyan-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                )}
              </button>

              {isExpanded && catExpanded && (
                <div className="space-y-1.5 border-t border-cyan-500/15 bg-slate-950/60 p-2 text-[10px]">

                  {/* GLOBE */}
                  {cat.id === 'globe' && (
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('ORBIT_VIEW');
                        }}
                        className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-left ${
                          currentMode === 'ORBIT_VIEW'
                            ? 'border border-cyan-500/50 bg-cyan-950 text-cyan-200'
                            : 'text-slate-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <Globe className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Orbit View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('GEOMETRIC_LAYERS');
                        }}
                        className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-left ${
                          currentMode === 'GEOMETRIC_LAYERS'
                            ? 'border border-cyan-500/50 bg-cyan-950 text-cyan-200'
                            : 'text-slate-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <Box className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Geometric Layers</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('DATA_POINTS');
                        }}
                        className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-left ${
                          currentMode === 'DATA_POINTS'
                            ? 'border border-cyan-500/50 bg-cyan-950 text-cyan-200'
                            : 'text-slate-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <Network className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Data Points</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('SYMMETRY_MAP');
                        }}
                        className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-left ${
                          currentMode === 'SYMMETRY_MAP'
                            ? 'border border-cyan-500/50 bg-cyan-950 text-cyan-200'
                            : 'text-slate-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <Map className="h-3.5 w-3.5 text-amber-400" />
                        <span>Symmetry Map</span>
                      </button>
                    </div>
                  )}

                  {/* LAYERS */}
                  {cat.id === 'layers' && (
                    <div className="space-y-1">
                      <div className="px-1 text-[9px] font-bold uppercase text-slate-500">
                        Quick Toggles
                      </div>

                      {[
                        { key: 'continents', label: 'Continents' },
                        { key: 'coastlines', label: 'Coastlines' },
                        { key: 'bathymetry', label: 'Bathymetry' },
                        { key: 'leyLines', label: 'Ley Lines' },
                        { key: 'mathOverlays', label: 'Math Grid' }
                      ].map((item) => {
                        const key = item.key as keyof GlobeLayers;
                        const active = layers[key];

                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => {
                              soundManager.playClick();
                              onToggleLayer(key);
                            }}
                            className={`flex w-full items-center justify-between rounded px-2 py-1 ${
                              active
                                ? 'bg-cyan-950/60 text-cyan-300'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <span>{item.label}</span>
                            {active && (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            )}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onResetLayers();
                        }}
                        className="mt-1 w-full text-right text-[9px] text-cyan-400 hover:underline"
                      >
                        Reset Defaults
                      </button>
                    </div>
                  )}

                  {/* RESEARCH */}
                  {cat.id === 'research' && (
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onOpenBlueprintLibrary();
                        }}
                        className="flex w-full items-center justify-between rounded border border-cyan-500/30 bg-slate-900 px-2 py-1.5 text-left text-cyan-300 hover:bg-cyan-950"
                      >
                        <span>Blueprint Library</span>
                        <Search className="h-3.5 w-3.5 text-cyan-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onOpenActivityLog();
                        }}
                        className="flex w-full items-center justify-between rounded border border-emerald-500/30 bg-slate-900 px-2 py-1.5 text-left text-emerald-300 hover:bg-cyan-950"
                      >
                        <span>GIE Activity Log</span>
                        <Activity className="h-3.5 w-3.5 text-emerald-400" />
                      </button>
                    </div>
                  )}

                  {/* MEASUREMENTS */}
                  {cat.id === 'measurements' && (
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onOpenMathVisualizer();
                        }}
                        className="flex w-full items-center justify-between rounded border border-cyan-500/30 bg-slate-900 px-2 py-1.5 text-left text-cyan-300 hover:bg-cyan-950"
                      >
                        <span>Math Visualizer</span>
                        <Ruler className="h-3.5 w-3.5 text-cyan-400" />
                      </button>

                      <div className="space-y-1 rounded bg-slate-900/80 p-2 text-[9px] text-slate-400">
                        <div>Equatorial Arc: 40,075 km</div>
                        <div>Phi Ratio: 1.618033</div>
                        <div>GIE Triangulation: Active</div>
                      </div>
                    </div>
                  )}

                  {/* GEOMETRY */}
                  {cat.id === 'geometry' && (
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('SACRED_GEOMETRY');
                        }}
                        className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-left ${
                          currentMode === 'SACRED_GEOMETRY'
                            ? 'border border-cyan-500/50 bg-cyan-950 text-cyan-200'
                            : 'text-slate-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Sacred Geometry</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('FIBONACCI_SPIRAL');
                        }}
                        className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-left ${
                          currentMode === 'FIBONACCI_SPIRAL'
                            ? 'border border-cyan-500/50 bg-cyan-950 text-cyan-200'
                            : 'text-slate-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <Disc className="h-3.5 w-3.5 text-amber-400" />
                        <span>Fibonacci Spiral</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('PRIME_PATTERNS');
                        }}
                        className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-left ${
                          currentMode === 'PRIME_PATTERNS'
                            ? 'border border-cyan-500/50 bg-cyan-950 text-cyan-200'
                            : 'text-slate-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <Grid className="h-3.5 w-3.5 text-purple-400" />
                        <span>Prime Grid</span>
                      </button>
                    </div>
                  )}

                  {/* AI */}
                  {cat.id === 'ai' && (
                    <div className="space-y-1 rounded border border-purple-500/30 bg-purple-950/30 p-2 text-[9px]">
                      <div className="flex items-center space-x-1.5 font-bold text-purple-300">
                        <Cpu className="h-3.5 w-3.5" />
                        <span>GIE CO-PILOT AI</span>
                      </div>

                      <div className="text-slate-300">
                        Analyzing 12 geodesic data points... Harmonic sync 99.4%.
                      </div>
                    </div>
                  )}

                  {/* DOCUMENTS */}
                  {cat.id === 'documents' && (
                    <div className="space-y-1.5 text-[9px]">
                      <div className="rounded border border-slate-700/50 bg-slate-900/80 p-2 text-slate-300">
                        📄 GIE_Geodesic_Axioms.pdf
                      </div>

                      <div className="rounded border border-slate-700/50 bg-slate-900/80 p-2 text-slate-300">
                        📐 Sacred_Geometry_Blueprint.svg
                      </div>
                    </div>
                  )}

                  {/* SETTINGS */}
                  {cat.id === 'settings' && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={onToggleAudio}
                        className="flex w-full items-center justify-between rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-cyan-300 hover:border-cyan-500"
                      >
                        <span>Audio Chime</span>

                        {audioEnabled ? (
                          <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <VolumeX className="h-3.5 w-3.5 text-slate-500" />
                        )}
                      </button>

                      <div className="px-1 text-[9px] text-slate-500">
                        Status: ONLINE • Latency: 12ms
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="border-t border-cyan-500/20 p-2 text-center text-[9px] text-slate-500">
        {isExpanded ? <span>GIE GIS SYSTEM v4.2</span> : <span>v4.2</span>}
      </div>
    </div>
  );
};