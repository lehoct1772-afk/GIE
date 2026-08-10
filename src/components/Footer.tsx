import { Hexagon, Globe, BrainCircuit, BookOpen, Cpu } from "lucide-react";
import { BUILD_INFO, formatBuildTimestamp } from "../lib/buildInfo";

const FOOTER_LINKS = [
  {
    title: "Platform",
    links: [
      "Engine",
      "Blueprint Earth",
      "Geometry Engine",
      "Research Library",
    ],
  },
  {
    title: "Knowledge",
    links: [
      "Ancient Mathematics",
      "Languages",
      "Crop Circle Archive",
      "Documentation",
    ],
  },
  {
    title: "Development",
    links: [
      "API",
      "Roadmap",
      "Changelog",
      "Development Status",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan-500/20 bg-[#02060d]">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-14">

        <div className="grid gap-12 lg:grid-cols-4">

          <div>

            <div className="flex items-center gap-3">

              <Hexagon
                className="h-10 w-10 text-cyan-300"
                strokeWidth={1.4}
              />

              <div>

                <div className="text-3xl font-black tracking-wider text-white">
                  GIE
                </div>

                <div className="text-[10px] uppercase tracking-[.35em] text-cyan-300">
                  Geometric Intelligence Engine
                </div>

              </div>

            </div>

            <p className="mt-6 max-w-sm text-sm leading-7 text-cyan-100/70">
              Building the world's largest geometric intelligence platform
              through mathematics, engineering, AI, historical research,
              language reconstruction and scientific collaboration.
            </p>

            <div className="mt-8 flex gap-4">

              <BrainCircuit className="h-5 w-5 text-cyan-400" />
              <Cpu className="h-5 w-5 text-cyan-400" />
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <Globe className="h-5 w-5 text-cyan-400" />

            </div>

          </div>

          {FOOTER_LINKS.map((column) => (

            <div key={column.title}>

              <h3 className="mb-5 text-xs font-bold uppercase tracking-[.35em] text-cyan-400">

                {column.title}

              </h3>

              <ul className="space-y-3">

                {column.links.map((link) => (

                  <li key={link}>

                    <a
                      href="#"
                      className="text-sm text-cyan-100/65 transition hover:text-cyan-300"
                    >
                      {link}
                    </a>

                  </li>

                ))}

              </ul>

            </div>

          ))}

        </div>

        <div className="mt-14 border-t border-cyan-500/15 pt-8">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="text-sm text-cyan-100/55">

              Â© {new Date().getFullYear()} Geometric Intelligence Engine

            </div>

            <div className="flex flex-wrap items-center gap-5 font-mono text-xs text-cyan-300/60">

              <span>v{BUILD_INFO.version}</span>

              <span>Build {BUILD_INFO.buildNumber}</span>

              <span>{formatBuildTimestamp(BUILD_INFO.buildTimestamp)}</span>

            </div>

          </div>

        </div>

      </div>

    </footer>
);
}

