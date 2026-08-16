import {
  Activity,
  BookOpen,
  Compass,
  Cpu,
  FileText,
  FolderOpen,
  FlaskConical,
  Heart,
  Layers,
  Shapes,
  type LucideIcon,
} from 'lucide-react';

interface SectionProps {
  id: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  status?: 'Planned' | 'Experimental' | 'Active';
  children?: React.ReactNode;
}

function StatusBadge({ status }: { status: NonNullable<SectionProps['status']> }) {
  const styles: Record<string, string> = {
    Active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    Experimental: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    Planned: 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400',
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
}

function Section({ id, icon: Icon, eyebrow, title, description, status, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-graphite-800 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-graphite-700 bg-graphite-850 text-cyan-400">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/70">{eyebrow}</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">{description}</p>
            </div>
          </div>
          {status && <StatusBadge status={status} />}
        </div>
        {children}
      </div>
    </section>
  );
}

const CAPABILITY_ROWS = [
  { name: 'Points, Lines, Segments, Rays', state: 'Planned' as const },
  { name: 'Circles, Arcs, Ellipses', state: 'Planned' as const },
  { name: 'Polygons & Triangles', state: 'Planned' as const },
  { name: 'Symmetry & Transformations', state: 'Planned' as const },
  { name: 'Spirals & Curves', state: 'Planned' as const },
  { name: 'Tessellations & Constructions', state: 'Planned' as const },
];

const PROJECT_STATES = [
  { name: 'Draft', color: 'text-zinc-400', dot: 'bg-zinc-500' },
  { name: 'Beta', color: 'text-amber-300', dot: 'bg-amber-400' },
  { name: 'Processing', color: 'text-cyan-300', dot: 'bg-cyan-400 animate-pulse' },
  { name: 'Published', color: 'text-emerald-300', dot: 'bg-emerald-400' },
  { name: 'Private', color: 'text-zinc-500', dot: 'bg-zinc-600' },
  { name: 'Archived', color: 'text-zinc-600', dot: 'bg-zinc-700' },
];

const RECENT_EVENTS = [
  { label: 'Engine initialized', time: 'just now', type: 'system' },
  { label: 'Demo project loaded', time: '2m ago', type: 'project' },
  { label: 'Ticker feed started', time: '2m ago', type: 'engine' },
  { label: 'Platform build completed', time: '5m ago', type: 'system' },
];

export default function Sections() {
  return (
    <>
      {/* Engine */}
      <Section
        id="engine"
        icon={Cpu}
        eyebrow="Core System"
        title="The Geometry Engine"
        description="The heart of GIE. Eventually capable of identifying and reconstructing points, lines, circles, arcs, polygons, triangles, ellipses, spirals, symmetry, intersections, ratios, transformations, and tessellations — then generating editable construction blueprints from any identifiable geometric pattern."
        status="Experimental"
      >
        <div className="mt-8 overflow-hidden rounded-xl border border-graphite-700 bg-graphite-850/50">
          <div className="grid divide-y divide-graphite-700 sm:grid-cols-2 sm:divide-y-0 sm:divide-x sm:divide-graphite-700">
            {CAPABILITY_ROWS.map((row) => (
              <div key={row.name} className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm text-zinc-300">{row.name}</span>
                <StatusBadge status={row.state} />
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 flex items-center gap-2 font-mono text-xs text-amber-400/80">
          <FlaskConical className="h-3.5 w-3.5" />
          No reconstruction functionality is implemented yet. All capabilities are labeled honestly — nothing is simulated as complete.
        </p>
      </Section>

      {/* Geometry */}
      <Section
        id="geometry"
        icon={Shapes}
        eyebrow="Reconstruction Targets"
        title="Geometry"
        description="The complete set of geometric primitives and structures the Engine is being built to identify and reconstruct — from points and lines to spirals, tessellations, and full geometric constructions."
        status="Planned"
      >
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            'Points', 'Lines', 'Rays', 'Segments',
            'Circles', 'Arcs', 'Polygons', 'Triangles',
            'Quadrilaterals', 'Ellipses', 'Spirals', 'Curves',
            'Symmetry', 'Intersections', 'Ratios', 'Transformations',
            'Tessellations', 'Constructions',
          ].map((g) => (
            <div
              key={g}
              className="flex items-center gap-2.5 rounded-lg border border-graphite-700/60 bg-graphite-850/40 px-3.5 py-2.5"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/40" />
              <span className="text-sm text-zinc-300">{g}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-xs text-zinc-500">
          All reconstruction targets are planned. No geometric identification is active yet.
        </p>
      </Section>

      {/* Projects */}
      <Section
        id="projects"
        icon={FolderOpen}
        eyebrow="Workspaces"
        title="Projects"
        description="Each project is a complete workspace containing an owner, description, uploaded files, calculations, geometry, conversations, blueprints, documentation, revisions, and a full activity history."
        status="Planned"
      >
        <div className="mt-8 flex flex-wrap gap-2.5">
          {PROJECT_STATES.map((s) => (
            <span
              key={s.name}
              className="inline-flex items-center gap-2 rounded-lg border border-graphite-700 bg-graphite-850/60 px-3 py-2 text-sm font-medium"
            >
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              <span className={s.color}>{s.name}</span>
            </span>
          ))}
        </div>
      </Section>

      {/* Documentation */}
      <Section
        id="documentation"
        icon={BookOpen}
        eyebrow="Knowledge Base"
        title="Documentation Center"
        description="Comprehensive documentation covering the project overview, user guide, engine guide, mathematics, blueprint format, API, AI systems, development status, changelog, and roadmap — with full versioning and revision history."
        status="Planned"
      >
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {['Project Overview', 'User Guide', 'Engine Guide', 'Mathematics', 'Blueprint Format', 'API Reference', 'AI Systems', 'Development Status', 'Changelog & Roadmap'].map((doc) => (
            <div key={doc} className="flex items-center gap-3 rounded-lg border border-graphite-700/60 bg-graphite-850/40 px-4 py-3 text-sm text-zinc-300 transition-colors hover:border-cyan-500/30 hover:text-cyan-300">
              <FileText className="h-4 w-4 shrink-0 text-zinc-500" />
              {doc}
            </div>
          ))}
        </div>
      </Section>

      {/* Research */}
      <Section
        id="research"
        icon={Compass}
        eyebrow="Open Inquiry"
        title="Research"
        description="An open geometric research workspace for exploring patterns, testing hypotheses, and collaborating on reconstruction — with every conversation and analysis preserved as part of the permanent record."
        status="Planned"
      />

      {/* Blueprints */}
      <Section
        id="blueprints"
        icon={Layers}
        eyebrow="Output"
        title="Blueprint Library"
        description="Generated construction blueprints containing a title, project, version, author, creation date, revision history, dimensions, formulas, construction sequence, and downloadable files."
        status="Planned"
      />

      {/* Development Status */}
      <Section
        id="status"
        icon={Activity}
        eyebrow="Transparency"
        title="Development Status"
        description="GIE is under active development. This Public Beta is evolving in phases, with each phase reviewed before the next begins. Nothing is presented as finished until it truly is."
        status="Active"
      >
        <div className="mt-8 space-y-3">
          {[
            { phase: 'Phase 1', label: 'Foundation & Homepage', state: 'Active', pct: 100 },
            { phase: 'Phase 2', label: 'Accounts, Roles & Permissions', state: 'Planned', pct: 0 },
            { phase: 'Phase 3', label: 'Projects & File Uploads', state: 'Planned', pct: 0 },
            { phase: 'Phase 4', label: 'Geometry Engine & Reconstruction', state: 'Planned', pct: 0 },
            { phase: 'Phase 5', label: 'Blueprints, Docs & Conversations', state: 'Planned', pct: 0 },
            { phase: 'Phase 6', label: 'AI Integration Framework', state: 'Planned', pct: 0 },
            { phase: 'Phase 7', label: 'Donations & Stripe Integration', state: 'Planned', pct: 0 },
            { phase: 'Phase 8', label: 'Owner Dashboard & Activity Logging', state: 'Planned', pct: 0 },
          ].map((p) => (
            <div key={p.phase} className="flex items-center gap-4">
              <span className="w-20 shrink-0 font-mono text-xs uppercase tracking-wider text-cyan-400/70">{p.phase}</span>
              <span className="w-56 shrink-0 text-sm text-zinc-300">{p.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-graphite-700">
                <div
                  className={`h-full rounded-full ${p.pct > 0 ? 'bg-cyan-500' : 'bg-graphite-600'}`}
                  style={{ width: `${p.pct}%` }}
                />
              </div>
              <StatusBadge status={p.state as 'Active' | 'Planned'} />
            </div>
          ))}
        </div>
      </Section>

      {/* Public Activity */}
      <Section
        id="activity"
        icon={Cpu}
        eyebrow="Audit Trail"
        title="Public Activity"
        description="A live view of recent engine and platform events. Every significant action — uploads, analysis requests, AI actions, document edits, blueprint creation, publishing, and system events — is recorded with timestamps."
        status="Active"
      >
        <div className="mt-8 space-y-2">
          {RECENT_EVENTS.map((e, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-graphite-700/50 bg-graphite-850/40 px-4 py-3">
              <span className={`h-2 w-2 shrink-0 rounded-full ${e.type === 'system' ? 'bg-zinc-500' : e.type === 'engine' ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
              <span className="text-sm text-zinc-300">{e.label}</span>
              <span className="ml-auto font-mono text-xs text-zinc-600">{e.time}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Support GIE */}
      <Section
        id="support"
        icon={Heart}
        eyebrow="Sustain the Project"
        title="Support GIE"
        description="GIE is built to last. Donations keep the engine running and the research open. Support includes one-time donations, optional donor accounts, receipts, and a full donation history — with secure Stripe integration coming soon."
        status="Planned"
      >
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'One-Time Donations', desc: 'Support GIE with a single contribution of any amount.' },
            { label: 'Donor Accounts', desc: 'Optional accounts to track your contributions and history.' },
            { label: 'Receipts & History', desc: 'Automatic receipts and a complete, searchable donation record.' },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
              <h3 className="text-sm font-semibold text-emerald-300">{card.label}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{card.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-xs text-zinc-500">
          Secure Stripe integration is in preparation. No payment will be processed until the integration is live.
        </p>
      </Section>
    </>
  );
}
