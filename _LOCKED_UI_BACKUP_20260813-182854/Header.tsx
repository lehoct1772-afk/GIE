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
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col items-center px-8 pb-3 pt-4">

        {/* GIE TITLE */}
        <button
          type="button"
          onClick={() => onTabChange("HOME")}
          className="flex flex-col items-center bg-transparent"
        >
          <div className="text-center text-[42px] font-black leading-none tracking-[0.30em] text-cyan-300 drop-shadow-[0_0_12px_rgba(0,245,255,.55)]">
            GIE
          </div>

          <div className="mt-2 text-center text-[15px] font-semibold uppercase tracking-[0.25em] text-cyan-300/85">
            GEOMETRIC INTELLIGENCE ENGINE
          </div>
        </button>

        {/* TAGLINE */}
        <div className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.38em] text-cyan-300/60">
          WRITTEN THROUGH MATHEMATICS
        </div>

        {/* NAVIGATION */}
        <div className="mt-3 flex w-full items-center justify-center">
          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
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
                  className={`bg-transparent px-1 py-1 font-mono text-[11px] font-bold tracking-[0.15em] transition-all duration-200 ${
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
        <div className="absolute right-8 top-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleAudio}
            aria-label={audioEnabled ? "Mute audio" : "Enable audio"}
            className="bg-transparent p-2 text-cyan-300/70 transition hover:text-cyan-200"
          >
            {audioEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playChime();
              onLaunchEngine();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="flex items-center gap-2 bg-transparent px-3 py-2 font-mono text-[11px] font-bold tracking-[0.17em] text-cyan-200 transition hover:text-white"
          >
            <Cpu className="h-5 w-5 text-cyan-300" />
            LAUNCH ENGINE
          </button>
        </div>
      </div>
    </header>
  );
};