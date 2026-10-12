import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { soundManager } from "../../utils/audio";

interface ProjectPreview {
  id: string;
  number: string;
  title: string;
  image: string;
  description: string;
}

const LEFT_PROJECTS: ProjectPreview[] = [
  {
    id: "architectural",
    number: "01",
    title: "ARCHITECTURAL BLUEPRINT",
    image: "/images/architectural-blueprint.svg",
    description:
      "Explore architectural geometry, dimensions, relationships, and structural patterns.",
  },
  {
    id: "city",
    number: "02",
    title: "CITY / INFRASTRUCTURE BLUEPRINT",
    image: "/images/city-infrastructure.svg",
    description:
      "Explore infrastructure layouts, spatial relationships, networks, and geometric organization.",
  },
  {
    id: "crop-circle",
    number: "03",
    title: "CROP-CIRCLE SITE ANALYSIS",
    image: "/images/crop-circle-analysis.svg",
    description:
      "Explore geometric construction, measurements, symmetry, sequences, and mathematical relationships.",
  },
];

const RIGHT_PROJECTS: ProjectPreview[] = [
  {
    id: "geometric",
    number: "04",
    title: "GEOMETRIC RECONSTRUCTION",
    image: "/images/geometric-reconstruction.svg",
    description:
      "Reconstruct geometric forms and examine the mathematical relationships used to create them.",
  },
  {
    id: "terrain",
    number: "05",
    title: "TERRAIN / EARTH MAPPING",
    image: "/images/terrain-mapping.svg",
    description:
      "Explore terrain, geographic positioning, Earth geometry, mapping layers, and spatial relationships.",
  },
  {
    id: "engineering",
    number: "06",
    title: "ENGINEERING / STRUCTURAL ANALYSIS",
    image: "/images/structural-analysis.svg",
    description:
      "Explore structural geometry, measurements, components, and engineering relationships.",
  },
];

const PreviewCard: React.FC<{
  project: ProjectPreview;
  onOpen: (project: ProjectPreview) => void;
}> = ({ project, onOpen }) => {
  return (
    <button
      type="button"
      onClick={() => {
        soundManager.playClick();
        onOpen(project);
      }}
      onMouseEnter={() => soundManager.playHover()}
      className="
        group
        pointer-events-auto
        relative
        h-[110px]
        w-[230px]
        overflow-hidden
        rounded-md
        border
        border-cyan-400/60
        bg-slate-950/55
        text-left
        shadow-[0_0_14px_rgba(0,245,255,0.12)]
        backdrop-blur-sm
        transition-all
        duration-300
        hover:scale-[1.03]
        hover:border-cyan-300
        hover:shadow-[0_0_22px_rgba(0,245,255,0.30)]
      "
    >
      <img
        src={project.image}
        alt={project.title}
        className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
          object-cover
          opacity-80
          transition
          duration-300
          group-hover:scale-[1.03]
          group-hover:opacity-100
        "
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />

      <div
        className="
          pointer-events-none
          absolute
          left-2
          top-2
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          border
          border-cyan-300
          bg-slate-950/80
          font-mono
          text-[9px]
          font-bold
          text-cyan-300
          shadow-[0_0_8px_rgba(0,245,255,.35)]
        "
      >
        {project.number}
      </div>

      <ExternalLink
        className="
          pointer-events-none
          absolute
          right-2
          top-2
          h-3.5
          w-3.5
          text-cyan-300
          opacity-70
          transition
          group-hover:opacity-100
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          border-t
          border-cyan-400/20
          bg-slate-950/85
          px-2.5
          py-2
          font-mono
          text-[9px]
          font-bold
          tracking-[0.05em]
          text-cyan-100
        "
      >
        {project.title}
      </div>

      <div className="pointer-events-none absolute bottom-2 right-2 h-[2px] w-6 bg-cyan-400 shadow-[0_0_8px_#00f5ff]" />
    </button>
  );
};

export const ProjectPreviews: React.FC = () => {
  const [selectedProject, setSelectedProject] =
    useState<ProjectPreview | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* SIX PROJECT PREVIEWS */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-10
          flex
          items-center
          justify-between
          px-[7rem]
        "
      >
        {/* LEFT THREE */}
        <div className="pointer-events-none flex flex-col gap-3">
          {LEFT_PROJECTS.map((project) => (
            <PreviewCard
              key={project.id}
              project={project}
              onOpen={setSelectedProject}
            />
          ))}
        </div>

        {/* KEEP THE LIVE GLOBE CLEAR */}
        <div className="pointer-events-none w-[620px] shrink-0" />

        {/* RIGHT THREE */}
        <div className="pointer-events-none flex flex-col gap-3">
          {RIGHT_PROJECTS.map((project) => (
            <PreviewCard
              key={project.id}
              project={project}
              onOpen={setSelectedProject}
            />
          ))}
        </div>
      </div>

      {/* ENLARGED PROJECT VIEW */}
      {selectedProject && (
        <div
          className="
            pointer-events-auto
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/75
            p-6
            backdrop-blur-sm
          "
        >
          <div
            className="
              relative
              max-h-[90vh]
              w-full
              max-w-4xl
              overflow-y-auto
              rounded-lg
              border
              border-cyan-400/70
              bg-slate-950
              shadow-[0_0_50px_rgba(0,245,255,0.25)]
            "
          >
            <div className="relative h-[400px] w-full bg-slate-950">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="h-full w-full object-contain"
              />

              <div
                className="
                  absolute
                  left-5
                  top-5
                  rounded-full
                  border
                  border-cyan-300
                  bg-slate-950/90
                  px-3
                  py-2
                  font-mono
                  text-sm
                  font-bold
                  text-cyan-300
                "
              >
                {selectedProject.number}
              </div>
            </div>

            <div className="border-t border-cyan-400/30 p-6">
              <div
                className="
                  font-mono
                  text-xl
                  font-bold
                  tracking-[0.08em]
                  text-cyan-100
                "
              >
                {selectedProject.title}
              </div>

              <p className="mt-3 max-w-3xl font-mono text-sm leading-6 text-slate-300">
                {selectedProject.description}
              </p>

              <div
                className="
                  mt-5
                  border-l-2
                  border-cyan-400
                  bg-cyan-400/5
                  px-4
                  py-3
                  font-mono
                  text-xs
                  tracking-wide
                  text-cyan-200
                "
              >
                SELECT AN ACTION BELOW TO CONTINUE
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    console.log(
                      `View GIE project: ${selectedProject.id}`
                    );
                  }}
                  className="
                    cursor-pointer
                    rounded
                    border
                    border-cyan-400
                    px-5
                    py-3
                    font-mono
                    text-xs
                    font-bold
                    tracking-wider
                    text-cyan-200
                    transition
                    hover:bg-cyan-400/10
                  "
                >
                  VIEW PROJECT
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    console.log(
                      `Analyze GIE project: ${selectedProject.id}`
                    );
                  }}
                  className="
                    cursor-pointer
                    rounded
                    border
                    border-emerald-400/70
                    px-5
                    py-3
                    font-mono
                    text-xs
                    font-bold
                    tracking-wider
                    text-emerald-300
                    transition
                    hover:bg-emerald-400/10
                  "
                >
                  ANALYZE
                </button>
              </div>

              <div
                className="
                  mt-5
                  rounded
                  border
                  border-cyan-400/30
                  bg-cyan-400/5
                  px-4
                  py-3
                  text-center
                  font-mono
                  text-[11px]
                  font-bold
                  tracking-[0.12em]
                  text-cyan-300
                "
              >
                PRESS ESC TO RETURN TO THE GIE INTERFACE
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};