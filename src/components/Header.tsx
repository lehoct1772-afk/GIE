import React from "react";
import { NavTab } from "../types";
import { soundManager } from "../utils/audio";
import { Volume2, VolumeX, Cpu } from "lucide-react";

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onLaunchEngine: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string }[] = [
  { id: "HOME", label: "HOME" },
  { id: "ENGINE", label: "ENGINE" },
  { id: "PROJECTS", label: "PROJECTS" },
  { id: "BLUEPRINT_LIBRARY", label: "BLUEPRINT LIBRARY" },
  { id: "RESEARCH", label: "RESEARCH" },
  { id: "DOCUMENTATION", label: "DOCUMENTATION" },
  { id: "PUBLIC_ACTIVITY", label: "PUBLIC ACTIVITY" },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onLaunchEngine,
  audioEnabled,
  onToggleAudio,
}) => {
  return (
    <header className="relative z-40 w-full bg-transparent">
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col items-center px-6 pb-1 pt-2">
        
        {/* GIE TITLE */}
        <button
          type="button"
          onClick={() => onTabChange("HOME")}
          className="flex flex-col items-center bg-transparent group border-none outline-none"
        >
          <div className="text-center text-[31px] font-black leading-none tracking-[0.30em] text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.65)] font-sans transition-all duration-300 group-hover:text-white">
            GIE
          </div>
          <div className="mt-1 text-center text-[11px] font-bold uppercase tracking-[0.23em] text-cyan-300/90 font-sans border-b border-cyan-500/20 pb-0.5 px-2">
            GEOMETRIC INTELLIGENCE ENGINE
          </div>
        </button>

        {/* TAGLINE */}
        <div className="mt-1 text-center text-[8px] font-bold uppercase tracking-[0.34em] text-cyan-400/60 font-mono">
          WRITTEN THROUGH MATHEMATICS
        </div>

        {/* NAVIGATION */}
        <div className="mt-1.5 flex w-full items-center justify-center">
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onTabChange(item.id);
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  className={`bg-transparent px-1 py-0.5 font-mono text-[9px] font-bold tracking-[0.14em] transition-all duration-200 border-b-2 uppercase outline-none ${
                    active
                      ? "text-white border-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                      : "text-cyan-100/40 border-transparent hover:text-cyan-300 hover:border-cyan-500/30"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* RIGHT-SIDE CONTROLS */}
        <div className="absolute right-6 top-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleAudio}
            aria-label={audioEnabled ? "Mute audio" : "Enable audio"}
            className="bg-transparent p-1.5 text-cyan-400/60 transition-colors duration-200 hover:text-cyan-300 hover:drop-shadow-[0_0_4px_rgba(6,182,212,0.5)] outline-none border-none"
          >
            {audioEnabled ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              soundManager.playChime();
              onLaunchEngine();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="flex items-center gap-1.5 bg-cyan-950/20 border border-cyan-500/40 rounded-sm px-2 py-1.5 font-mono text-[9px] font-bold tracking-[0.15em] text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.1)] transition-all duration-200 hover:bg-cyan-500/10 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] outline-none"
          >
            <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" /> LAUNCH ENGINE
          </button>
        </div>
        
      </div>
    </header>
  );
};
