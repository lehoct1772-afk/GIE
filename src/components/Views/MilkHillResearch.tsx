import React, { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";

interface ResearchPdf {
  title: string;
  file: string;
}

const RESEARCH_PDFS: ResearchPdf[] = [
  {
    title: "01 — Milk Hill 2001 Measurement Basis — 787 FT",
    file: "/research/milk-hill/01_Milk_Hill_2001_Measurement_Basis_787FT_COMPLETE.pdf",
  },
  {
    title: "02 — Milk Hill 2001 — 409 Physical Reconstruction",
    file: "/research/milk-hill/02_Milk_Hill_2001_409_COMPLETE_Physical_Reconstruction.pdf",
  },
  {
    title: "03 — Milk Hill 2001 — Fibonacci / Golden Spiral Full Test",
    file: "/research/milk-hill/03_Milk_Hill_2001_Fibonacci_Golden_Spiral_Full_Test.pdf",
  },
  {
    title: "04 — Milk Hill 2001 — 409 Binary and Five-Bit Full Record",
    file: "/research/milk-hill/04_Milk_Hill_2001_409_Binary_and_FiveBit_Full_Record.pdf",
  },
  {
    title: "05 — Milk Hill 2001 — Letter Permutation Test",
    file: "/research/milk-hill/05_Milk_Hill_2001_Letter_Permutation_Test.pdf",
  },
  {
    title: "06 — Milk Hill 2001 — Final Mathematical Conclusion",
    file: "/research/milk-hill/06_Milk_Hill_2001_FINAL_MATHEMATICAL_CONCLUSION.pdf",
  },
  {
    title: "07 — GIE Milk Hill 2001 — Mathematical Supporting Record",
    file: "/research/milk-hill/GIE_Milk_Hill_2001_Mathematical_Supporting_Record_PREVIEW.pdf",
  },
  {
    title: "08 — GIE Milk Hill — Blueprint 001 Analysis Record",
    file: "/research/milk-hill/GIE_Milk_Hill_Blueprint_001_Analysis_Record_PREVIEW.pdf",
  },
  {
    title: "09 — GIE Milk Hill — Spiral Arm Boundary Analysis",
    file: "/research/milk-hill/GIE_Milk_Hill_Spiral_Arm_Boundary_Analysis_20260816.pdf",
  },
  {
    title: "10 — GIE Milk Hill — Spiral Arm Boundary Analysis Continued",
    file: "/research/milk-hill/GIE_Milk_Hill_Spiral_Arm_Boundary_Analysis_CONTINUED_20260816.pdf",
  },
  {
    title: "11 — GIE Milk Hill — Spiral Arm Boundary Analysis Phase Ring",
    file: "/research/milk-hill/GIE_Milk_Hill_Spiral_Arm_Boundary_Analysis_PHASE_RING_20260816.pdf",
  },
  {
    title: "12 — Milk Hill 2001 — Actual Math Binary Analysis",
    file: "/research/milk-hill/Milk_Hill_2001_actual_math_binary_analysis.pdf",
  },
];

export const MilkHillResearch: React.FC = () => {
  const [selectedPdf, setSelectedPdf] = useState(RESEARCH_PDFS[0]);

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col space-y-5 overflow-hidden">
      <div className="shrink-0 border-b border-cyan-500/30 pb-4">
        <h1 className="flex items-center space-x-3 text-3xl font-bold text-cyan-300">
          <FileText className="h-8 w-8 text-cyan-400" />
          <span>MILK HILL 2001 — MATHEMATICAL RESEARCH</span>
        </h1>

        <p className="mt-1 text-xs text-slate-400">
          GIE Research Archive • 12 authoritative documents • Read-only
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-wider">
          <span className="rounded border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-cyan-300">
            787 FT FORMATION
          </span>
          <span className="rounded border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-cyan-300">
            409 CIRCLES
          </span>
          <span className="rounded border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-cyan-300">
            72 FT LARGEST
          </span>
          <span className="rounded border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-cyan-300">
            40 IN SMALLEST
          </span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="min-h-0 overflow-y-auto pr-1">
          <div className="space-y-2">
            {RESEARCH_PDFS.map((pdf) => {
              const active = selectedPdf.file === pdf.file;

              return (
                <button
                  key={pdf.file}
                  type="button"
                  onClick={() => setSelectedPdf(pdf)}
                  className={`group w-full rounded border p-3 text-left transition-all ${
                    active
                      ? "border-cyan-300 bg-cyan-950/50 shadow-[0_0_16px_rgba(0,245,255,.15)]"
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
            src={selectedPdf.file}
            title={selectedPdf.title}
            className="min-h-0 w-full flex-1 bg-slate-950"
          />
        </div>
      </div>
    </div>
  );
};

export default MilkHillResearch;
