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
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col items-center px-4 sm:px-6 pb-1 pt-2">

        {/* GIE TITLE */}
        <button
          type="button"
          onClick={() => onTabChange("HOME")}
          className="flex flex-col items-center bg-transparent"
        >
          <div className="text-center text-[clamp(20px,4vw,31px)] font-black leading-none tracking-[0.30em] text-cyan-300 drop-shadow-[0_0_10px_rgba(0,245,255,.55)]">
            GIE
          </div>

          <div className="mt-1 text-center text-[clamp(7px,1.2vw,11px)] font-semibold uppercase tracking-[0.23em] text-cyan-300/85">
            GEOMETRIC INTELLIGENCE ENGINE
          </div>
        </button>

        {/* TAGLINE */}
        <div className="mt-1 text-center text-[clamp(6px,0.8vw,8px)] font-semibold uppercase tracking-[0.34em] text-cyan-300/60">
          WRITTEN THROUGH MATHEMATICS
        </div>

        {/* NAVIGATION */}
        <div className="mt-1.5 flex w-full items-center justify-center">
          <nav className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-1">
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
                  className={`bg-transparent px-1 py-0.5 font-mono text-[clamp(6px,0.9vw,9px)] font-bold tracking-[0.14em] transition-all duration-200 whitespace-nowrap ${
                    active
                      ? "text-cyan-200 drop-shadow-[0_0_7px_rgba(0,245,255,.8)]"
                      : "text-cyan-100/55 hover:text-cyan-200"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* RIGHT-SIDE CONTROLS */}
        <div className="absolute right-3 top-2 flex items-center gap-1 sm:right-4 sm:top-2.5 md:right-6 md:top-3">
          <button
            type="button"
            onClick={onToggleAudio}
            aria-label={audioEnabled ? "Mute audio" : "Enable audio"}
            className="bg-transparent p-1.5 text-cyan-300/70 transition hover:text-cyan-200"
          >
            {audioEnabled ? (
              <Volume2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            ) : (
              <VolumeX className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playChime();
              onLaunchEngine();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="flex items-center gap-1 bg-transparent px-1.5 py-1 font-mono text-[clamp(6px,0.8vw,9px)] font-bold tracking-[0.15em] text-cyan-200 transition hover:text-white sm:px-2 sm:py-1.5"
          >
            <Cpu className="h-3 w-3 text-cyan-300 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">LAUNCH ENGINE</span>
            <span className="sm:hidden">ENGINE</span>
          </button>
        </div>
      </div>
    </header>
  );
};