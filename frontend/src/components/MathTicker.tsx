import { TICKER_ITEMS, type TickerItem } from "../lib/tickerData";

const CATEGORY_COLORS: Record<string, string> = {
  COORD: "text-cyan-300",
  RADIUS: "text-emerald-300",
  DIAMETER: "text-emerald-300",
  ANGLE: "text-cyan-300",
  RATIO: "text-amber-300",
  DISTANCE: "text-emerald-300",
  SYMMETRY: "text-cyan-300",
  TRIANGLE: "text-amber-300",
  FORMULA: "text-emerald-300",
  CURVE: "text-cyan-300",
  ARC: "text-emerald-300",
  POLYHEDRON: "text-amber-300",
  TESSELLATION: "text-cyan-300",
  TRANSFORM: "text-emerald-300",
  ACTIVITY: "text-zinc-300",
  INTERSECTION: "text-cyan-300",
};

function TickerEntry({ item }: { item: TickerItem }) {
  const color = CATEGORY_COLORS[item.category] ?? "text-cyan-300";

  return (
    <span className="mx-7 inline-flex items-center gap-3 whitespace-nowrap font-mono text-sm">

      <span className="rounded border border-cyan-500/30 bg-cyan-950/40 px-2 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">
        {item.category}
      </span>

      <span className={`font-semibold ${color}`}>
        {item.label}
      </span>

      <span className="text-cyan-600">
        =
      </span>

      <span className="text-white">
        {item.value}
      </span>

      <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[.2em] text-amber-300">
        LIVE
      </span>

    </span>
  );
}

export default function MathTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative z-20 overflow-hidden border-y border-cyan-500/20 bg-[#02060d] py-3">

      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,245,255,.05),transparent)]" />

      <div className="relative flex items-center">

        <div className="hidden shrink-0 items-center gap-3 border-r border-cyan-500/20 bg-cyan-950/30 px-6 py-2 lg:flex">

          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />

          <span className="font-mono text-xs font-bold uppercase tracking-[.35em] text-cyan-300">
            ENGINE FEED
          </span>

        </div>

        <div className="relative flex-1 overflow-hidden">

          <div className="flex w-max animate-ticker-scroll items-center py-1">

            {items.map((item, index) => (
              <TickerEntry
                key={index}
                item={item}
              />
            ))}

          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#02060d] to-transparent" />

          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#02060d] to-transparent" />

        </div>

      </div>

    </div>
  );
}
