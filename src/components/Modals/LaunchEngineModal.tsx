import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Cpu, ShieldCheck, Upload, Network, Activity, FileText, KeyRound, Globe } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { UploadedData } from '../../types';

interface LaunchEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded?: (data: UploadedData) => void;
}

type DataRecord = {
  id: string;
  x: number;
  y: number;
  capacity?: number;
  flow?: number;
  name?: string;
  type?: string;
  status?: string;
  lat?: number;
  lng?: number;
};

type Relationship = {
  source: string;
  target: string;
  distance?: number;
  capacity?: number;
  flow?: number;
  latency?: number;
  status?: string;
};

type Result = {
  recordCount: number;
  relationshipCount: number;
  bottlenecks: Array<{ id: string; utilization: number; connections: number }>;
  trace: string[];
};

const ENGINE_URL = (import.meta.env.VITE_GIE_ENGINE_URL || 'https://gie-engine.leh-oct1772.workers.dev').replace(/\/+$/, '');

function parseCsv(text: string): { records: DataRecord[]; relationships: Relationship[] } {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error('CSV needs a header and data rows.');

  const header = lines[0].split(',').map(v => v.trim().toLowerCase());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    return Object.fromEntries(header.map((h, i) => [h, values[i] || '']));
  });

  const records: DataRecord[] = [];
  const relationships: Relationship[] = [];

  for (const row of rows) {
    if (row.source && row.target) {
      relationships.push({
        source: row.source,
        target: row.target,
        distance: row.distance ? Number(row.distance) : undefined,
        capacity: row.capacity ? Number(row.capacity) : undefined,
        flow: row.flow ? Number(row.flow) : undefined,
        latency: row.latency ? Number(row.latency) : undefined,
        status: row.status || 'healthy',
      });
    } else if (row.id) {
      const record: DataRecord = {
        id: row.id,
        x: Number(row.x) || 0,
        y: Number(row.y) || 0,
        capacity: row.capacity ? Number(row.capacity) : undefined,
        flow: row.flow ? Number(row.flow) : undefined,
        name: row.name || row.id,
        type: row.type || 'SERVER',
        status: row.status || 'healthy',
        lat: row.lat ? Number(row.lat) : undefined,
        lng: row.lng ? Number(row.lng) : undefined,
      };

      if (record.lat === undefined && record.lng === undefined) {
        record.lat = record.y;
        record.lng = record.x;
      }

      records.push(record);
    }
  }

  if (!relationships.length) {
    throw new Error('CSV must contain source,target columns for relationships.');
  }

  const ids = new Set(records.map(r => r.id));
  relationships.forEach(r => {
    if (!ids.has(r.source)) {
      records.push({
        id: r.source,
        x: (Math.random() - 0.5) * 360,
        y: (Math.random() - 0.5) * 180,
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        name: r.source,
        type: 'SERVER',
        status: 'unknown',
      });
      ids.add(r.source);
    }
    if (!ids.has(r.target)) {
      records.push({
        id: r.target,
        x: (Math.random() - 0.5) * 360,
        y: (Math.random() - 0.5) * 180,
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        name: r.target,
        type: 'SERVER',
        status: 'unknown',
      });
      ids.add(r.target);
    }
  });

  return { records, relationships };
}

function analyze(records: DataRecord[], relationships: Relationship[]): Result {
  const connectionCount = new Map<string, number>();
  const flowMap = new Map<string, number>();
  const capMap = new Map<string, number>();

  records.forEach(r => {
    connectionCount.set(r.id, 0);
    flowMap.set(r.id, r.flow || 0);
    capMap.set(r.id, r.capacity || 0);
  });

  relationships.forEach(e => {
    connectionCount.set(e.source, (connectionCount.get(e.source) || 0) + 1);
    connectionCount.set(e.target, (connectionCount.get(e.target) || 0) + 1);
    const f = e.flow || 0;
    const c = e.capacity || 0;
    flowMap.set(e.source, (flowMap.get(e.source) || 0) + f);
    flowMap.set(e.target, (flowMap.get(e.target) || 0) + f);
    capMap.set(e.source, (capMap.get(e.source) || 0) + c);
    capMap.set(e.target, (capMap.get(e.target) || 0) + c);
  });

  const bottlenecks = records
    .map(r => ({
      id: r.id,
      connections: connectionCount.get(r.id) || 0,
      utilization: (capMap.get(r.id) || 0) > 0 ? (flowMap.get(r.id) || 0) / (capMap.get(r.id) || 1) : 0,
    }))
    .sort((a, b) => (b.utilization - a.utilization) || (b.connections - a.connections))
    .slice(0, 10);

  return {
    recordCount: records.length,
    relationshipCount: relationships.length,
    bottlenecks,
    trace: [
      `Imported ${records.length} records and ${relationships.length} relationships.`,
      `Mapped the supplied relationships for isolated project analysis.`,
      `Calculated connection concentration and supplied flow/capacity utilization.`,
      `Ranked convergence points and capacity pressure for bottleneck review.`,
      `Preserved source rows for auditable result tracing.`,
    ],
  };
}

export const LaunchEngineModal: React.FC<LaunchEngineModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
}) => {
  const [accessKey, setAccessKey] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');
  const [project, setProject] = useState('');
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  const filename = useMemo(() => project.trim() || 'UNTITLED PROJECT', [project]);

  const verify = async () => {
    if (!accessKey.trim()) return;
    setChecking(true);
    setMessage('');
    try {
      const response = await fetch(`${ENGINE_URL}/api/v1/access/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessKey.trim()}`,
        },
        body: '{}',
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data?.error?.message || 'Paid Engine access is not active for this key.');
      }
      setAuthorized(true);
      soundManager.playChime();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Access verification failed.');
    } finally {
      setChecking(false);
    }
  };

  const loadFile = async (file: File) => {
    try {
      const text = await file.text();
      let data: any;

      if (file.name.toLowerCase().endsWith('.json')) {
        data = JSON.parse(text);
      } else {
        data = parseCsv(text);
      }

      const importedRecords = data.records ?? data.locations ?? [];
      const importedRelationships = data.relationships ?? data.connections ?? [];

      if (!Array.isArray(importedRecords) || !Array.isArray(importedRelationships)) {
        throw new Error('JSON requires records[] and relationships[].');
      }

      setRecords(importedRecords);
      setRelationships(importedRelationships);
      setResult(null);
      setMessage(`${file.name} loaded into ${filename}.`);
      soundManager.playScan();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Unable to import file.');
    }
  };

  const run = () => {
    if (!relationships.length) {
      setMessage('Import an analysis dataset first.');
      return;
    }
    const analysisResult = analyze(records, relationships);
    setResult(analysisResult);
    soundManager.playChime();
  };

  const loadToGlobe = () => {
    if (!records.length || !relationships.length) {
      setMessage('Import data first before loading to globe.');
      return;
    }

    const geoNodes = records.map((r) => {
      const lat = r.lat ?? r.y ?? ((Math.random() - 0.5) * 120);
      const lng = r.lng ?? r.x ?? ((Math.random() - 0.5) * 360);

      let status: 'healthy' | 'warning' | 'critical' | 'unknown' = 'healthy';
      if (r.status) {
        if (r.status === 'critical' || r.status === 'warning' || r.status === 'healthy') {
          status = r.status;
        }
      } else if (r.capacity && r.flow) {
        const util = r.flow / r.capacity;
        if (util > 0.85) status = 'critical';
        else if (util > 0.65) status = 'warning';
        else status = 'healthy';
      }

      const load = r.flow && r.capacity ? (r.flow / r.capacity) * 100 : undefined;

      return {
        id: r.id,
        name: r.name || r.id,
        lat: lat,
        lng: lng,
        latLabel: `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`,
        lngLabel: `${Math.abs(lng).toFixed(2)}° ${lng >= 0 ? 'E' : 'W'}`,
        type: (r.type as any) || 'SERVER',
        intensity: status === 'critical' ? 1 : status === 'warning' ? 0.7 : 0.4,
        connections: [] as string[],
        formula: '',
        status: status,
        load: load,
        capacity: r.capacity,
        flow: r.flow,
      };
    });

    const nodeMap = new Map(geoNodes.map(n => [n.id, n]));
    relationships.forEach(rel => {
      const source = nodeMap.get(rel.source);
      const target = nodeMap.get(rel.target);
      if (source && target) {
        if (!source.connections) source.connections = [];
        if (!source.connections.includes(rel.target)) {
          source.connections.push(rel.target);
        }
        if (!target.connections) target.connections = [];
        if (!target.connections.includes(rel.source)) {
          target.connections.push(rel.source);
        }
      }
    });

    const arcs = relationships.map(rel => {
      let status: 'healthy' | 'warning' | 'critical' | 'unknown' = 'healthy';
      if (rel.status) {
        if (rel.status === 'critical' || rel.status === 'warning' || rel.status === 'healthy') {
          status = rel.status;
        }
      } else if (rel.capacity && rel.flow) {
        const util = rel.flow / rel.capacity;
        if (util > 0.85) status = 'critical';
        else if (util > 0.65) status = 'warning';
        else status = 'healthy';
      }

      return {
        id: `${rel.source}->${rel.target}`,
        source: rel.source,
        target: rel.target,
        flow: rel.flow,
        capacity: rel.capacity,
        latency: rel.latency,
        status: status,
        color: status === 'critical' ? '#ff0055' : status === 'warning' ? '#ffb700' : '#00ff9d',
      };
    });

    if (onDataLoaded) {
      onDataLoaded({
        nodes: geoNodes,
        arcs: arcs,
      });
    }

    soundManager.playChime();
    setMessage('Data loaded to 3D globe successfully!');
    onClose();
  };

  const close = () => {
    soundManager.playClick();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-[min(94vw,1100px)] max-h-[90vh] overflow-y-auto rounded-lg border-2 border-cyan-400/70 bg-slate-950 p-4 sm:p-5 font-mono text-slate-200 shadow-[0_0_40px_rgba(0,240,255,.35)]"
        >
          {/* HEADER */}
          <div className="mb-4 sm:mb-5 flex items-center justify-between border-b border-cyan-500/30 pb-3 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-300 flex-shrink-0" />
              <div className="min-w-0">
                <h2 className="font-bold tracking-[.18em] text-cyan-200 text-sm sm:text-base truncate">
                  GIE ENGINE
                </h2>
                <p className="text-[8px] sm:text-[9px] tracking-[.22em] text-slate-500 truncate">
                  PAID ANALYTICS WORKSPACE
                </p>
              </div>
            </div>
            <button onClick={close} className="rounded border border-slate-700 p-1 text-slate-400 hover:text-cyan-300 flex-shrink-0">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {!authorized ? (
            <div className="mx-auto max-w-xl space-y-4 py-4 sm:py-8">
              <div className="rounded border border-amber-400/30 bg-amber-950/20 p-4 sm:p-5 text-center">
                <ShieldCheck className="mx-auto mb-3 h-8 w-8 sm:h-10 sm:w-10 text-amber-300" />
                <h3 className="font-bold tracking-widest text-amber-200 text-sm sm:text-base">AUTHORIZED PAID ACCESS</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  GIE Engine analytics are available to licensed users and approved enterprise engagements.
                </p>
              </div>
              <div>
                <label className="mb-2 block text-[9px] sm:text-[10px] font-bold tracking-widest text-cyan-300">ENGINE ACCESS KEY</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      value={accessKey}
                      onChange={e => setAccessKey(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && verify()}
                      className="w-full rounded border border-cyan-500/40 bg-slate-900 py-2.5 pl-10 pr-3 outline-none focus:border-cyan-300 text-sm"
                      placeholder="Enter licensed access key"
                    />
                  </div>
                  <button
                    onClick={verify}
                    disabled={checking || !accessKey.trim()}
                    className="rounded border border-cyan-400 bg-cyan-950 px-4 sm:px-5 py-2.5 text-xs font-bold tracking-wider text-cyan-200 disabled:opacity-40 whitespace-nowrap"
                  >
                    {checking ? 'VERIFYING' : 'ENTER ENGINE'}
                  </button>
                </div>
              </div>
              {message && (
                <div className="rounded border border-amber-500/30 bg-slate-900 p-3 text-xs text-amber-200">
                  {message}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {/* STATUS CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="rounded border border-cyan-500/25 bg-slate-900/70 p-3 sm:p-4">
                  <ShieldCheck className="mb-2 h-4 w-4 sm:h-5 sm:w-5 text-emerald-300" />
                  <div className="text-[8px] sm:text-[9px] tracking-widest text-slate-500">ACCESS</div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-300 truncate">LICENSE VERIFIED</div>
                </div>
                <div className="rounded border border-cyan-500/25 bg-slate-900/70 p-3 sm:p-4">
                  <Network className="mb-2 h-4 w-4 sm:h-5 sm:w-5 text-cyan-300" />
                  <div className="text-[8px] sm:text-[9px] tracking-widest text-slate-500">DATASET</div>
                  <div className="text-xs sm:text-sm font-bold text-cyan-200 truncate">
                    {records.length} / {relationships.length}
                  </div>
                </div>
                <div className="rounded border border-cyan-500/25 bg-slate-900/70 p-3 sm:p-4">
                  <Activity className="mb-2 h-4 w-4 sm:h-5 sm:w-5 text-amber-300" />
                  <div className="text-[8px] sm:text-[9px] tracking-widest text-slate-500">ANALYSIS</div>
                  <div className="text-xs sm:text-sm font-bold text-amber-200 truncate">{result ? 'COMPLETE' : 'READY'}</div>
                </div>
                <div className="rounded border border-emerald-500/25 bg-slate-900/70 p-3 sm:p-4">
                  <Globe className="mb-2 h-4 w-4 sm:h-5 sm:w-5 text-emerald-300" />
                  <div className="text-[8px] sm:text-[9px] tracking-widest text-slate-500">3D VISUAL</div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-300 truncate">
                    {records.length ? 'LOAD READY' : 'UPLOAD DATA'}
                  </div>
                </div>
              </div>

              {/* INPUT ROW */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                  value={project}
                  onChange={e => setProject(e.target.value)}
                  placeholder="Project / customer analysis name"
                  className="flex-1 rounded border border-cyan-500/30 bg-slate-900 p-2 sm:p-3 text-sm outline-none focus:border-cyan-300 min-w-0"
                />
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-cyan-400 bg-cyan-950 px-4 sm:px-5 py-2 sm:py-3 text-xs font-bold text-cyan-200 whitespace-nowrap">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">IMPORT CSV / JSON</span>
                  <span className="sm:hidden">IMPORT</span>
                  <input
                    type="file"
                    accept=".csv,.json"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])}
                  />
                </label>
              </div>

              {/* FORMAT INFO */}
              <div className="rounded border border-slate-700 bg-black/30 p-2 sm:p-3 text-[9px] sm:text-[10px] text-slate-400 overflow-x-auto">
                <span className="whitespace-nowrap">CSV: <span className="text-cyan-300">source,target,distance,capacity,flow,latency,status</span></span>
                <span className="hidden sm:inline"> · </span>
                <span className="whitespace-nowrap">JSON: <span className="text-cyan-300">{'{"records": [...], "relationships": [...]}'}</span></span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <button
                  onClick={run}
                  disabled={!relationships.length}
                  className="w-full rounded border border-amber-400 bg-amber-950/50 py-2.5 sm:py-3 text-xs font-bold tracking-[.16em] text-amber-200 disabled:border-slate-700 disabled:text-slate-600"
                >
                  RUN GIE NETWORK ANALYSIS
                </button>
                <button
                  onClick={loadToGlobe}
                  disabled={!records.length || !relationships.length}
                  className="w-full flex items-center justify-center gap-2 rounded border border-emerald-400 bg-emerald-950/50 py-2.5 sm:py-3 text-xs font-bold tracking-[.16em] text-emerald-200 disabled:border-slate-700 disabled:text-slate-600"
                >
                  <Globe className="h-4 w-4" />
                  LOAD TO 3D GLOBE
                </button>
              </div>

              {/* MESSAGE */}
              {message && <div className="text-xs text-cyan-200">{message}</div>}

              {/* RESULTS */}
              {result && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded border border-cyan-500/30 bg-slate-900/70 p-3 sm:p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-cyan-300">
                      <Activity className="h-4 w-4" />
                      BOTTLENECK RANKING
                    </h3>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {result.bottlenecks.map((b, i) => (
                        <div key={b.id} className="grid grid-cols-[30px_1fr_auto] gap-2 border-b border-slate-800 py-2 text-xs">
                          <span className="text-slate-500">#{i + 1}</span>
                          <span className="truncate">{b.id}</span>
                          <span className="text-amber-300 whitespace-nowrap">{(b.utilization * 100).toFixed(1)}% · {b.connections}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded border border-cyan-500/30 bg-slate-900/70 p-3 sm:p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-cyan-300">
                      <FileText className="h-4 w-4" />
                      VERIFIABLE TRACE
                    </h3>
                    <ol className="space-y-3 max-h-[200px] overflow-y-auto">
                      {result.trace.map((t, i) => (
                        <li key={t} className="flex gap-3 text-xs leading-relaxed text-slate-300">
                          <span className="text-emerald-300 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};