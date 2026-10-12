import React, { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { milkHillPdfs } from "../../milkHillPdfs";

export const MilkHillResearch: React.FC = () => {
  const [selectedPdf, setSelectedPdf] = useState(milkHillPdfs[0]);

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col space-y-5 overflow-hidden">
      <div className="shrink-0 border-b border-cyan-500/30 pb-4">
        <h1 className="flex items-center space-x-3 text-3xl font-bold text-cyan-300">
          <FileText className="h-8 w-8 text-cyan-400" />
          <span>MILK HILL 2001 — MATHEMATICAL RESEARCH</span>
        </h1>

        <p className="mt-1 text-xs text-slate-400">
          GIE Research Archive • {milkHillPdfs.length} authoritative documents • Read-only
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-wider">
          <span className="rounded border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-cyan-300">
            787 FT OVERALL DIAMETER
          </span>
          <span className="rounded border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-cyan-300">
            409 CIRCLES/SPHERES ACCOUNTED FOR
          </span>
          <span className="rounded border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-cyan-300">
            LARGEST CIRCLE 72 FT
          </span>
          <span className="rounded border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-cyan-300">
            SMALLEST CIRCLE 40 INCHES
          </span>
        </div>

        <p className="mt-3 max-w-4xl text-[10px] leading-4 text-slate-500">
          Source image was a web-page thumbnail. Automated segmentation recovered
          361 measurable bright components. The authoritative accounting remains
          409 circles/spheres; this viewer does not claim all 409 were extracted
          from the thumbnail.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="min-h-0 overflow-y-auto pr-1">
          <div className="space-y-2">
            {milkHillPdfs.map((pdf) => {
              const active = selectedPdf.file === pdf.file;

              return (
                <button
                  key={pdf.file}
                  type="button"
                  onClick={() => setSelectedPdf(pdf)}
                  className={`group w-full rounded border p-3 text-left transition-all ${
                    active
                      ? "border-cyan-300 bg-cyan-950/50"
                      : "border-cyan-500/20 bg-slate-900/70 hover:border-cyan-400/50 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <FileText
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        active ? "text-cyan-300" : "text-cyan-500/70"
                      }`}
                    />

                    <span
                      className={`text-[11px] font-mono leading-relaxed ${
                        active ? "text-cyan-200" : "text-slate-300"
                      }`}
                    >
                      {pdf.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden rounded border border-cyan-500/30 bg-slate-950/80">
          <div className="flex shrink-0 items-center justify-between border-b border-cyan-500/20 bg-slate-900/80 px-4 py-3">
            <div className="min-w-0">
              <div className="truncate text-xs font-bold text-cyan-200">
                {selectedPdf.title}
              </div>
              <div className="mt-1 text-[9px] uppercase tracking-widest text-slate-500">
                READ-ONLY RESEARCH DOCUMENT
              </div>
            </div>

            <a
              href={selectedPdf.file}
              target="_blank"
              rel="noreferrer"
              className="ml-3 flex shrink-0 items-center gap-1 rounded border border-cyan-500/30 px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-cyan-300 hover:bg-cyan-950/60"
            >
              <ExternalLink className="h-3 w-3" />
              Open PDF
            </a>
          </div>

          <iframe
            key={selectedPdf.file}
            src={`${selectedPdf.file}#toolbar=1&navpanes=0&view=FitH`}
            title={selectedPdf.title}
            className="min-h-[60vh] w-full flex-1 bg-slate-950 lg:min-h-0"
          />
        </div>
      </div>
    </div>
  );
};

export default MilkHillResearch;
