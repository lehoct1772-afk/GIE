import { Construction, GitBranch } from "lucide-react";
import { BUILD_INFO, formatBuildTimestamp } from "@/lib/buildInfo";

export default function BetaBanner() {
  return (
    <div className="relative z-50 overflow-hidden border-b border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950 backdrop-blur-md">

      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,245,255,.08),transparent)] animate-pulse" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-start gap-3">

          <Construction className="mt-1 h-5 w-5 text-cyan-300" />

          <div>

            <div className="text-sm font-bold uppercase tracking-[.35em] text-cyan-300">
              GIE DEVELOPMENT BUILD
            </div>

            <div className="mt-2 max-w-4xl text-sm leading-6 text-cyan-100/80">
              Geometric Intelligence Engine is currently under active
              development. New modules, mathematical models, visualization
              systems, AI engines, research libraries and documentation are
              being integrated continuously as each phase is completed and
              verified.
            </div>

          </div>

        </div>

        <div className="flex items-center gap-5 whitespace-nowrap font-mono text-xs text-cyan-300/70">

          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            v{BUILD_INFO.version}
          </div>

          <div>
            Build {BUILD_INFO.buildNumber}
          </div>

          <div className="hidden xl:block">
            {formatBuildTimestamp(BUILD_INFO.buildTimestamp)}
          </div>

        </div>

      </div>

    </div>
  );
}