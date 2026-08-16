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
        h-[112px]
        w-full
        overflow-hidden
        rounded-[5px]
        border
        border-cyan-400/55
        bg-[#020914]/82
        text-left
        shadow-[0_0_14px_rgba(0,245,255,.12)]
        backdrop-blur-sm
        transition-all
        duration-200
        hover:border-cyan-200
        hover:bg-[#03101a]/92
        hover:shadow-[0_0_20px_rgba(0,245,255,.26)]
      "
    >
      {/* BLUEPRINT PREVIEW */}
      <div className="absolute bottom-2 left-2 top-2 w-[94px] overflow-hidden rounded-[3px] border border-cyan-400/25 bg-[#03101a]">
        <img
          src={project.image}
          alt=""
          draggable={false}
          className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        />
      </div>

      {/* PROJECT NUMBER */}
      <div className="absolute left-[82px] top-[8px] flex h-[30px] w-[30px] items-center justify-center rounded-full border border-cyan-300/80 bg-[#001018] font-mono text-[10px] font-bold text-cyan-200 shadow-[0_0_8px_rgba(0,245,255,.35)]">
        {project.number}
      </div>

      {/* TITLE */}
      <div className="absolute bottom-3 left-[116px] right-9 top-3 flex items-center font-mono text-[12px] font-bold leading-[1.35] tracking-[0.035em] text-slate-100">
        {project.title}
      </div>

      {/* OPEN ICON */}
      <ExternalLink className="absolute right-3 top-3 h-4 w-4 text-cyan-300/80 transition-colors group-hover:text-cyan-100" />

      {/* ACCENT */}
      <div className="absolute bottom-2 right-3 h-[2px] w-8 bg-cyan-300/80 shadow-[0_0_7px_#00f5ff]" />
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
      {/* LEFT THREE CARDS */}
      <div
        className="
          pointer-events-auto
          absolute
          left-[5.2%]
          top-[55px]
          z-20
          flex
          w-[320px]
          flex-col
          gap-[14px]
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

      {/* RIGHT THREE CARDS */}
      <div
        className="
          pointer-events-auto
          absolute
          right-[5.2%]
          top-[55px]
          z-20
          flex
          w-[320px]
          flex-col
          gap-[14px]
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
};</arg_value></tool_call>