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
  { id: 'globe', label: 'GLOBE', icon: <Globe className="h-5 w-5 text-cyan-400 drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]" /> },
  { id: 'layers', label: 'LAYERS', icon: <Layers className="h-5 w-5 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]" /> },
  { id: 'research', label: 'RESEARCH', icon: <Search className="h-5 w-5 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)]" /> },
  { id: 'measurements', label: 'MEASUREMENTS', icon: <Ruler className="h-5 w-5 text-cyan-300 drop-shadow-[0_0_4px_rgba(103,232,249,0.4)]" /> },
  { id: 'geometry', label: 'GEOMETRY', icon: <Box className="h-5 w-5 text-indigo-400 drop-shadow-[0_0_4px_rgba(129,140,248,0.4)]" /> },
  { id: 'ai', label: 'AI', icon: <Cpu className="h-5 w-5 text-purple-400 drop-shadow-[0_0_4px_rgba(192,132,252,0.4)]" /> },
  { id: 'documents', label: 'DOCUMENTS', icon: <FileText className="h-5 w-5 text-slate-400" /> },
  { id: 'settings', label: 'SETTINGS', icon: <Sliders className="h-5 w-5 text-emerald-300 drop-shadow-[0_0_4px_rgba(110,231,183,0.4)]" /> }
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
      className={`pointer-events-auto z-30 flex h-[620px] max-h-[calc(100vh-150px)] select-none flex-col rounded-r-lg border border-cyan-500/40 bg-slate-950/85 font-mono shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md transition-all duration-300 ease-in-out outline-none ${
        isExpanded ? 'w-[280px]' : 'w-[72px]'
      }`}
    >
      {/* HEADER */}
      <div className="flex min-h-[58px] items-center justify-between border-b border-cyan-500/20 p-2 bg-slate-950/40">
        {isExpanded ? (
          <div className="flex w-full items-center justify-between px-2">
            <span className="truncate text-[13px] font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]">
              GIE TOOLBAR
            </span>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsPinned(!isPinned);
              }}
              className={`rounded p-1 transition-all border-none outline-none bg-transparent hover:bg-cyan-950/40 ${
                isPinned ? 'text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]' : 'text-slate-500 hover:text-cyan-300'
              }`}
              title={isPinned ? 'Unpin Toolbar' : 'Pin Toolbar Open'}
            >
              <Pin className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <Globe className="h-5 w-5 animate-pulse text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]" />
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
              className={`overflow-hidden rounded border transition-all duration-200 ${
                catExpanded 
                  ? 'border-cyan-500/50 bg-slate-900/60 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                  : 'border-cyan-500/10 bg-slate-950/30 hover:bg-slate-900/30 hover:border-cyan-500/25'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`flex w-full items-center justify-between transition-colors border-none outline-none bg-transparent hover:bg-cyan-950/20 ${
                  isExpanded ? 'min-h-[48px] px-3 py-2' : 'h-[48px] px-0'
                }`}
              >
                <div className={`flex items-center ${isExpanded ? 'space-x-3' : 'w-full justify-center'}`}>
                  <div className="flex-shrink-0">{cat.icon}</div>
                  {isExpanded && (
                    <span className={`truncate text-[12px] font-bold tracking-wider transition-colors ${catExpanded ? 'text-cyan-300' : 'text-slate-300'}`}>
                      {cat.label}
                    </span>
                  )}
                </div>

                {isExpanded && (
                  <div>
                    {catExpanded ? (
                      <ChevronDown className="h-4 w-4 text-cyan-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                )}
              </button>

              {isExpanded && catExpanded && (
                <div className="space-y-1.5 border-t border-cyan-500/15 bg-slate-950/90 p-2 text-[10px]">

                  {/* GLOBE */}
                  {cat.id === 'globe' && (
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onSelectMode('ORBIT_VIEW');
                        }}
                        className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-left border-none outline-none ${
                          currentMode === 'ORBIT_VIEW'
                            ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                            : 'text-slate-400 hover:bg-slate-800/40'
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
                        className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-left border-none outline-none ${
                          currentMode === 'GEOMETRIC_LAYERS'
                            ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                            : 'text-slate-400 hover:bg-slate-800/40'
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
                        className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-left border-none outline-none ${
                          currentMode === 'DATA_POINTS'
                            ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                            : 'text-slate-400 hover:bg-slate-800/40'
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
                        className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-left border-none outline-none ${
                          currentMode === 'SYMMETRY_MAP'
                            ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                            : 'text-slate-400 hover:bg-slate-800/40'
                        }`}
                      >
                        <Map className="h-3.5 w-3.5 text-amber-400" />
                        <span>Symmetry Map</span>
                      </button>
                    </div>
                  )}

