import React from 'react';
import { ViewMode } from '../../types';
import { soundManager } from '../../utils/audio';
import { Globe, Box, Network, Map, Disc, Grid, Sparkles, Activity } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: ViewMode;
  onSelectMode: (mode: ViewMode) => void;
  orientation?: 'vertical' | 'horizontal';
}

const MODES: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'ORBIT_VIEW', label: 'ORBIT VIEW', icon: <Globe className="w-4 h-4" /> },
  { id: 'GEOMETRIC_LAYERS', label: 'GEOMETRIC LAYERS', icon: <Box className="w-4 h-4" /> },
  { id: 'DATA_POINTS', label: 'DATA POINTS', icon: <Network className="w-4 h-4" /> },
  { id: 'SYMMETRY_MAP', label: 'SYMMETRY MAP', icon: <Map className="w-4 h-4" /> },
  { id: 'FIBONACCI_SPIRAL', label: 'FIBONACCI SPIRAL', icon: <Disc className="w-4 h-4" /> },
  { id: 'PRIME_PATTERNS', label: 'PRIME PATTERNS', icon: <Grid className="w-4 h-4" /> },
  { id: 'SACRED_GEOMETRY', label: 'SACRED GEOMETRY', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'MATH_VISUALIZER', label: 'MATH VISUALIZER', icon: <Activity className="w-4 h-4" /> }
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  orientation = 'vertical'
}) => {
  if (orientation === 'vertical') {
    return (
      <div className="bg-slate-950/90 border border-cyan-500/30 rounded p-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col space-y-1 select-none w-48">
        <div className="text-[9px] font-mono text-cyan-400 font-bold tracking-widest uppercase px-2 py-1 border-b border-cyan-500/20 mb-0.5">
          VIEW MODE CONTROLS
        </div>
        {MODES.map(mode => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => {
                soundManager.playClick();
                onSelectMode(mode.id);
              }}
              onMouseEnter={() => soundManager.playHover()}
              className={`w-full py-1.5 px-2.5 rounded border font-mono text-[10px] uppercase font-bold tracking-wider transition-all flex items-center space-x-2.5 cursor-pointer ${
                isActive
                  ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-slate-900/60 border-cyan-500/20 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-800/80'
              }`}
            >
              <div className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                {mode.icon}
              </div>
              <span className="truncate text-left">{mode.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center gap-1.5 overflow-x-auto select-none p-1 bg-slate-950/90 border border-cyan-500/30 rounded backdrop-blur-md">
      {MODES.map(mode => {
        const isActive = currentMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => {
              soundManager.playClick();
              onSelectMode(mode.id);
            }}
            onMouseEnter={() => soundManager.playHover()}
            className={`py-1.5 px-2.5 rounded border font-mono text-[9px] uppercase font-bold tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              isActive
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-slate-900/60 border-cyan-500/20 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-800/80'
            }`}
          >
            <div className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
              {mode.icon}
            </div>
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};
