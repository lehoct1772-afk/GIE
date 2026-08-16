import React from "react";
import { NavTab } from "../../types";

const leftProjects = [
  { title: "ARCHITECTURAL BLUEPRINT", image: "/images/architectural-blueprint.jpg", target: "BLUEPRINT_LIBRARY" as NavTab },
  { title: "CITY / INFRASTRUCTURE", image: "/images/city-infrastructure.jpg", target: "PROJECTS" as NavTab },
  { title: "CROP-CIRCLE SITE ANALYSIS", image: "/images/crop-circle-analysis.jpg", target: "RESEARCH" as NavTab },
];
const rightProjects = [
  { title: "GEOMETRIC RECONSTRUCTION", image: "/images/geometric-reconstruction.jpg", target: "ENGINE" as NavTab },
  { title: "TERRAIN / EARTH MAPPING", image: "/images/terrain-mapping.jpg", target: "RESEARCH" as NavTab },
  { title: "ENGINEERING / STRUCTURAL", image: "/images/structural-analysis.jpg", target: "PROJECTS" as NavTab },
];

const PreviewCard = ({ title, image, onClick }: { title: string; image: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="w-full overflow-hidden rounded-md border border-cyan-400/55 bg-[#001018]/90 text-left transition hover:border-cyan-200 hover:shadow-[0_0_16px_rgba(0,245,255,.25)]">
    <div className="h-[92px] w-full overflow-hidden"><img src={image} alt={title} draggable={false} className="h-full w-full object-cover" /></div>
    <div className="border-t border-cyan-400/30 px-2 py-[5px] text-center font-mono text-[9px] tracking-[0.11em] text-cyan-100">{title}</div>
  </button>
);

export const ProjectPreviews = ({ onNavigate }: { onNavigate: (tab: NavTab) => void }) => (
  <>
    <div className="pointer-events-auto absolute left-[10.5%] top-[116px] z-20 flex w-[238px] flex-col gap-[9px]">
      {leftProjects.map((p) => <PreviewCard key={p.title} title={p.title} image={p.image} onClick={() => onNavigate(p.target)} />)}
    </div>
    <div className="pointer-events-auto absolute right-[6.5%] top-[116px] z-20 flex w-[238px] flex-col gap-[9px]">
      {rightProjects.map((p) => <PreviewCard key={p.title} title={p.title} image={p.image} onClick={() => onNavigate(p.target)} />)}
    </div>
  </>
);
