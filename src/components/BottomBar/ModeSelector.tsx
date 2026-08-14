import React from 'react';
import { ViewMode } from '../../types';
import { soundManager } from '../../utils/audio';
import {
  Globe,
  Box,
  Network,
  Map,
  Disc,
  Grid,
  Sparkles,
  Activity
} from 'lucide-react';

interface ModeSelectorProps {
  currentMode: ViewMode;
  onSelectMode: (mode: ViewMode) => void;
  orientation?: 'vertical' | 'horizontal';
}

const MODES: {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'ORBIT_VIEW',
    label: 'ORBIT VIEW',
    icon: <Globe className="h-5 w-5" />
  },
  {
    id: 'GEOMETRIC_LAYERS',
    label: 'GEOMETRIC LAYERS',
    icon: <Box className="h-5 w-5" />
  },
  {
    id: 'DATA_POINTS',
    label: 'DATA POINTS',
    icon: <Network className="h-5 w-5" />
  },
  {
    id: 'SYMMETRY_MAP',
    label: 'SYMMETRY MAP',
    icon: <Map className="h-5 w-5" />
  },
  {
    id: 'FIBONACCI_SPIRAL',
    label: 'FIBONACCI SPIRAL',
    icon: <Disc className="h-5 w-5" />
  },
  {
    id: 'PRIME_PATTERNS',
    label: 'PRIME PATTERNS',
    icon: <Grid className="h-5 w-5" />
  },
  {
    id: 'SACRED_GEOMETRY',
    label: 'SACRED GEOMETRY',
    icon: <Sparkles className="h-5 w-5" />
  },
  {
    id: 'MATH_VISUALIZER',
    label: 'MATH VISUALIZER',
    icon: <Activity className="h-5 w-5" />
  }
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  orientation = 'vertical'
}) => {
  if (orientation === 'vertical') {
    return (
      <div className="flex w-[230px] select-none flex-col space-y-1.5 rounded border border-cyan-500/35 bg-slate-950/92 p-2 shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-md">
        <div className="mb-1 border-b border-cyan-500/20 px-2 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
          VIEW MODE CONTROLS
        </div>

        {MODES.map((mode) => {
          const isActive = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                onSelectMode(mode.id);
              }}
              onMouseEnter={() => soundManager.playHover()}
              className={`flex min-h-[42px] w-full cursor-pointer items-center space-x-3 rounded border px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'border-cyan-400 bg-cyan-950/90 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'border-cyan-500/20 bg-slate-900/60 text-slate-400 hover:border-cyan-500/40 hover:bg-slate-800/80 hover:text-cyan-300'
              }`}
            >
              <div
                className={
                  isActive
                    ? 'text-cyan-400'
                    : 'text-slate-400'
                }
              >
                {mode.icon}
              </div>

              <span className="truncate text-left">
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex w-full select-none items-center justify-center gap-2 overflow-x-auto rounded border border-cyan-500/35 bg-slate-950/92 p-2 backdrop-blur-md">
      {MODES.map((mode) => {
        const isActive = currentMode === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => {
              soundManager.playClick();
              onSelectMode(mode.id);
            }}
            onMouseEnter={() => soundManager.playHover()}
            className={`flex min-h-[38px] cursor-pointer items-center space-x-2 whitespace-nowrap rounded border px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
              isActive
                ? 'border-cyan-400 bg-cyan-950/90 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'border-cyan-500/20 bg-slate-900/60 text-slate-400 hover:border-cyan-500/40 hover:bg-slate-800/80 hover:text-cyan-300'
            }`}
          >
            <div
              className={
                isActive
                  ? 'text-cyan-400'
                  : 'text-slate-400'
              }
            >
              {mode.icon}
            </div>

            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};