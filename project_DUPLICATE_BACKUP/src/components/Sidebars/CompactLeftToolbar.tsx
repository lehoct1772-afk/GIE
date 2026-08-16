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
  { id: 'globe', label: 'GLOBE', icon: <Globe className="w-4 h-4 text-cyan-400" /> },
  { id: 'layers', label: 'LAYERS', icon: <Layers className="w-4 h-4 text-emerald-400" /> },
  { id: 'research', label: 'RESEARCH', icon: <Search className="w-4 h-4 text-amber-400" /> },
  { id: 'measurements', label: 'MEASUREMENTS', icon: <Ruler className="w-4 h-4 text-cyan-300" /> },
  { id: 'geometry', label: 'GEOMETRY', icon: <Box className="w-4 h-4 text-indigo-400" /> },
  { id: 'ai', label: 'AI', icon: <Cpu className="w-4 h-4 text-purple-400" /> },
  { id: 'documents', label: 'DOCUMENTS', icon: <FileText className="w-4 h-4 text-slate-300" /> },
  { id: 'settings', label: 'SETTINGS', icon: <Sliders className="w-4 h-4 text-emerald-300" /> }
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
  const [expandedCategories, setExpandedCategories] = useState<Record<CategoryId, boolean>>({
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
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`transition-all duration-300 ease-in-out font-mono select-none z-30 pointer-events-auto h-[calc(100vh-100px)] max-h-[720px] flex flex-col bg-slate-950/90 border border-cyan-500/30 rounded-r-lg backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.15)] ${
        isExpanded ? 'w-52 md:w-56' : 'w-12 md:w-14'
      }`}
    >
      {/* Top Header & Pin Toggle */}
      <div className="p-2 border-b border-cyan-500/20 flex items-center justify-between min-h-[40px]">
        {isExpanded ? (
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-[10px] font-bold text-cyan-300 tracking-wider truncate">
              GIE TOOLBAR
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                setIsPinned(!isPinned);
              }}
              className={`p-1 rounded hover:bg-cyan-950/60 transition-colors ${
                isPinned ? 'text-amber-400' : 'text-slate-400'
              }`}
              title={isPinned ? 'Unpin Toolbar' : 'Pin Toolbar Open'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Scrollable Categories List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-2">
        {CATEGORIES.map(cat => {
          const catExpanded = expandedCategories[cat.id];

          return (
            <div
              key={cat.id}
              className="border border-cyan-500/15 rounded bg-slate-900/40 overflow-hidden transition-colors"
            >
              {/* Category Bar */}
              <button
onClick={() => toggleCategory(cat.id)}
>                <div className="flex items-center space-x-2 truncate">
                  <div className="flex-shrink-0">{cat.icon}</div>
                  {isExpanded && (
                    <span className="text-[10px] font-bold text-slate-200 tracking-wider truncate">
                      {cat.label}
                    </span>
                  )}
                </div>
                {isExpanded && (
                  <div>
                    {catExpanded ? (
                      <ChevronDown className="w-3 h-3 text-cyan-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    )}
                  </div>
                )}
              </button>

              {/* Collapsible Category Tools Content */}
              {isExpanded && catExpanded && (
                <div className="p-1.5 border-t border-cyan-500/15 bg-slate-950/60 space-y-1 text-[9px]">
                  {/* Category 1: Globe */}
                  {cat.id === 'globe' && (
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('ORBIT_VIEW');
                        }}
                        className={`w-full px-2 py-1 rounded text-left flex items-center space-x-1.5 ${
                          currentMode === 'ORBIT_VIEW'
                            ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/50'
                            : 'hover:bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        <Globe className="w-3 h-3 text-cyan-400" />
                        <span>Orbit View</span>
                      </button>
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('GEOMETRIC_LAYERS');
                        }}
                        className={`w-full px-2 py-1 rounded text-left flex items-center space-x-1.5 ${
                          currentMode === 'GEOMETRIC_LAYERS'
                            ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/50'
                            : 'hover:bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        <Box className="w-3 h-3 text-indigo-400" />
                        <span>Geometric Layers</span>
                      </button>
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('DATA_POINTS');
                        }}
                        className={`w-full px-2 py-1 rounded text-left flex items-center space-x-1.5 ${
                          currentMode === 'DATA_POINTS'
                            ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/50'
                            : 'hover:bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        <Network className="w-3 h-3 text-emerald-400" />
                        <span>Data Points</span>
                      </button>
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('SYMMETRY_MAP');
                        }}
                        className={`w-full px-2 py-1 rounded text-left flex items-center space-x-1.5 ${
                          currentMode === 'SYMMETRY_MAP'
                            ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/50'
                            : 'hover:bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        <Map className="w-3 h-3 text-amber-400" />
                        <span>Symmetry Map</span>
                      </button>
                    </div>
                  )}

                  {/* Category 2: Layers */}
                  {cat.id === 'layers' && (
                    <div className="space-y-1">
                      <div className="text-[8px] text-slate-500 uppercase font-bold px-1">
                        Quick Toggles
                      </div>
                      {[
                        { key: 'continents', label: 'Continents' },
                        { key: 'coastlines', label: 'Coastlines' },
                        { key: 'bathymetry', label: 'Bathymetry' },
                        { key: 'leyLines', label: 'Ley Lines' },
                        { key: 'mathOverlays', label: 'Math Grid' }
                      ].map(item => {
                        const key = item.key as keyof GlobeLayers;
                        const active = layers[key];
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              soundManager.playClick();
                              onToggleLayer(key);
                            }}
                            className={`w-full px-2 py-0.5 rounded text-left flex items-center justify-between ${
                              active
                                ? 'text-cyan-300 bg-cyan-950/60'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <span>{item.label}</span>
                            {active && <Check className="w-3 h-3 text-emerald-400" />}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onResetLayers();
                        }}
                        className="w-full mt-1 text-[8px] text-cyan-400 hover:underline text-right"
                      >
                        Reset Defaults
                      </button>
                    </div>
                  )}

                  {/* Category 3: Research */}
                  {cat.id === 'research' && (
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onOpenBlueprintLibrary();
                        }}
                        className="w-full px-2 py-1 rounded text-left bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center justify-between"
                      >
                        <span>Blueprint Library</span>
                        <Search className="w-3 h-3 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onOpenActivityLog();
                        }}
                        className="w-full px-2 py-1 rounded text-left bg-slate-900 hover:bg-cyan-950 text-emerald-300 border border-emerald-500/30 flex items-center justify-between"
                      >
                        <span>GIE Activity Log</span>
                        <Activity className="w-3 h-3 text-emerald-400" />
                      </button>
                    </div>
                  )}

                  {/* Category 4: Measurements */}
                  {cat.id === 'measurements' && (
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onOpenMathVisualizer();
                        }}
                        className="w-full px-2 py-1 rounded text-left bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center justify-between"
                      >
                        <span>Math Visualizer</span>
                        <Ruler className="w-3 h-3 text-cyan-400" />
                      </button>
                      <div className="p-1 bg-slate-900/80 rounded text-[8px] text-slate-400 space-y-0.5">
                        <div>Equatorial Arc: 40,075 km</div>
                        <div>Phi Ratio: 1.618033</div>
                        <div>GIE Triangulation: Active</div>
                      </div>
                    </div>
                  )}

                  {/* Category 5: Geometry */}
                  {cat.id === 'geometry' && (
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('SACRED_GEOMETRY');
                        }}
                        className={`w-full px-2 py-1 rounded text-left flex items-center space-x-1.5 ${
                          currentMode === 'SACRED_GEOMETRY'
                            ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/50'
                            : 'hover:bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>Sacred Geometry</span>
                      </button>
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('FIBONACCI_SPIRAL');
                        }}
                        className={`w-full px-2 py-1 rounded text-left flex items-center space-x-1.5 ${
                          currentMode === 'FIBONACCI_SPIRAL'
                            ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/50'
                            : 'hover:bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        <Disc className="w-3 h-3 text-amber-400" />
                        <span>Fibonacci Spiral</span>
                      </button>
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('PRIME_PATTERNS');
                        }}
                        className={`w-full px-2 py-1 rounded text-left flex items-center space-x-1.5 ${
                          currentMode === 'PRIME_PATTERNS'
                            ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/50'
                            : 'hover:bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        <Grid className="w-3 h-3 text-purple-400" />
                        <span>Prime Grid</span>
                      </button>
                    </div>
                  )}

                  {/* Category 6: AI */}
                  {cat.id === 'ai' && (
                    <div className="p-1.5 bg-purple-950/30 border border-purple-500/30 rounded text-[8px] space-y-1">
                      <div className="flex items-center space-x-1 text-purple-300 font-bold">
                        <Cpu className="w-3 h-3" />
                        <span>GIE CO-PILOT AI</span>
                      </div>
                      <div className="text-slate-300">
                        Analyzing 12 geodesic data points... Harmonic sync 99.4%.
                      </div>
                    </div>
                  )}

                  {/* Category 7: Documents */}
                  {cat.id === 'documents' && (
                    <div className="space-y-1 text-[8px]">
                      <div className="p-1.5 bg-slate-900/80 border border-slate-700/50 rounded text-slate-300">
                        📄 GIE_Geodesic_Axioms.pdf
                      </div>
                      <div className="p-1.5 bg-slate-900/80 border border-slate-700/50 rounded text-slate-300">
                        📐 Sacred_Geometry_Blueprint.svg
                      </div>
                    </div>
                  )}

                  {/* Category 8: Settings */}
                  {cat.id === 'settings' && (
                    <div className="space-y-1.5">
                      <button
                        onClick={() => {
                          onToggleAudio();
                        }}
                        className="w-full px-2 py-1 bg-slate-900 border border-slate-700 hover:border-cyan-500 rounded flex items-center justify-between text-cyan-300"
                      >
                        <span>Audio Chime</span>
                        {audioEnabled ? (
                          <Volume2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <VolumeX className="w-3 h-3 text-slate-500" />
                        )}
                      </button>
                      <div className="text-[8px] text-slate-500 px-1">
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

      {/* Bottom Footer Info */}
      <div className="p-2 border-t border-cyan-500/20 text-[8px] text-center text-slate-500">
        {isExpanded ? <span>GIE GIS SYSTEM v4.2</span> : <span>v4.2</span>}
      </div>
    </div>
  );
};
