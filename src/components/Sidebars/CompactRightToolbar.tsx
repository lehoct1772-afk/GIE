import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import { MathConstant } from '../../types';
import {
  Activity,
  Cpu,
  Radio,
  Rss,
  Calculator,
  RefreshCw,
  Bot,
  Pin,
  ChevronRight,
  ChevronDown,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { EngineActivityPanel } from '../Panels/EngineActivityPanel';
import { EngineStatusPanel } from '../Panels/EngineStatusPanel';
import { DataStreamsPanel } from '../Panels/DataStreamsPanel';
import { LiveDataFeedPanel } from '../Panels/LiveDataFeedPanel';
import { ConstantsPanel } from '../Panels/ConstantsPanel';
import { SynchronizationBox } from '../BottomBar/SynchronizationBox';
import { AIChatDockReserved } from '../RightBar/AIChatDockReserved';

type RightCategory =
  | 'activity'
  | 'status'
  | 'streams'
  | 'feed'
  | 'constants'
  | 'sync'
  | 'ai';

interface RightCategoryDef {
  id: RightCategory;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: RightCategoryDef[] = [
  { id: 'activity', label: 'ENGINE ACTIVITY', icon: <Activity className="w-3.5 h-3.5 text-cyan-400" /> },
  { id: 'status', label: 'ENGINE STATUS', icon: <Cpu className="w-3.5 h-3.5 text-emerald-400" /> },
  { id: 'streams', label: 'DATA STREAMS', icon: <Radio className="w-3.5 h-3.5 text-amber-400" /> },
  { id: 'feed', label: 'LIVE DATA FEED', icon: <Rss className="w-3.5 h-3.5 text-cyan-300" /> },
  { id: 'constants', label: 'MATH CONSTANTS', icon: <Calculator className="w-3.5 h-3.5 text-indigo-400" /> },
  { id: 'sync', label: 'SYNCHRONIZATION', icon: <RefreshCw className="w-3.5 h-3.5 text-emerald-300" /> },
  { id: 'ai', label: 'AI COPILOT', icon: <Bot className="w-3.5 h-3.5 text-purple-400" /> }
];

interface CompactRightToolbarProps {
  onOpenActivityLog?: () => void;
  onSelectConstant?: (c: MathConstant) => void;
  onOpenMathVisualizer?: () => void;
}

export const CompactRightToolbar: React.FC<CompactRightToolbarProps> = ({
  onOpenActivityLog = () => {},
  onSelectConstant = () => {},
  onOpenMathVisualizer = () => {}
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  
  // Single panel open at a time requirement, collapsed by default
  const [expandedCategory, setExpandedCategory] = useState<RightCategory | null>(null);

  const isExpanded = isHovered || isPinned;

  const toggleCategory = (id: RightCategory) => {
    soundManager.playClick();
    setExpandedCategory(prev => (prev === id ? null : id));
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`transition-all duration-300 ease-in-out font-mono select-none z-30 pointer-events-auto h-[calc(100vh-110px)] max-h-[720px] flex flex-col bg-slate-950/90 border border-cyan-500/30 rounded-l-lg backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.15)] ${
        isExpanded ? 'w-56 md:w-60' : 'w-12 md:w-14'
      }`}
    >
      {/* Top Header & Pin Button */}
      <div className="p-2 border-b border-cyan-500/20 flex items-center justify-between min-h-[40px]">
        {isExpanded ? (
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-[10px] font-bold text-cyan-300 tracking-wider truncate">
              ANALYTICS DOCK
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                setIsPinned(!isPinned);
              }}
              className={`p-1 rounded hover:bg-cyan-950/60 transition-colors ${
                isPinned ? 'text-amber-400' : 'text-slate-400'
              }`}
              title={isPinned ? 'Unpin Right Toolbar' : 'Pin Right Toolbar Open'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Scrollable Categories & Panels (Accordion Mode: Only 1 expanded at a time) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-1.5">
        {CATEGORIES.map(cat => {
          const isCatExpanded = expandedCategory === cat.id;

          return (
            <div
              key={cat.id}
              className={`border rounded overflow-hidden transition-all duration-200 ${
                isCatExpanded
                  ? 'border-cyan-500/40 bg-slate-900/80 shadow-[0_0_12px_rgba(0,240,255,0.1)]'
                  : 'border-cyan-500/15 bg-slate-900/40 hover:bg-slate-900/60'
              }`}
            >
              {/* Category Header Card */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full px-2 py-3 flex items-center justify-between transition-colors cursor-pointer text-left"                title={cat.label}
              >
                <div className="flex items-center space-x-2 truncate">
                  <div className="flex-shrink-0">{cat.icon}</div>
                  {isExpanded && (
                    <span className="text-[10px] font-bold text-slate-200 tracking-wider truncate">
                      {cat.label}
                    </span>
                  )}
                </div>
                {isExpanded && (
                  <div>
                    {isCatExpanded ? (
                      <ChevronDown className="w-3 h-3 text-cyan-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    )}
                  </div>
                )}
              </button>

              {/* Collapsible Category Panel Body (Compact 50% scale) */}
              {isExpanded && isCatExpanded && (
                <div className="p-1 border-t border-cyan-500/15 bg-slate-950/80 text-[9px] max-h-72 overflow-y-auto custom-scrollbar">
                  {cat.id === 'activity' && <EngineActivityPanel />}
                  {cat.id === 'status' && <EngineStatusPanel />}
                  {cat.id === 'streams' && <DataStreamsPanel />}
                  {cat.id === 'feed' && (
                    <LiveDataFeedPanel onOpenActivityLog={onOpenActivityLog} />
                  )}
                  {cat.id === 'constants' && (
                    <ConstantsPanel
                      onSelectConstant={onSelectConstant}
                      onOpenMoreConstants={onOpenMathVisualizer}
                    />
                  )}
                  {cat.id === 'sync' && <SynchronizationBox />}
                  {cat.id === 'ai' && <AIChatDockReserved />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Status */}
      <div className="p-2 border-t border-cyan-500/20 text-[8px] text-center text-slate-500">
        {isExpanded ? (
          <div className="flex items-center justify-center space-x-1 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>GEODESIC SYNC 100%</span>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto animate-ping" />
        )}
      </div>
    </div>
  );
};
