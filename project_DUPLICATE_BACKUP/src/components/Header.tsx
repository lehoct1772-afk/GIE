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
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-2 pt-3">

        {/* GIE TITLE */}
        <button
          type="button"
          onClick={() => onTabChange("HOME")}
          className="flex flex-col items-center bg-transparent"
        >
          <div className="text-center text-3xl font-black tracking-[0.32em] text-cyan-300 drop-shadow-[0_0_10px_rgba(0,245,255,.45)]">
            GIE
          </div>

          <div className="mt-0.5 text-center text-[12px] uppercase tracking-[0.28em] text-cyan-400/80">
            GEOMETRIC INTELLIGENCE ENGINE
          </div>
        </button>

        {/* TAGLINE */}
        <div className="mt-1 text-center text-[9px] uppercase tracking-[0.4em] text-cyan-300/55">
          WRITTEN THROUGH MATHEMATICS
        </div>

        {/* NAVIGATION */}
        <div className="mt-2 flex w-full items-center justify-center">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
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
                  className={`bg-transparent font-mono text-[10px] tracking-[0.18em] transition-all duration-200 ${
                    active
                      ? "text-cyan-200 drop-shadow-[0_0_7px_rgba(0,245,255,.8)]"
                      : "text-cyan-100/50 hover:text-cyan-200"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* RIGHT-SIDE CONTROLS */}
        <div className="absolute right-6 top-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleAudio}
            aria-label={audioEnabled ? "Mute audio" : "Enable audio"}
            className="bg-transparent p-2 text-cyan-300/70 transition hover:text-cyan-200"
          >
            {audioEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playChime();
              onLaunchEngine();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="flex items-center gap-2 bg-transparent px-2 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-cyan-200 transition hover:text-white"
          >
            <Cpu className="h-4 w-4 text-cyan-300" />
            LAUNCH ENGINE
          </button>
        </div>
      </div>
    </header>
  );
};