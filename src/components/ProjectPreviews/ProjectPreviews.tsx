import React from "react";
import { ExternalLink } from "lucide-react";
import { soundManager } from "../../utils/audio";

interface ProjectPreview {
  id: string;
  number: string;
  title: string;
  image: string;
}

const LEFT_PROJECTS: ProjectPreview[] = [
  {
    id: "architectural",
    number: "01",
    title: "ARCHITECTURAL BLUEPRINT",
    image: "/images/architectural-blueprint.jpg",
  },
  {
    id: "city",
    number: "02",
    title: "CITY / INFRASTRUCTURE BLUEPRINT",
    image: "/images/city-infrastructure.jpg",
  },
  {
    id: "crop-circle",
    number: "03",
    title: "CROP-CIRCLE SITE ANALYSIS",
    image: "/images/crop-circle-analysis.jpg",
  },
];

const RIGHT_PROJECTS: ProjectPreview[] = [
  {
    id: "geometric",
    number: "04",
    title: "GEOMETRIC RECONSTRUCTION",
    image: "/images/geometric-reconstruction.jpg",
  },
  {
    id: "terrain",
    number: "05",
    title: "TERRAIN / EARTH MAPPING",
    image: "/images/terrain-mapping.jpg",
  },
  {
    id: "engineering",
    number: "06",
    title: "ENGINEERING / STRUCTURAL ANALYSIS",
    image: "/images/structural-analysis.jpg",
  },
];

const PreviewCard: React.FC<{ project: ProjectPreview }> = ({
  project,
}) => {
  const openProject = () => {
    soundManager.playClick();

    // Read-only GIE project viewer connects here later.
    console.log(`Open GIE project: ${project.id}`);
  };

  return (
    <button
      type="button"
      onClick={openProject}
      onMouseEnter={() => soundManager.playHover()}
      className="
        group
        pointer-events-auto
        relative
        h-[150px]
        w-[300px]
        overflow-hidden
        rounded-md
        border
        border-cyan-400/60
        bg-slate-950/55
        text-left
        shadow-[0_0_16px_rgba(0,245,255,0.12)]
        backdrop-blur-sm
        transition-all
        duration-300
        hover:border-cyan-300
        hover:shadow-[0_0_25px_rgba(0,245,255,0.32)]
      "
    >
      {/* IMAGE */}
      <img
        src={project.image}
        alt={project.title}
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          opacity-80
          transition
          duration-500
          group-hover:scale-[1.03]
          group-hover:opacity-100
        "
      />

      {/* DARK READABILITY GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />

      {/* PROJECT NUMBER */}
      <div
        className="
          absolute
          left-3
          top-3
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          border
          border-cyan-300
          bg-slate-950/75
          font-mono
          text-[11px]
          font-bold
          text-cyan-300
          shadow-[0_0_10px_rgba(0,245,255,.35)]
        "
      >
        {project.number}
      </div>

      {/* OPEN ICON */}
      <ExternalLink
        className="
          absolute
          right-3
          top-3
          h-4
          w-4
          text-cyan-300
          opacity-70
          transition
          group-hover:opacity-100
        "
      />

      {/* TITLE */}
      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          border-t
          border-cyan-400/20
          bg-slate-950/85
          px-3
          py-2
          font-mono
          text-[11px]
          font-bold
          tracking-[0.08em]
          text-cyan-100
        "
      >
        {project.title}
      </div>

      {/* HUD CORNER DETAIL */}
      <div className="absolute bottom-2 right-3 h-[2px] w-8 bg-cyan-400 shadow-[0_0_8px_#00f5ff]" />
    </button>
  );
};

export const ProjectPreviews: React.FC = () => {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-10
        hidden
        items-center
        justify-between
        px-[6.5rem]
        xl:flex
      "
    >
      {/* LEFT THREE */}
      <div className="flex flex-col gap-3">
        {LEFT_PROJECTS.map((project) => (
          <PreviewCard
            key={project.id}
            project={project}
          />
        ))}
      </div>

      {/* CENTER SPACE RESERVED FOR LIVE GLOBE */}
      <div className="w-[520px] shrink-0" />

      {/* RIGHT THREE */}
      <div className="flex flex-col gap-3">
        {RIGHT_PROJECTS.map((project) => (
          <PreviewCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </div>
  );
};