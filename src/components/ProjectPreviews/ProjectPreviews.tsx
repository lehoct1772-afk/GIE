import React, { useState, useEffect } from "react";
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
  compact = false,
}: {
  project: Project;
  onActivate: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        soundManager.playClick();
        onActivate();
      }}
      onMouseEnter={() => soundManager.playHover()}
      className={`
        group
        relative
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
        ${
          compact
            ? "aspect-[4/1] min-h-[48px] max-h-[80px]"
            : "aspect-[3.2/1] min-h-[64px] max-h-[140px]"
        }
      `}
    >
      {/* BLUEPRINT PREVIEW */}
      <div className="absolute bottom-[8%] left-[6%] top-[8%] aspect-square overflow-hidden rounded-[3px] border border-cyan-400/25 bg-[#03101a]">
        <img
          src={project.image}
          alt=""
          draggable={false}
          className="h-full w-full object-contain opacity-80 transition-opacity group-hover:opacity-100"
        />
      </div>

      {/* PROJECT NUMBER */}
      <div className="absolute left-[22%] top-[12%] flex aspect-square h-[26%] min-h-[22px] max-h-[38px] items-center justify-center rounded-full border border-cyan-300/80 bg-[#001018] font-mono text-[clamp(10px,1.2vh,14px)] font-bold text-cyan-200 shadow-[0_0_8px_rgba(0,245,255,.35)]">
        {project.number}
      </div>

      {/* TITLE */}
      <div className="absolute bottom-[12%] left-[34%] right-[10%] top-[12%] flex items-center font-mono font-bold leading-[1.2] tracking-[0.035em] text-slate-100 text-[clamp(10px,1.3vh,16px)]">
        {project.title}
      </div>

      {/* OPEN ICON */}
      <ExternalLink className="absolute right-[4%] top-[12%] h-[clamp(12px,1.4vh,18px)] w-[clamp(12px,1.4vh,18px)] text-cyan-300/80 transition-colors group-hover:text-cyan-100" />

      {/* ACCENT */}
      <div className="absolute bottom-[10%] right-[4%] h-[2px] w-[clamp(16px,2vw,32px)] bg-cyan-300/80 shadow-[0_0_7px_#00f5ff]" />
    </button>
  );
}

export const ProjectPreviews = ({
  onNavigate,
  onOpenCropCircleBlueprint,
}: {
  onNavigate: (tab: NavTab) => void;
  onOpenCropCircleBlueprint?: () => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Mobile: 2-column grid BELOW the globe (normal layout flow)
  if (isMobile) {
    return (
      <div className="relative z-20 w-full px-4 py-3 pointer-events-none mt-auto">
        <div className="pointer-events-auto grid grid-cols-2 gap-3 max-w-[600px] mx-auto">
          {[...leftProjects, ...rightProjects].map((p) => (
            <PreviewCard
              key={p.number}
              project={p}
              compact={true}
              onActivate={
                p.number === "03" && onOpenCropCircleBlueprint
                  ? onOpenCropCircleBlueprint
                  : () => onNavigate(p.target)
              }
            />
          ))}
        </div>
      </div>
    );
  }

  // Tablet: reduced footprint side columns
  if (isTablet) {
    return (
      <>
        {/* LEFT THREE CARDS */}
        <div
          className="
            pointer-events-auto
            absolute
            left-[2%]
            top-[6%]
            z-20
            flex
            w-[clamp(110px,16vw,180px)]
            flex-col
            gap-[clamp(4px,0.8vh,10px)]
          "
        >
          {leftProjects.map((p) => (
            <PreviewCard
              key={p.number}
              project={p}
              compact={true}
              onActivate={
                p.number === "03" && onOpenCropCircleBlueprint
                  ? onOpenCropCircleBlueprint
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
            right-[2%]
            top-[6%]
            z-20
            flex
            w-[clamp(110px,16vw,180px)]
            flex-col
            gap-[clamp(4px,0.8vh,10px)]
          "
        >
          {rightProjects.map((p) => (
            <PreviewCard
              key={p.number}
              project={p}
              compact={true}
              onActivate={() => onNavigate(p.target)}
            />
          ))}
        </div>
      </>
    );
  }

  // Desktop/Laptop: original side-column layout
  return (
    <>
      {/* LEFT THREE CARDS */}
      <div
        className="
          pointer-events-auto
          absolute
          left-[2%]
          top-[8%]
          z-20
          flex
          w-[clamp(160px,18vw,340px)]
          flex-col
          gap-[clamp(8px,1.2vh,16px)]
          sm:left-[3%]
          md:left-[4%]
          lg:left-[5%]
          xl:left-[6%]
          2xl:left-[7%]
        "
      >
        {leftProjects.map((p) => (
          <PreviewCard
            key={p.number}
            project={p}
            compact={false}
            onActivate={
              p.number === "03" && onOpenCropCircleBlueprint
                ? onOpenCropCircleBlueprint
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
          right-[2%]
          top-[8%]
          z-20
          flex
          w-[clamp(160px,18vw,340px)]
          flex-col
          gap-[clamp(8px,1.2vh,16px)]
          sm:right-[3%]
          md:right-[4%]
          lg:right-[5%]
          xl:right-[6%]
          2xl:right-[7%]
        "
      >
        {rightProjects.map((p) => (
          <PreviewCard
            key={p.number}
            project={p}
            compact={false}
            onActivate={() => onNavigate(p.target)}
          />
        ))}
      </div>
    </>
  );
};