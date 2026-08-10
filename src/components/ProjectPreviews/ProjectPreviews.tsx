import React from "react";

const leftProjects = [
  { title: "ARCHITECTURAL BLUEPRINT", image: "/images/architectural-blueprint.jpg" },
  { title: "CITY / INFRASTRUCTURE", image: "/images/city-infrastructure.jpg" },
  { title: "CROP-CIRCLE SITE ANALYSIS", image: "/images/crop-circle-analysis.jpg" },
];

const rightProjects = [
  { title: "GEOMETRIC RECONSTRUCTION", image: "/images/geometric-reconstruction.jpg" },
  { title: "TERRAIN / EARTH MAPPING", image: "/images/terrain-mapping.jpg" },
  { title: "ENGINEERING / STRUCTURAL", image: "/images/structural-analysis.jpg" },
];

const PreviewCard = ({
  title,
  image,
}: {
  title: string;
  image: string;
}) => (
  <div className="w-full overflow-hidden rounded-md border border-cyan-400/55 bg-[#001018]/90">
    <div className="h-[92px] w-full overflow-hidden">
      <img
        src={image}
        alt={title}
        draggable={false}
        className="h-full w-full object-cover"
      />
    </div>

    <div className="border-t border-cyan-400/30 px-2 py-[5px] text-center font-mono text-[9px] tracking-[0.11em] text-cyan-100">
      {title}
    </div>
  </div>
);

export const ProjectPreviews = () => {
  return (
    <>
      <div className="pointer-events-auto absolute left-[11%] top-[155px] z-20 flex w-[250px] flex-col gap-[10px]">
        {leftProjects.map((project) => (
          <PreviewCard
            key={project.title}
            title={project.title}
            image={project.image}
          />
        ))}
      </div>

      <div className="pointer-events-auto absolute right-[7%] top-[155px] z-20 flex w-[250px] flex-col gap-[10px]">
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
