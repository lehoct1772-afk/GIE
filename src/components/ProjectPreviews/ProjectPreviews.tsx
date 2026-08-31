import React from "react";
import { ExternalLink } from "lucide-react";
import { NavTab } from "../../types";
import { soundManager } from "../../utils/audio";

type Project = {
  number: string;
  title: string;
  image: string;
  target: NavTab;
};

const leftProjects: Project[] = [
  {
    number: "01",
    title: "ARCHITECTURAL BLUEPRINT",
    image: "/images/architectural-blueprint.svg",
    target: "BLUEPRINT_LIBRARY",
  },
  {
    number: "02",
    title: "CITY / INFRASTRUCTURE BLUEPRINT",
    image: "/images/city-infrastructure.svg",
    target: "PROJECTS",
  },
  {
    number: "03",
    title: "CROP-CIRCLE SITE ANALYSIS",
    image: "/images/crop-circle-analysis.svg",
    target: "RESEARCH",
  },
];

const rightProjects: Project[] = [
  {
    number: "04",
    title: "GEOMETRIC RECONSTRUCTION",
    image: "/images/geometric-reconstruction.svg",
    target: "ENGINE",
  },
  {
    number: "05",
    title: "TERRAIN / EARTH MAPPING",
    image: "/images/terrain-mapping.svg",
    target: "RESEARCH",
  },
  {
    number: "06",
    title: "ENGINEERING / STRUCTURAL ANALYSIS",
    image: "/images/structural-analysis.svg",
    target: "PROJECTS",
  },
];

function PreviewCard({
  project,
  onActivate,
}: {
  project: Project;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        soundManager.playClick();
        onActivate();
      }}
      onMouseEnter={() => soundManager.playHover()}
      className="group relative h-[112px] w-full overflow-hidden rounded-[5px] border border-cyan-500/40 bg-[#020914]/85 text-left shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md transition-all duration-300 hover:border-cyan-300 hover:bg-[#031122]/95 hover:shadow-[0_0_22px_rgba(34,211,238,0.35)] outline-none"
    >
      {/* BLUEPRINT PREVIEW FRAME */}
      <div className="absolute bottom-2 left-2 top-2 w-[94px] overflow-hidden rounded-[3px] border border-cyan-500/25 bg-[#010a15] shadow-[inset_0_0_8px_rgba(6,182,212,0.2)]">
        <img
          src={project.image}
          alt=""
          draggable={false}
          className="h-full w-full object-cover opacity-75 mix-blend-screen transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
        />
      </div>

      {/* MATRIX PROJECT NUMBER */}
      <div className="absolute left-[82px] top-[8px] flex h-[30px] w-[30px] items-center justify-center rounded-full border border-cyan-400/80 bg-[#000a12] font-mono text-[10px] font-bold text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.45)] transition-colors duration-200 group-hover:text-white group-hover:border-cyan-300">
        {project.number}
      </div>

      {/* CORE TITLE */}
      <div className="absolute bottom-3 left-[116px] right-9 top-3 flex items-center font-mono text-[12px] font-bold leading-[1.35] tracking-[0.035em] text-slate-100 transition-colors duration-200 group-hover:text-cyan-200">
        {project.title}
      </div>

      {/* GLOWING ACTION LINK ICON */}
      <ExternalLink className="absolute right-3 top-3 h-4 w-4 text-cyan-400/60 transition-all duration-200 group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_4px_rgba(6,182,212,0.6)]" />

      {/* GEOMETRIC ALIGNMENT ACCENT LINE */}
      <div className="absolute bottom-2 right-3 h-[2px] w-8 bg-cyan-400 shadow-[0_0_8px_#06b6d4] transition-all duration-300 group-hover:w-12 group-hover:bg-cyan-300 group-hover:shadow-[0_0_12px_#22d3ee]" />
    </button>
  );
}

export const ProjectPreviews = ({
  onNavigate,
  onOpenCropBlueprint,
}: {
  onNavigate: (tab: NavTab) => void;
  onOpenCropBlueprint?: () => void;
}) => {
  return (
    <>
      {/* LEFT THREE CARDS COLUMN */}
      <div className="pointer-events-auto absolute left-[5.2%] top-[55px] z-20 flex w-[320px] flex-col gap-[14px]">
        {leftProjects.map((p) => (
          <PreviewCard
            key={p.number}
            project={p}
            onActivate={
              p.number === "03" && onOpenCropBlueprint
                ? onOpenCropBlueprint
                : () => onNavigate(p.target)
            }
          />
        ))}
      </div>

      {/* RIGHT THREE CARDS COLUMN */}
      <div className="pointer-events-auto absolute right-[5.2%] top-[55px] z-20 flex w-[320px] flex-col gap-[14px]">
        {rightProjects.map((p) => (
          <PreviewCard
            key={p.number}
            project={p}
            onActivate={() => onNavigate(p.target)}
          />
        ))}
      </div>
    </>
  );
};
