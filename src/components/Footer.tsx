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
    <footer className="relative overflow-hidden border-t border-cyan-500/30 bg-[#02060d] shadow-[0_-10px_30px_rgba(6,182,212,0.05)]">
      {/* Intense Radial Blueprint Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.09),transparent_65%)]" />
      
      {/* High-tech matrix background line accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 group">
              <Hexagon className="h-10 w-10 text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] transition-transform duration-500 group-hover:rotate-6" strokeWidth={1.4} />
              <div>
                <div className="text-3xl font-black tracking-wider text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  GIE
                </div>
                <div className="text-[10px] uppercase tracking-[.35em] text-cyan-400 font-mono font-bold">
                  Geometric Intelligence Engine
                </div>
              </div>
            </div>
            
            <p className="mt-6 max-w-sm text-sm leading-7 text-cyan-100/60 font-sans tracking-wide">
              Building the world's largest geometric intelligence platform through mathematics, engineering, AI, historical research, language reconstruction and scientific collaboration.
            </p>
            
            <div className="mt-8 flex gap-4">
              <BrainCircuit className="h-5 w-5 text-cyan-400 transition-colors duration-200 hover:text-white drop-shadow-[0_0_6px_rgba(6,182,212,0.4)] cursor-pointer" />
              <Cpu className="h-5 w-5 text-cyan-400 transition-colors duration-200 hover:text-white drop-shadow-[0_0_6px_rgba(6,182,212,0.4)] cursor-pointer animate-pulse" />
              <BookOpen className="h-5 w-5 text-cyan-400 transition-colors duration-200 hover:text-white drop-shadow-[0_0_6px_rgba(6,182,212,0.4)] cursor-pointer" />
              <Globe className="h-5 w-5 text-cyan-400 transition-colors duration-200 hover:text-white drop-shadow-[0_0_6px_rgba(6,182,212,0.4)] cursor-pointer" />
            </div>
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-[.35em] text-cyan-400 font-mono border-b border-cyan-500/10 pb-1 w-fit">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-cyan-100/50 font-mono tracking-wide transition-all duration-200 hover:text-cyan-300 hover:pl-1 hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-cyan-500/10 pt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm text-cyan-100/40 font-sans tracking-wide">
              &copy; {new Date().getFullYear()} Geometric Intelligence Engine
            </div>
            
            <div className="flex flex-wrap items-center gap-5 font-mono text-xs text-cyan-400/50">
              <span className="border border-cyan-500/20 px-2 py-0.5 rounded bg-cyan-950/10 backdrop-blur-sm hover:text-cyan-300 hover:border-cyan-400/40 transition-colors">v{BUILD_INFO.version}</span>
              <span className="border border-cyan-500/20 px-2 py-0.5 rounded bg-cyan-950/10 backdrop-blur-sm hover:text-cyan-300 hover:border-cyan-400/40 transition-colors">Build {BUILD_INFO.buildNumber}</span>
              <span className="hover:text-cyan-300 transition-colors">{formatBuildTimestamp(BUILD_INFO.buildTimestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
