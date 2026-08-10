import React from "react";

const leftProjects = [
  {
    title: "ARCHITECTURAL BLUEPRINT",
    image: "/images/architectural-blueprint.svg",
  },
  {
    title: "CITY / INFRASTRUCTURE",
    image: "/images/city-infrastructure.svg",
  },
  {
    title: "CROP-CIRCLE SITE ANALYSIS",
    image: "/images/crop-circle-analysis.svg",
  },
];

const rightProjects = [
  {
    title: "GEOMETRIC RECONSTRUCTION",
    image: "/images/geometric-reconstruction.svg",
  },
  {
    title: "TERRAIN / EARTH MAPPING",
    image: "/images/terrain-mapping.svg",
  },
  {
    title: "ENGINEERING / STRUCTURAL",
    image: "/images/structural-analysis.svg",
  },
];

const PreviewCard: React.FC<{
  title: string;
  image: string;
}> = ({ title, image }) => (
  <div className="overflow-hidden rounded-md border border-cyan-400/60 bg-[#001018]/90 shadow-[0_0_16px_rgba(0,245,255,0.12)]">
    <div className="h-[92px] w-full overflow-hidden bg-black/40">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>

    <div className="border-t border-cyan-400/25 px-3 py-2 text-center font-mono text-[10px] tracking-[0.12em] text-cyan-100">
      {title}
    </div>
  </div>
);

export const ProjectPreviews: React.FC = () => {
  return (
    <>
      <div className="pointer-events-auto absolute left-[156px] top-[185px] z-20 flex w-[220px] flex-col gap-3">
        {leftProjects.map((project) => (
          <PreviewCard
            key={project.title}
            title={project.title}
            image={project.image}
          />
        ))}
      </div>

      <div className="pointer-events-auto absolute right-[72px] top-[185px] z-20 flex w-[220px] flex-col gap-3">
        {rightProjects.map((project) => (
          <PreviewCard
            key={project.title}
            title={project.title}
            image={project.image}
          />
        ))}
      </div>
    </>
  );
};
