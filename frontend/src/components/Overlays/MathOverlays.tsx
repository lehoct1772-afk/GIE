import React from "react";
import { soundManager } from "../../utils/audio";

interface MathOverlaysProps {
  onLaunchEngine: () => void;
}

interface PanelData {
  id: string;
  title: string;
}

const PANELS: PanelData[] = [
  {
    id: "euclidean",
    title: "EUCLIDEAN METRIC",
  },
  {
    id: "golden",
    title: "GOLDEN RATIO",
  },
  {
    id: "fibonacci",
    title: "FIBONACCI RECURRENCE",
  },
  {
    id: "spherical",
    title: "SPHERICAL GRID",
  },
  {
    id: "frequency",
    title: "HARMONIC FREQUENCY",
  },
  {
    id: "euler",
    title: "EULER IDENTITY",
  },
];

export const MathOverlays: React.FC<MathOverlaysProps> = () => {
  const openPanel = (id: string) => {
    soundManager.playClick();

    // Read-only document viewer will connect here next.
    console.log(`Open GIE document: ${id}`);
  };

  const renderCard = (panel: PanelData) => {
    return (
      <button
        key={panel.id}
        type="button"
        onClick={() => openPanel(panel.id)}
        className="pointer-events-auto flex h-[48px] w-[180px] cursor-pointer items-center justify-center rounded border border-cyan-500/30 bg-slate-950/75 px-3 backdrop-blur-md shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-cyan-400"
      >
        <span className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
          {panel.title}
        </span>
      </button>
    );
  };

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
      {/* LEFT THREE BOXES */}
      <div className="ml-14 flex flex-col justify-center space-y-2.5 md:ml-16">
        {PANELS.slice(0, 3).map(renderCard)}
      </div>

      {/* RIGHT THREE BOXES */}
      <div className="mr-14 flex flex-col justify-center space-y-2.5 md:mr-16">
        {PANELS.slice(3, 6).map(renderCard)}
      </div>
    </div>
  );
};