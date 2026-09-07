import React, { useState, useEffect, useRef } from "react";
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
  Database,
  Globe,
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
    icon: <Activity className="h-3.5 w-3.5 text-cyan-400" />,
  },
  {
    id: "status",
    label: "ENGINE STATUS",
    icon: <Cpu className="h-3.5 w-3.5 text-emerald-400" />,
  },
  {
    id: "streams",
    label: "DATA STREAMS",
    icon: <Radio className="h-3.5 w-3.5 text-amber-400" />,
  },
  {
    id: "feed",
    label: "LIVE DATA FEED",
    icon: <Rss className="h-3.5 w-3.5 text-cyan-300" />,
  },
  {
    id: "constants",
    label: "MATH CONSTANTS",
    icon: <Calculator className="h-3.5 w-3.5 text-indigo-400" />,
  },
  {
    id: "sync",
    label: "SYNCHRONIZATION",
    icon: <RefreshCw className="h-3.5 w-3.5 text-emerald-300" />,
  },
  {
    id: "ai",
    label: "AI COPILOT",
    icon: <Bot className="h-3.5 w-3.5 text-purple-400" />,
  },
];

interface CompactRightToolbarProps {
  onOpenActivityLog?: () => void;
  onSelectConstant?: (c: MathConstant) => void;
  onOpenMathVisualizer?: () => void;
  hasUploadedData?: boolean;
  nodeCount?: number;
  relationshipCount?: number;
}

export const CompactRightToolbar: React.FC<CompactRightToolbarProps> = ({
  onOpenActivityLog = () => {},
  onSelectConstant = () => {},
  onOpenMathVisualizer = () => {},
  hasUploadedData = false,
  nodeCount = 0,
  relationshipCount = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [expandedCategory, setExpandedCategory] =
    useState<RightCategory | null>(null);

  // Touch support: only toggled from header area
  const [isTouchExpanded, setIsTouchExpanded] = useState(false);

  // Calculate responsive height based on viewport
  const [toolbarHeight, setToolbarHeight] = useState(620);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight;
      const calculatedHeight = Math.min(Math.max(vh * 0.7, 360), 720);
      setToolbarHeight(calculatedHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const isExpanded = isHovered || isPinned || isTouchExpanded;

  const toggleCategory = (id: RightCategory) => {
    soundManager.playClick();
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  // Touch toggle — single event handler using onClick
  const handleTouchToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only toggle on touch devices
    if ('ontouchstart' in window) {
      setIsTouchExpanded((prev) => !prev);
    }
  };

  // Expanded width: clamp(220px, 18vw, 280px)
  // Collapsed width: clamp(48px, 4vw, 64px)
  const expandedWidth = Math.min(Math.max(window.innerWidth * 0.18, 220), 280);
  const collapsedWidth = Math.min(Math.max(window.innerWidth * 0.04, 48), 64);
  const currentWidth = isExpanded ? expandedWidth : collapsedWidth;

  // Panel max height: responsive to available space
  const panelMaxHeight = Math.max(toolbarHeight - 110, 180);

  return (
    <div
      ref={toolbarRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto z-30 select-none flex-col rounded-l-md border border-cyan-500/30 bg-slate-950/90 font-mono shadow-[0_0_16px_rgba(0,240,255,0.13)] backdrop-blur-md transition-all duration-300 ease-in-out ${
        isExpanded ? "flex" : "flex"
      }`}
      style={{
        height: `${toolbarHeight}px`,
        width: `${currentWidth}px`,
        maxHeight: `calc(100vh - 20px)`,
      }}
    >
      {/* HEADER — Single onClick handler for touch toggle */}
      <div
        className="flex min-h-[44px] cursor-pointer items-center justify-between border-b border-cyan-500/20 p-1.5 flex-shrink-0 touch:active:bg-cyan-950/30"
        onClick={handleTouchToggle}
      >
        {isExpanded ? (
          <div className="flex w-full items-center justify-between px-1.5">
            <span className="truncate text-[11px] font-bold tracking-wider text-cyan-300">
              ANALYTICS DOCK
            </span>

            <div className="flex items-center gap-1">
              {/* Data Status Indicator */}
              {hasUploadedData && (
                <div className="mr-1 flex items-center gap-1 rounded border border-emerald-500/40 bg-emerald-950/40 px-1.5 py-0.5">
                  <Database className="h-3 w-3 text-emerald-400" />
                  <span className="text-[8px] font-bold text-emerald-300">
                    {nodeCount > 0 ? `${nodeCount}N` : "DATA"}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  setIsPinned((prev) => !prev);
                }}
                className={`rounded p-1 transition-colors hover:bg-cyan-950/60 ${
                  isPinned ? "text-amber-400" : "text-slate-400"
                }`}
                title={
                  isPinned
                    ? "Unpin Right Toolbar"
                    : "Pin Right Toolbar Open"
                }
              >
                <Pin className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            {hasUploadedData ? (
              <div className="relative">
                <Database className="h-4 w-4 text-emerald-400" />
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
            ) : (
              <Zap className="h-4 w-4 animate-pulse text-emerald-400" />
            )}
          </div>
        )}
      </div>

      {/* SCROLLABLE CONTENT — No click handler here */}
      <div
        className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-1.5"
        style={{
          maxHeight: `${panelMaxHeight}px`,
          minHeight: `${Math.min(panelMaxHeight, 200)}px`,
        }}
      >
        {CATEGORIES.map((cat) => {
          const isCatExpanded = expandedCategory === cat.id;

          return (
            <div
              key={cat.id}
              className={`overflow-hidden rounded border transition-all duration-200 ${
                isCatExpanded
                  ? "border-cyan-500/40 bg-slate-900/80 shadow-[0_0_8px_rgba(0,240,255,0.1)]"
                  : "border-cyan-500/15 bg-slate-900/40 hover:bg-slate-900/60"
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(cat.id);
                }}
                title={cat.label}
                className={`flex w-full items-center justify-between text-left transition-colors ${
                  isExpanded
                    ? "min-h-[38px] px-2 py-1"
                    : "h-[38px] px-0"
                }`}
              >
                <div
                  className={`flex items-center ${
                    isExpanded
                      ? "space-x-2"
                      : "w-full justify-center"
                  }`}
                >
                  <div className="flex-shrink-0">{cat.icon}</div>

                  {isExpanded && (
                    <span className="truncate text-[9px] font-bold tracking-wider text-slate-200">
                      {cat.label}
                    </span>
                  )}
                </div>

                {isExpanded && (
                  <div className="flex-shrink-0">
                    {isCatExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                    )}
                  </div>
                )}
              </button>

              {isExpanded && isCatExpanded && (
                <div className="custom-scrollbar overflow-y-auto border-t border-cyan-500/15 bg-slate-950/80 p-1.5 text-[9px]">
                  {cat.id === "activity" && <EngineActivityPanel />}

                  {cat.id === "status" && (
                    <div className="space-y-2">
                      <EngineStatusPanel />
                      {hasUploadedData && (
                        <div className="rounded border border-emerald-500/30 bg-emerald-950/20 p-2 text-[9px] text-emerald-300">
                          <div className="flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5 text-emerald-400" />
                            <span>
                              {nodeCount} nodes • {relationshipCount} connections
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {cat.id === "streams" && <DataStreamsPanel />}

                  {cat.id === "feed" && (
                    <LiveDataFeedPanel
                      onOpenActivityLog={onOpenActivityLog}
                    />
                  )}

                  {cat.id === "constants" && (
                    <ConstantsPanel
                      onSelectConstant={onSelectConstant}
                      onOpenMoreConstants={onOpenMathVisualizer}
                    />
                  )}

                  {cat.id === "sync" && <SynchronizationBox />}

                  {cat.id === "ai" && (
                    <div className="space-y-2">
                      <AIChatDockReserved />
                      {hasUploadedData && (
                        <div className="rounded border border-purple-500/30 bg-purple-950/20 p-2 text-[9px] text-purple-300">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
                            <span>AI analyzing {nodeCount} nodes</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-cyan-500/20 p-1.5 text-center flex-shrink-0">
        {isExpanded ? (
          <div className="flex items-center justify-center space-x-1 text-[8px] font-bold text-emerald-400">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>GEODESIC SYNC 100%</span>
            {hasUploadedData && (
              <span className="ml-1 rounded border border-emerald-500/30 bg-emerald-950/30 px-1.5 py-0.5 text-[7px] text-emerald-300">
                DATA
              </span>
            )}
          </div>
        ) : (
          <div className="mx-auto h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        )}
      </div>
    </div>
  );
};