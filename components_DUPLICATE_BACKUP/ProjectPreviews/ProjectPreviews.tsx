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
      className="
        group
        relative
        h-[150px]
        w-full
        overflow-hidden
        rounded-[6px]
        border
        border-cyan-400/70
        bg-[#020914]/90
        text-left
        shadow-[0_0_16px_rgba(0,245,255,.16)]
        backdrop-blur-sm
        transition
        hover:border-cyan-200
        hover:shadow-[0_0_22px_rgba(0,245,255,.3)]
      "
    >
      <div className="absolute left-3 top-3 h-11 w-11 overflow-hidden rounded border border-cyan-400/35 bg-cyan-950/25 opacity-75">
        <img
          src={project.image}
          alt=""
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute left-[14px] top-[14px] flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300 bg-[#001018]/90 font-mono text-[12px] font-bold text-cyan-200 shadow-[0_0_10px_rgba(0,245,255,.45)]">
        {project.number}
      </div>

      <div className="absolute left-[68px] right-10 top-[18px] font-mono text-[14px] font-bold leading-[1.35] tracking-[0.02em] text-slate-100">
        {project.title}
      </div>

      <ExternalLink className="absolute right-3 top-3 h-5 w-5 text-cyan-300" />

      <div className="absolute bottom-[42px] left-0 right-0 border-t border-cyan-400/25" />

      <div className="absolute bottom-0 left-0 right-0 flex h-[52px] items-center px-4 font-mono text-[13px] font-bold tracking-[0.04em] text-cyan-300">
        {project.title}
      </div>

      <div className="absolute bottom-3 right-3 h-[3px] w-10 bg-cyan-300 shadow-[0_0_8px_#00f5ff]" />
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
      <div
        className="
          pointer-events-auto
          absolute
          left-[6.2%]
          top-[120px]
          z-20
          flex
          w-[370px]
          flex-col
          gap-[18px]
        "
      >
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

      <div
        className="
          pointer-events-auto
          absolute
          right-[6.2%]
          top-[120px]
          z-20
          flex
          w-[370px]
          flex-col
          gap-[18px]
        "
      >
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