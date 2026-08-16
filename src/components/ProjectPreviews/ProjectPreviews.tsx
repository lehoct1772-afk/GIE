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

const projects: Project[] = [
  { number: "01", title: "ARCHITECTURAL BLUEPRINT", image: "/images/architectural-blueprint.jpg", target: "BLUEPRINT_LIBRARY" },
  { number: "02", title: "CITY / INFRASTRUCTURE BLUEPRINT", image: "/images/city-infrastructure.jpg", target: "PROJECTS" },
  { number: "03", title: "CROP-CIRCLE SITE ANALYSIS", image: "/images/crop-circle-analysis.jpg", target: "RESEARCH" },
  { number: "04", title: "GEOMETRIC RECONSTRUCTION", image: "/images/geometric-reconstruction.jpg", target: "ENGINE" },
  { number: "05", title: "TERRAIN / EARTH MAPPING", image: "/images/terrain-mapping.jpg", target: "RESEARCH" },
  { number: "06", title: "ENGINEERING / STRUCTURAL ANALYSIS", image: "/images/structural-analysis.jpg", target: "PROJECTS" },
];

function PreviewCard({ project, onActivate }: { project: Project; onActivate: () => void }) {
  return (
    <button
      type="button"
      onClick={() => { soundManager.playClick(); onActivate(); }}
      onMouseEnter={() => soundManager.playHover()}
      className="group relative h-[112px] w-[248px] overflow-hidden rounded-md border border-cyan-400/60 bg-[#001018]/90 text-left shadow-[0_0_14px_rgba(0,245,255,.16)] transition-all duration-200 hover:scale-[1.02] hover:border-cyan-200 hover:shadow-[0_0_22px_rgba(0,245,255,.30)]"
    >
      <img src={project.image} alt={project.title} draggable={false} className="absolute inset-0 h-full w-full object-cover opacity-82 transition duration-200 group-hover:scale-[1.02] group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#001018] via-transparent to-black/20" />
      <div className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/90 bg-[#001018]/90 font-mono text-[10px] font-bold text-cyan-200 shadow-[0_0_9px_rgba(0,245,255,.40)]">{project.number}</div>
      <ExternalLink className="absolute right-2.5 top-2.5 h-4 w-4 text-cyan-200/90" />
      <div className="absolute bottom-0 left-0 right-0 border-t border-cyan-400/30 bg-[#001018]/90 px-3 py-2 font-mono text-[10px] font-bold tracking-[0.045em] text-cyan-100">{project.title}</div>
      <div className="absolute bottom-2 right-2.5 h-[2px] w-7 bg-cyan-300 shadow-[0_0_8px_#00f5ff]" />
    </button>
  );
}

export const ProjectPreviews = ({ onNavigate, onOpenCropCircleBlueprint }: { onNavigate: (tab: NavTab) => void; onOpenCropCircleBlueprint?: () => void }) => {
  const left = projects.slice(0, 3);
  const right = projects.slice(3);
  const renderCard = (project: Project) => (
    <PreviewCard
      key={project.number}
      project={project}
      onActivate={project.number === "03" && onOpenCropCircleBlueprint ? onOpenCropCircleBlueprint : () => onNavigate(project.target)}
    />
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="pointer-events-auto absolute left-[6.2%] top-[118px] flex flex-col gap-3">{left.map(renderCard)}</div>
      <div className="pointer-events-auto absolute right-[6.2%] top-[118px] flex flex-col gap-3">{right.map(renderCard)}</div>
    </div>
  );
};
