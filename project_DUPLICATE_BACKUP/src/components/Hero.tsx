import { ArrowRight, Play, Heart, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import GeometricCanvas from "./GeometricCanvas";

const COMMAND_EXAMPLES = [
  'Search Projects',
  'Upload Drawings',
  'Analyze Geometry',
  'Open Blueprint',
  'Ask GIE',
  'Search Documentation',
];

/** Animated placeholder that cycles through example commands */
function CommandPlaceholder() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % COMMAND_EXAMPLES.length);
        setVisible(true);
      }, 350);
    }, 2800);

    return () => clearInterval(cycle);
  }, []);

  return (
    <span
      className={`pointer-events-none absolute left-[3.75rem] top-1/2 -translate-y-1/2 font-mono text-sm text-zinc-500 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {COMMAND_EXAMPLES[index]}
    </span>
  );
}

/** Animated horizontal scan line that sweeps across the command panel */
function ScanLine() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
      aria-hidden="true"
    >
      <div className="scan-line absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
    </div>
  );
}

/** Custom GIE vector glyph — a hexagonal reticle mark */
function GIEGlyph({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <line x1="12" y1="2" x2="12" y2="9" stroke="currentColor" strokeWidth="1" />
      <line x1="12" y1="15" x2="12" y2="22" stroke="currentColor" strokeWidth="1" />
      <line x1="3" y1="7" x2="9.2" y2="10.5" stroke="currentColor" strokeWidth="1" />
      <line x1="14.8" y1="13.5" x2="21" y2="17" stroke="currentColor" strokeWidth="1" />
      <line x1="21" y1="7" x2="14.8" y2="10.5" stroke="currentColor" strokeWidth="1" />
      <line x1="9.2" y1="13.5" x2="3" y2="17" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Corner bracket accent drawn with SVG */
function CornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 12;
  const thick = 1.5;
  const color = 'rgba(34,211,238,0.5)';
  const transforms: Record<string, string> = {
    tl: '',
    tr: 'rotate(90,8,8)',
    br: 'rotate(180,8,8)',
    bl: 'rotate(270,8,8)',
  };
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className="absolute"
      style={{
        top: position.startsWith('t') ? 4 : undefined,
        bottom: position.startsWith('b') ? 4 : undefined,
        left: position.endsWith('l') ? 4 : undefined,
        right: position.endsWith('r') ? 4 : undefined,
      }}
      aria-hidden="true"
    >
      <g transform={transforms[position]}>
        <path
          d="M0 8 L0 0 L8 0"
          stroke={color}
          strokeWidth={thick}
          fill="none"
        />
      </g>
    </svg>
  );
}

export default function Hero() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 grid-bg radial-fade" />
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <GeometricCanvas />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-graphite-950/40 via-transparent to-graphite-950" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-16 sm:px-6 sm:pt-24">

        {/* Eyebrow */}
        <div className="mb-8 animate-fade-up">
          <span className="inline-flex items-center gap-2 bg-cyan-500/5 px-3.5 py-1.5 font-mono text-xs font-medium text-cyan-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            Geometric Intelligence Engine · Public Beta
          </span>
        </div>

        {/* Title */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="mb-1 font-mono text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400/70">
            GIE
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-[3.5rem]">
            Geometric Intelligence Engine
          </h1>

          <p className="mt-3 text-xl font-light tracking-wide text-zinc-300 sm:text-2xl">
            Written Through Mathematics.{` `}
            <span className="text-glow-cyan text-cyan-400">
              So Everyone Can Understand.
            </span>
          </p>
        </div>

        {/* Description */}
        <p
          className="mt-7 max-w-2xl animate-fade-up text-base leading-relaxed text-zinc-400 sm:text-lg"
          style={{ animationDelay: '0.1s' }}
        >
          GIE is an advanced geometric intelligence platform that transforms
          images, drawings, blueprints, and engineering documents into
          mathematically verifiable geometric reconstructions. Every point,
          line, relationship, calculation, revision, and blueprint is
          preserved in a permanent engineering record.
        </p>

        {/* Command Center */}
        <div
          className="mt-12 animate-fade-up"
          style={{ animationDelay: '0.15s' }}
        >
          {/* Panel header */}
          <div className="mb-2 flex items-center gap-3">
            <GIEGlyph className="h-5 w-5 text-cyan-400" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/80">
              GIE Command Center
            </span>

            <div className="flex-1" />

            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
              v0.1
            </span>
          </div>

          {/* Command input surface */}
          <div
            onClick={() => inputRef.current?.focus()}
            className={`relative cursor-text rounded-xl border bg-graphite-850/80 backdrop-blur-md transition-all duration-300 ${
              focused
                ? 'border-cyan-400/70 shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_0_28px_-4px_rgba(34,211,238,0.35)]'
                : 'border-graphite-600/80 hover:border-cyan-500/40'
            }`}
          >
            <ScanLine />
            <CornerBracket position="tl" />
            <CornerBracket position="tr" />
            <CornerBracket position="bl" />
            <CornerBracket position="br" />

            <div className="flex items-center gap-0 px-4 py-4">
              {/* Left glyph */}
              <div className="flex shrink-0 items-center gap-3 border-r border-graphite-600/60 pr-4">
                <GIEGlyph
                  className={`h-6 w-6 transition-colors duration-300 ${
                    focused ? 'text-cyan-400' : 'text-zinc-600'
                  }`}
                />
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 ${
                    focused ? 'text-cyan-400/80' : 'text-zinc-700'
                  }`}
                >
                  GIE
                </span>
              </div>

              {/* Input */}
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="w-full bg-transparent px-4 py-0.5 font-mono text-sm text-zinc-100 outline-none placeholder-transparent"
                  autoComplete="off"
                  spellCheck={false}
                />

                <CommandPlaceholder />
              </div>

              {/* Right action */}
              <div className="flex shrink-0 items-center gap-3 border-l border-graphite-600/60 pl-4">
                <button
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                    focused
                      ? 'bg-cyan-500 text-graphite-950 glow-cyan'
                      : 'bg-graphite-700 text-zinc-400 hover:bg-graphite-600'
                  }`}
                  aria-label="Execute command"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Bottom status bar */}
            <div className="flex items-center justify-between border-t border-graphite-700/50 px-4 py-2">
              <div className="flex items-center gap-4">
                {COMMAND_EXAMPLES.slice(0, 4).map((ex) => (
                  <button
                    key={ex}
                    onClick={() => {
                      if (inputRef.current) inputRef.current.value = ex;
                      inputRef.current?.focus();
                    }}
                    className="font-mono text-[10px] text-zinc-600 transition-colors hover:text-cyan-400"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              <span className="font-mono text-[10px] text-zinc-700">
                Engine · Idle
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div
          className="mt-8 flex animate-fade-up flex-col gap-3 sm:flex-row sm:items-center"
          style={{ animationDelay: '0.2s' }}
        >
          <a
            href="#engine"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-base font-bold text-graphite-950 transition-all hover:bg-cyan-400 glow-cyan"
          >
            <Play className="h-5 w-5 fill-graphite-950" />
            Launch Engine
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="#support"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-graphite-600 bg-graphite-800/50 px-6 py-3.5 text-base font-semibold text-zinc-200 transition-all hover:border-emerald-500/40 hover:text-emerald-300"
          >
            <Heart className="h-5 w-5 text-emerald-400" />
            Support GIE
          </a>
        </div>
      </div>
    </section>
  );
}
