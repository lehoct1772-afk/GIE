import React, { useState } from "react";
import { soundManager } from "../../utils/audio";
import { MathConstant } from "../../types";
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
  CheckCircle2,
} from "lucide-react";

import { EngineActivityPanel } from "../Panels/EngineActivityPanel";
import { EngineStatusPanel } from "../Panels/EngineStatusPanel";
import { DataStreamsPanel } from "../Panels/DataStreamsPanel";
import { LiveDataFeedPanel } from "../Panels/LiveDataFeedPanel";
import { ConstantsPanel } from "../Panels/ConstantsPanel";
import { SynchronizationBox } from "../BottomBar/SynchronizationBox";
import { AIChatDockReserved } from "../RightBar/AIChatDockReserved";

type RightCategory =
  | "activity"
  | "status"
  | "streams"
  | "feed"
  | "constants"
  | "sync"
  | "ai";

interface RightCategoryDef {
  id: RightCategory;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: RightCategoryDef[] = [
  {
    id: "activity",
    label: "ENGINE ACTIVITY",
    icon: <Activity className="h-3.5 w-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]" />,
  },
  {
    id: "status",
    label: "ENGINE STATUS",
    icon: <Cpu className="h-3.5 w-3.5 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]" />,
  },
  {
    id: "streams",
    label: "DATA STREAMS",
    icon: <Radio className="h-3.5 w-3.5 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)]" />,
  },
  {
    id: "feed",
    label: "LIVE DATA FEED",
    icon: <Rss className="h-3.5 w-3.5 text-cyan-300 drop-shadow-[0_0_4px_rgba(103,232,249,0.4)]" />,
  },
  {
    id: "constants",
    label: "MATH CONSTANTS",
    icon: <Calculator className="h-3.5 w-3.5 text-indigo-400 drop-shadow-[0_0_4px_rgba(129,140,248,0.4)]" />,
  },
  {
    id: "sync",
    label: "SYNCHRONIZATION",
    icon: <RefreshCw className="h-3.5 w-3.5 text-emerald-300 drop-shadow-[0_0_4px_rgba(110,231,183,0.4)]" />,
  },
  {
    id: "ai",
    label: "AI COPILOT",
    icon: <Bot className="h-3.5 w-3.5 text-purple-400 drop-shadow-[0_0_4px_rgba(192,132,252,0.4)]" />,
  },
];

interface CompactRightToolbarProps {
  onOpenActivityLog?: () => void;
  onSelectConstant?: (c: MathConstant) => void;
  onOpenMathVisualizer?: () => void;
}

export const CompactRightToolbar: React.FC<CompactRightToolbarProps> = ({
  onOpenActivityLog = () => {},
  onSelectConstant = () => {},
  onOpenMathVisualizer = () => {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [expandedCategory, setExpandedCategory] =
    useState<RightCategory | null>(null);

  const isExpanded = isHovered || isPinned;

  const toggleCategory = (id: RightCategory) => {
    soundManager.playClick();
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto z-30 flex h-[620px] max-h-[calc(100vh-105px)] select-none flex-col rounded-l-md border border-cyan-500/40 bg-slate-950/85 font-mono shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md transition-all duration-300 ease-in-out outline-none ${
        isExpanded ? "w-[280px]" : "w-[64px]"
      }`}
    >
      <div className="flex min-h-[44px] items-center justify-between border-b border-cyan-500/20 p-1.5 bg-slate-950/40">
        {isExpanded ? (
          <div className="flex w-full items-center justify-between px-1.5">
            <span className="truncate text-[11px] font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]">
              ANALYTICS DOCK
            </span>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsPinned((prev) => !prev);
              }}
              className={`rounded p-1 transition-all border-none outline-none bg-transparent hover:bg-cyan-950/40 ${
                isPinned ? "text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" : "text-slate-500 hover:text-cyan-300"
              }`}
              title={isPinned ? "Unpin Right Toolbar" : "Pin Right Toolbar Open"}
            >
              <Pin className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <Zap className="h-4 w-4 animate-pulse text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          </div>
        )}
      </div>

      <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-1.5">
        {CATEGORIES.map((cat) => {
          const isCatExpanded = expandedCategory === cat.id;

          return (
            <div
              key={cat.id}
              className={`overflow-hidden rounded border transition-all duration-200 ${
                isCatExpanded
                  ? "border-cyan-500/50 bg-slate-900/60 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                  : "border-cyan-500/10 bg-slate-950/30 hover:bg-slate-900/30 hover:border-cyan-500/25"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                title={cat.label}
                className={`flex w-full items-center justify-between text-left transition-colors border-none outline-none bg-transparent ${
                  isExpanded ? "min-h-[38px] px-2 py-1" : "h-[38px] px-0"
                }`}
              >
                <div className={`flex items-center ${isExpanded ? "space-x-2" : "w-full justify-center"}`}>
                  <div className="flex-shrink-0">{cat.icon}</div>
                  {isExpanded && (
                    <span className={`truncate text-[9px] font-bold tracking-wider transition-colors ${isCatExpanded ? "text-cyan-300" : "text-slate-300"}`}>
                      {cat.label}
                    </span>
                  )}
                </div>

                {isExpanded && (
                  <div className="flex-shrink-0">
                    {isCatExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                    )}
                  </div>
                )}
              </button>

              {isExpanded && isCatExpanded && (
                <div className="custom-scrollbar max-h-[245px] overflow-y-auto border-t border-cyan-500/15 bg-slate-950/90 p-1.5 text-[9px]">
                  {cat.id === "activity" && <EngineActivityPanel />}
                  {cat.id === "status" && <EngineStatusPanel />}
                  {cat.id === "streams" && <DataStreamsPanel />}
                  {cat.id === "feed" && (
                    <LiveDataFeedPanel onOpenActivityLog={onOpenActivityLog} />
                  )}
                  {cat.id === "constants" && (
                    <ConstantsPanel
                      onSelectConstant={onSelectConstant}
                      onOpenMoreConstants={onOpenMathVisualizer}
                    />
                  )}
                  {cat.id === "sync" && <SynchronizationBox />}
                  {cat.id === "ai" && <AIChatDockReserved />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-cyan-500/20 p-1.5 text-center bg-slate-950/40">
        {isExpanded ? (
          <div className="flex items-center justify-center space-x-1 text-[8px] font-bold text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>GEODESIC SYNC 100%</span>
          </div>
        ) : (
          <div className="mx-auto h-2 w-2 animate-pulse rounded-full bg-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
        )}
      </div>
    </div>
  );
};
