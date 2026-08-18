const milkHillDocuments = [
  { title: "01 Milk Hill 2001 Measurement Basis 787FT COMPLETE", url: "/evidence/crop-circles/milk-hill-2001/01_Milk_Hill_2001_Measurement_Basis_787FT_COMPLETE.pdf" },
  { title: "02 Milk Hill 2001 409 COMPLETE Physical Reconstruction", url: "/evidence/crop-circles/milk-hill-2001/02_Milk_Hill_2001_409_COMPLETE_Physical_Reconstruction.pdf" },
  { title: "03 Milk Hill 2001 Fibonacci Golden Spiral Full Test", url: "/evidence/crop-circles/milk-hill-2001/03_Milk_Hill_2001_Fibonacci_Golden_Spiral_Full_Test.pdf" },
  { title: "04 Milk Hill 2001 409 Binary and FiveBit Full Record", url: "/evidence/crop-circles/milk-hill-2001/04_Milk_Hill_2001_409_Binary_and_FiveBit_Full_Record.pdf" },
  { title: "05 Milk Hill 2001 Letter Permutation Test", url: "/evidence/crop-circles/milk-hill-2001/05_Milk_Hill_2001_Letter_Permutation_Test.pdf" },
  { title: "06 Milk Hill 2001 FINAL MATHEMATICAL CONCLUSION", url: "/evidence/crop-circles/milk-hill-2001/06_Milk_Hill_2001_FINAL_MATHEMATICAL_CONCLUSION.pdf" },
  { title: "GIE Milk Hill 2001 Mathematical Supporting Record PREVIEW", url: "/evidence/crop-circles/milk-hill-2001/GIE_Milk_Hill_2001_Mathematical_Supporting_Record_PREVIEW.pdf" },
  { title: "GIE Milk Hill Blueprint 001 Analysis Record PREVIEW", url: "/evidence/crop-circles/milk-hill-2001/GIE_Milk_Hill_Blueprint_001_Analysis_Record_PREVIEW.pdf" },
  { title: "GIE Milk Hill Spiral Arm Boundary Analysis 20260816", url: "/evidence/crop-circles/milk-hill-2001/GIE_Milk_Hill_Spiral_Arm_Boundary_Analysis_20260816.pdf" },
  { title: "GIE Milk Hill Spiral Arm Boundary Analysis CONTINUED 20260816", url: "/evidence/crop-circles/milk-hill-2001/GIE_Milk_Hill_Spiral_Arm_Boundary_Analysis_CONTINUED_20260816.pdf" },
  { title: "GIE Milk Hill Spiral Arm Boundary Analysis PHASE RING 20260816", url: "/evidence/crop-circles/milk-hill-2001/GIE_Milk_Hill_Spiral_Arm_Boundary_Analysis_PHASE_RING_20260816.pdf" },
  { title: "Milk Hill 2001 MATHEMATICAL RESULT FINAL WITH VISUALS", url: "/evidence/crop-circles/milk-hill-2001/Milk_Hill_2001_MATHEMATICAL_RESULT_FINAL_WITH_VISUALS.pdf" }
];

import React, { useMemo, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Binary,
  FileText,
  DraftingCompass,
  Files
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { MILK_HILL_POINTS } from '../../data/milkHillBlueprint';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type ViewMode = 'blueprint' | 'record' | 'evidence' | 'pdf';

const MILK_HILL_PDFS = [
{ title:'01 Â· MEASUREMENT BASIS Â· 787 FT', path:'/evidence/crop-circles/milk-hill-2001/01_Milk_Hill_2001_Measurement_Basis_787FT_COMPLETE.pdf' },
{ title:'02 Â· 409 COMPLETE PHYSICAL RECONSTRUCTION', path:'/evidence/crop-circles/milk-hill-2001/02_Milk_Hill_2001_409_COMPLETE_Physical_Reconstruction.pdf' },
{ title:'03 Â· FIBONACCI / GOLDEN SPIRAL FULL TEST', path:'/evidence/crop-circles/milk-hill-2001/03_Milk_Hill_2001_Fibonacci_Golden_Spiral_Full_Test.pdf' },
{ title:'04 Â· 409 BINARY & FIVE-BIT FULL RECORD', path:'/evidence/crop-circles/milk-hill-2001/04_Milk_Hill_2001_409_Binary_and_FiveBit_Full_Record.pdf' },
{ title:'05 Â· LETTER PERMUTATION TEST', path:'/evidence/crop-circles/milk-hill-2001/05_Milk_Hill_2001_Letter_Permutation_Test.pdf' },
{ title:'06 Â· FINAL MATHEMATICAL CONCLUSION', path:'/evidence/crop-circles/milk-hill-2001/06_Milk_Hill_2001_FINAL_MATHEMATICAL_CONCLUSION.pdf' },
{ title:'07 Â· MATHEMATICAL SUPPORTING RECORD', path:'/evidence/crop-circles/milk-hill-2001/GIE_Milk_Hill_2001_Mathematical_Supporting_Record_PREVIEW.pdf' },
{ title:'08 Â· BLUEPRINT 001 ANALYSIS RECORD', path:'/evidence/crop-circles/milk-hill-2001/GIE_Milk_Hill_Blueprint_001_Analysis_Record_PREVIEW.pdf' },
{ title:'09 Â· SPIRAL ARM BOUNDARY ANALYSIS', path:'/evidence/crop-circles/milk-hill-2001/GIE_Milk_Hill_Spiral_Arm_Boundary_Analysis_20260816.pdf' }
];

const steps = [
  {
    title: '01 Â· RECONSTRUCTED FORMATION',
    body:
      '361 measurable components reconstructed proportionally from the available source image. Circle position and diameter come directly from the GIE measurement table.',
    eq: 'Blueprint scale preserves x, y and diameter ratios.'
  },
  {
    title: '02 Â· SIX-ARM GEOMETRY',
    body:
      'Measured components are assigned to six radial arms. The construction grid marks the six 60Â° sectors used to inspect rotational structure.',
    eq: '360Â° Ã· 6 = 60Â°'
  },
  {
    title: '03 Â· POLAR MEASUREMENT',
    body:
      'Every measured circle is located relative to the formation center. Select any circle to inspect its radius, angle, arm and center-outward rank.',
    eq: 'r = âˆš(xÂ² + yÂ²)   â€¢   Î¸ = atan2(y,x)'
  },
  {
    title: '04 Â· DIAMETER SEQUENCE',
    body:
      'Equivalent circle diameter is derived from measured component area. The center-outward sequence can then be tested without guessing from appearance.',
    eq: 'd = 2âˆš(A/Ï€)'
  },
  {
    title: '05 Â· BINARY TEST',
    body:
      'Where a binary comparison is defined, the measured sequence records its 0/1 assignment. The blueprint displays those bits on demand so the deduction remains traceable.',
    eq: 'measured sequence â†’ bit groups â†’ decimal test'
  }
];

export const CropCircleBlueprintModal: React.FC<Props> = ({
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(0);
  const [bits, setBits] = useState(false);
  const [view, setView] = useState<ViewMode>('blueprint');
  const [selectedPdf, setSelectedPdf] = useState(0);

  const bounds = useMemo(() => {
    const xs = MILK_HILL_POINTS.map(p => p.x);
    const ys = MILK_HILL_POINTS.map(p => p.y);

    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  }, []);

  if (!isOpen) return null;

  const W = 720;
  const H = 610;
  const pad = 46;

  const sx = (W - pad * 2) / (bounds.maxX - bounds.minX);
  const sy = (H - pad * 2) / (bounds.maxY - bounds.minY);
  const s = Math.min(sx, sy);

  const tx = (x: number) => pad + (x - bounds.minX) * s;
  const ty = (y: number) => pad + (y - bounds.minY) * s;

  const cx = tx(475.75);
  const cy = ty(269.25);

  const p = MILK_HILL_POINTS[selected] || MILK_HILL_POINTS[0];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-3 backdrop-blur-md">
      <div className="relative flex max-h-[94vh] w-full max-w-[1280px] flex-col overflow-hidden rounded-lg border border-cyan-400/70 bg-[#020812] font-mono text-slate-200 shadow-[0_0_45px_rgba(0,245,255,.28)]">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-cyan-400/25 px-5 py-3">
          <div>
            <div className="text-[10px] tracking-[.28em] text-amber-300">
              GIE Â· CROP-CIRCLE BLUEPRINT 001
            </div>

            <h2 className="text-lg font-bold tracking-wider text-cyan-200">
              MILK HILL 2001 Â· MEASURED GEOMETRIC RECONSTRUCTION
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded border border-cyan-500/30 p-1.5 text-cyan-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* TOP TOOLBAR */}
        <div className="flex items-center gap-2 border-b border-cyan-400/20 px-5 py-2">

          <button
            onClick={() => {
              soundManager.playClick();
              setView('blueprint');
            }}
            className={`flex items-center gap-2 rounded border px-3 py-1.5 text-[10px] font-bold tracking-wider ${
              view === 'blueprint'
                ? 'border-white/70 bg-white/10 text-white'
                : 'border-cyan-500/25 text-cyan-400'
            }`}
          >
            <DraftingCompass size={13} />
            BLUEPRINT VISUAL
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setView('record');
            }}
            className={`flex items-center gap-2 rounded border px-3 py-1.5 text-[10px] font-bold tracking-wider ${
              view === 'record'
                ? 'border-white/70 bg-white/10 text-white'
                : 'border-cyan-500/25 text-cyan-400'
            }`}
          >
            <FileText size={13} />
            ANALYSIS RECORD
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setView('evidence');
            }}
            className={`flex items-center gap-2 rounded border px-3 py-1.5 text-[10px] font-bold tracking-wider ${
              view === 'evidence'
                ? 'border-white/70 bg-white/10 text-white'
                : 'border-cyan-500/25 text-cyan-400'
            }`}
          >
            <Files size={13} />
            PDF EVIDENCE
          </button>

          <span className="ml-auto text-[9px] tracking-wider text-slate-500">
            GIE-BP-CC-001 Â· SEQUENCE 001â€“361
          </span>
        </div>

        {/* BLUEPRINT */}
        {view === 'blueprint' && (
          <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[1.55fr_.85fr]">

            <div className="relative min-h-[570px] border-r border-cyan-400/20 bg-[#03101a] p-3">

              <div className="absolute left-5 top-5 z-10 flex gap-2">
                <span className="rounded border border-cyan-400/30 bg-black/60 px-2 py-1 text-[9px] text-cyan-300">
                  SCALE: PROPORTIONAL
                </span>

                <span className="rounded border border-cyan-400/30 bg-black/60 px-2 py-1 text-[9px] text-cyan-300">
                  MEASURED: 361
                </span>
              </div>

              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="h-full w-full min-h-[545px]"
              >
                <defs>
                  <pattern
                    id="grid"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M24 0H0V24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth=".45"
                      opacity=".12"
                    />
                  </pattern>

                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M0 0L10 5L0 10z" fill="#ffffff" />
                  </marker>
                </defs>

                <rect width={W} height={H} fill="url(#grid)" />

                {[0, 1, 2, 3, 4, 5].map(a => {
                  const ang = ((a * 60 - 90) * Math.PI) / 180;
                  const rr = 275;

                  return (
                    <line
                      key={a}
                      x1={cx}
                      y1={cy}
                      x2={cx + Math.cos(ang) * rr}
                      y2={cy + Math.sin(ang) * rr}
                      stroke="#ffffff"
                      strokeWidth=".85"
                      strokeDasharray="5 6"
                      opacity={step === 1 ? '.72' : '.22'}
                    />
                  );
                })}

                <circle
                  cx={cx}
                  cy={cy}
                  r="36"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth=".8"
                  strokeDasharray="3 5"
                  opacity=".45"
                />

                {MILK_HILL_POINTS.map((q, i) => {
                  const active = i === selected;

                  return (
                    <g
                      key={q.id}
                      onClick={() => setSelected(i)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={tx(q.x)}
                        cy={ty(q.y)}
                        r={Math.max(1.25, (q.d * s) / 2)}
                        fill={active ? '#ffffff' : '#020812'}
                        stroke="#ffffff"
                        strokeWidth={active ? 1.8 : 1.0}
                        opacity={active ? 1 : .94}
                        filter={active ? 'url(#glow)' : undefined}
                      />

                      {bits && q.bit !== null && (
                        <text
                          x={tx(q.x) + 3}
                          y={ty(q.y) - 3}
                          fontSize="5.5"
                          fill={q.bit === 1 ? '#f5d45d' : '#74f0ff'}
                        >
                          {q.bit}
                        </text>
                      )}
                    </g>
                  );
                })}

                <line
                  x1={cx}
                  y1={cy}
                  x2={tx(p.x)}
                  y2={ty(p.y)}
                  stroke="#ffffff"
                  strokeWidth="1.15"
                  markerEnd="url(#arrow)"
                />

                <text
                  x={tx(p.x) + 8}
                  y={ty(p.y) - 8}
                  fontSize="8"
                  fill="#ffffff"
                >
                  CIRCLE {p.seq}
                </text>
              </svg>
            </div>

            <aside className="flex flex-col gap-4 p-5">

              <div>
                <div className="mb-1 text-[10px] tracking-[.2em] text-cyan-500">
                  DEDUCTION FLOW
                </div>

                <h3 className="text-base font-bold text-cyan-200">
                  {steps[step].title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-300">
                  {steps[step].body}
                </p>

                <div className="mt-3 rounded border border-amber-400/25 bg-amber-950/15 p-3 text-xs font-bold text-amber-200">
                  {steps[step].eq}
                </div>
              </div>

              <div className="rounded border border-cyan-400/25 bg-cyan-950/15 p-3">

                <div className="mb-2 flex items-center gap-2 text-[10px] tracking-wider text-cyan-300">
                  <Ruler size={13} />
                  SELECTED MEASUREMENT
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[10px]">
                  <span className="text-slate-500">SEQUENCE</span>
                  <b>{p.seq}</b>

                  <span className="text-slate-500">COMPONENT</span>
                  <b>{p.id}</b>

                  <span className="text-slate-500">DIAMETER</span>
                  <b>{p.d.toFixed(3)} px</b>

                  <span className="text-slate-500">ANGLE</span>
                  <b>{p.theta.toFixed(3)}Â°</b>

                  <span className="text-slate-500">RADIUS (NORM)</span>
                  <b>{p.r.toFixed(4)}</b>

                  <span className="text-slate-500">ARM / RANK</span>
                  <b>{p.arm} / {p.rank}</b>

                  <span className="text-slate-500">BINARY</span>
                  <b>{p.bit === null ? 'â€”' : p.bit}</b>
                </div>
              </div>

              <button
                onClick={() => setBits(!bits)}
                className="flex items-center justify-center gap-2 rounded border border-cyan-400/35 bg-cyan-950/20 py-2 text-[10px] font-bold tracking-wider text-cyan-200"
              >
                <Binary size={14} />
                {bits ? 'HIDE BINARY LABELS' : 'SHOW BINARY LABELS'}
              </button>

              <div className="mt-auto">

                <div className="mb-2 flex justify-between text-[9px] text-slate-500">
                  <span>MEASUREMENT</span>
                  <span>â†’ GEOMETRY â†’ TEST â†’ RESULT</span>
                </div>

                <div className="flex items-center gap-2">

                  <button
                    disabled={step === 0}
                    onClick={() => {
                      soundManager.playClick();
                      setStep(Math.max(0, step - 1));
                    }}
                    className="rounded border border-cyan-500/30 p-2 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex flex-1 gap-1">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setStep(i)}
                        className={`h-2 flex-1 rounded ${
                          i === step ? 'bg-cyan-300' : 'bg-cyan-950'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    disabled={step === steps.length - 1}
                    onClick={() => {
                      soundManager.playClick();
                      setStep(Math.min(steps.length - 1, step + 1));
                    }}
                    className="rounded border border-cyan-500/30 p-2 disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="border-t border-cyan-400/20 pt-3 text-[9px] leading-4 text-slate-500">
                GIE ANALYSIS RECORD Â· Reconstructed from the available measured
                image dataset. The source image yielded 361 measurable
                components; this blueprint does not represent those as an
                independently verified 409-circle survey.
              </div>
            </aside>
          </div>
        )}

        {/* ANALYSIS RECORD */}
        {view === 'record' && (
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <div className="mx-auto max-w-[1080px]">

              <div className="border-b border-white/25 pb-4">
                <div className="text-[10px] tracking-[.28em] text-cyan-400">
                  GIE ANALYSIS DOCUMENT Â· GIE-BP-CC-001
                </div>

                <h3 className="mt-1 text-xl font-bold text-white">
                  MILK HILL 2001 Â· GEOMETRIC MEASUREMENT RECORD
                </h3>

                <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
                  This read-only record corresponds directly to the numbered
                  circles in Blueprint 001. Select a sequence below, then return
                  to Blueprint Visual to see that exact measured component
                  highlighted.
                </p>
              </div>

              <div className="my-4 grid grid-cols-2 gap-2 md:grid-cols-4">

                <div className="border border-white/20 p-3">
                  <div className="text-[9px] text-slate-500">BLUEPRINT ID</div>
                  <b className="text-white">GIE-BP-CC-001</b>
                </div>

                <div className="border border-white/20 p-3">
                  <div className="text-[9px] text-slate-500">
                    MEASURED SEQUENCE
                  </div>
                  <b className="text-white">001â€“361</b>
                </div>

                <div className="border border-white/20 p-3">
                  <div className="text-[9px] text-slate-500">ARMS</div>
                  <b className="text-white">6</b>
                </div>

                <div className="border border-white/20 p-3">
                  <div className="text-[9px] text-slate-500">SECTOR ANGLE</div>
                  <b className="text-white">60Â°</b>
                </div>
              </div>

              <div className="mb-4 border border-white/20 bg-white/[.025] p-4 text-xs leading-6 text-slate-300">
                <b className="text-white">Deduction chain:</b> measured component
                â†’ proportional blueprint coordinate â†’ radial arm â†’ center-outward
                rank â†’ radius/angle â†’ diameter sequence â†’ defined binary test.
                Each row retains the same sequence identifier used by the visual
                blueprint.
              </div>

              <div className="overflow-x-auto border border-white/20">
                <table className="w-full border-collapse text-left text-[10px]">

                  <thead className="sticky top-0 bg-[#07111b] text-white">
                    <tr>
                      {[
                        'SEQ',
                        'COMP',
                        'ARM',
                        'RANK',
                        'X px',
                        'Y px',
                        'DIAMETER px',
                        'RADIUS NORM',
                        'ANGLE Â°',
                        'BIT'
                      ].map(h => (
                        <th
                          key={h}
                          className="border-b border-white/25 px-2 py-2"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {MILK_HILL_POINTS.map((q, i) => (
                      <tr
                        key={q.seq}
                        onClick={() => {
                          setSelected(i);
                          setView('blueprint');
                        }}
                        className={`cursor-pointer border-b border-white/10 hover:bg-white/10 ${
                          i === selected
                            ? 'bg-white/10 text-white'
                            : 'text-slate-400'
                        }`}
                      >
                        <td className="px-2 py-1.5 font-bold text-white">
                          {String(q.seq).padStart(3, '0')}
                        </td>

                        <td className="px-2">{q.id}</td>
                        <td className="px-2">{q.arm}</td>
                        <td className="px-2">{q.rank}</td>
                        <td className="px-2">{q.x.toFixed(2)}</td>
                        <td className="px-2">{q.y.toFixed(2)}</td>
                        <td className="px-2">{q.d.toFixed(3)}</td>
                        <td className="px-2">{q.r.toFixed(4)}</td>
                        <td className="px-2">{q.theta.toFixed(3)}</td>
                        <td className="px-2">
                          {q.bit === null ? 'â€”' : q.bit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-[9px] leading-4 text-slate-500">
                Â© 2026 GIE Â· Geometric Intelligence Engine.
                GIE-BP-CC-001 identifies this analytical reconstruction and its
                corresponding measurement record. Source imagery should retain
                original photographer/source attribution where known.
              </div>
            </div>
          </div>
        )}
        {/* PDF EVIDENCE */}
        {view === 'evidence' && (
          <div className="min-h-0 flex-1 overflow-y-auto bg-[#03101a] p-5">
            <div className="mx-auto max-w-[1080px]">
              <div className="border-b border-cyan-400/25 pb-4">
                <div className="text-[10px] tracking-[.28em] text-cyan-400">GIE Â· DOCUMENT EVIDENCE LIBRARY</div>
                <h3 className="mt-1 text-xl font-bold text-white">MILK HILL 2001 Â· PDF EVIDENCE</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">Nine read-only supporting documents associated with the Milk Hill 2001 geometric reconstruction and mathematical analysis.</p>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {MILK_HILL_PDFS.map((pdf,index)=>(
                  <div key={pdf.file} className="flex flex-col justify-between rounded border border-cyan-400/30 bg-[#020812] p-4">
                    <div className="flex items-start gap-3">
                      <FileText size={22} className="mt-0.5 shrink-0 text-cyan-300"/>
                      <div><div className="text-sm font-bold leading-5 text-white">{pdf.title}</div><div className="mt-2 text-[10px] text-slate-500">GIE SUPPORTING EVIDENCE · PDF</div></div>
                    </div>
                    <button type="button" onClick={()=>{soundManager.playClick();setSelectedPdf(index);setView('pdf');}} className="mt-4 rounded border border-cyan-400/40 bg-cyan-950/25 px-4 py-2 text-[10px] font-bold tracking-wider text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-950/50">OPEN DOCUMENT</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INTERNAL READ-ONLY PDF VIEWER */}
        {view === 'pdf' && (
          <div className="flex min-h-0 flex-1 flex-col bg-[#03101a]">
            <div className="flex items-center justify-between gap-3 border-b border-cyan-400/25 px-5 py-3">
              <div>
                <div className="text-[10px] tracking-[.24em] text-cyan-400">GIE · READ-ONLY DOCUMENT VIEWER</div>
                <div className="mt-1 text-sm font-bold text-white">{MILK_HILL_PDFS[selectedPdf].title}</div>
                <div className="mt-1 text-[9px] text-slate-500">DOCUMENT {String(selectedPdf+1).padStart(2,'0')} OF {String(MILK_HILL_PDFS.length).padStart(2,'0')}</div>
              </div>
              <button type="button" onClick={()=>{soundManager.playClick();setView('evidence');}} className="flex shrink-0 items-center gap-2 rounded border border-cyan-400/40 bg-cyan-950/25 px-3 py-2 text-[10px] font-bold tracking-wider text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-950/50"><ChevronLeft size={14}/>BACK TO EVIDENCE</button>
            </div>
            <div className="min-h-0 flex-1 p-3">
              <iframe src={`${MILK_HILL_PDFS[selectedPdf].file}#toolbar=1&navpanes=0&view=FitH`} title={MILK_HILL_PDFS[selectedPdf].title} className="h-full min-h-[70vh] w-full rounded border border-cyan-400/25 bg-white"/>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};




