import React from 'react';
import { NavTab } from '../../types';
import { BLUEPRINT_PRESETS, MATH_CONSTANTS } from '../../data/mockData';
import { soundManager } from '../../utils/audio';
import { BookOpen, Cpu, Layers, FileText, Globe, Heart, Search, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface TabViewsProps {
  activeTab: NavTab;
  onLaunchEngine: () => void;
  onOpenBlueprintLibrary: () => void;
}

export const TabViews: React.FC<TabViewsProps> = ({
  activeTab,
  onLaunchEngine,
  onOpenBlueprintLibrary
}) => {
  if (activeTab === 'HOME') return null;

  return (
    <div className="w-full h-full bg-slate-950/95 text-slate-200 p-6 md:p-10 font-mono overflow-y-auto z-20 relative">
      {/* ENGINE TAB */}
      {activeTab === 'ENGINE' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b border-cyan-500/30 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-cyan-300 flex items-center space-x-3">
                <Cpu className="w-8 h-8 text-cyan-400" />
                <span>GIE CORE ENGINE WORKSPACE</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">High-throughput 3D spatial vector computation & harmonic tensor grid</p>
            </div>
            <button
              onClick={onLaunchEngine}
              className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 font-bold uppercase text-xs rounded shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              LAUNCH ANALYZER &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-900/80 border border-cyan-500/30 rounded">
              <h3 className="text-sm font-bold text-cyan-300 mb-2 uppercase">GPU ACCELERATED DECODER</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Executes matrix transforms in WebGL / WebGPU for 10M+ spatial vertices per second.
              </p>
              <div className="text-xl font-bold text-amber-300">8.652M CALCS/SEC</div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-cyan-500/30 rounded">
              <h3 className="text-sm font-bold text-cyan-300 mb-2 uppercase font-mono">TENSOR PRECISION</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Double-precision floating point matrix evaluation for astronomical coordinates.
              </p>
              <div className="text-xl font-bold text-emerald-300">99.9987% ACCURACY</div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-cyan-500/30 rounded">
              <h3 className="text-sm font-bold text-cyan-300 mb-2 uppercase">SPATIAL NODES NETWORK</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Active global harmonic nodes synchronized across planetary latitudes.
              </p>
              <div className="text-xl font-bold text-cyan-300">247 RESEARCHERS ONLINE</div>
            </div>
          </div>
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab === 'PROJECTS' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b border-cyan-500/30 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-cyan-300 flex items-center space-x-3">
                <Layers className="w-8 h-8 text-cyan-400" />
                <span>ACTIVE GEOMETRIC PROJECTS (128)</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">Real-world architectural, astronomical, and natural pattern decodings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Project 001: Parthenon Root-5 Dynamic Symmetry', status: 'ACTIVE', nodes: '1,420 vertices', accuracy: '99.98%' },
              { title: 'Project 002: Great Pyramid Planetary Grid Alignment', status: 'ACTIVE', nodes: '4,890 vertices', accuracy: '99.99%' },
              { title: 'Project 003: B-DNA Double Helix Major Groove Ratio', status: 'SYNCHED', nodes: '890 vertices', accuracy: '99.95%' },
              { title: 'Project 004: Golden Logarithmic Shell Lattice', status: 'ANALYZING', nodes: '2,100 vertices', accuracy: '99.91%' }
            ].map((proj, idx) => (
              <div key={idx} className="p-4 bg-slate-900/80 border border-cyan-500/30 rounded flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-cyan-200">{proj.title}</h4>
                  <div className="text-[10px] text-slate-400 mt-1 flex space-x-3">
                    <span>{proj.nodes}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{proj.accuracy} Fit</span>
                  </div>
                </div>
                <span className="text-xs bg-cyan-950 text-cyan-300 px-2 py-1 rounded border border-cyan-500/40">
                  {proj.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLUEPRINT LIBRARY TAB */}
      {activeTab === 'BLUEPRINT_LIBRARY' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b border-cyan-500/30 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-cyan-300 flex items-center space-x-3">
                <BookOpen className="w-8 h-8 text-cyan-400" />
                <span>BLUEPRINT PRESET CATALOG</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">Pre-built sacred geometry and architectural structural models</p>
            </div>
            <button
              onClick={onOpenBlueprintLibrary}
              className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 font-bold uppercase text-xs rounded"
            >
              OPEN FULL CATALOG &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLUEPRINT_PRESETS.map(bp => (
              <div key={bp.id} className="p-4 bg-slate-900/80 border border-cyan-500/30 rounded space-y-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase">{bp.category}</span>
                <h3 className="text-base font-bold text-cyan-200">{bp.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{bp.description}</p>
                <div className="text-xs text-emerald-300 font-bold pt-2 border-t border-slate-800">
                  RATIO: {bp.ratio}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESEARCH TAB */}
      {activeTab === 'RESEARCH' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="border-b border-cyan-500/30 pb-4">
            <h1 className="text-3xl font-bold text-cyan-300 flex items-center space-x-3">
              <FileText className="w-8 h-8 text-cyan-400" />
              <span>MATHEMATICAL RESEARCH & PROOFS</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Formal mathematical papers published by the GIE Research Collective</p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'On the Geometric Uniformity of Golden Ratio Lattices in Spherical Coordinates',
                author: 'Dr. Evelyn Vance & GIE Collective (2026)',
                summary: 'Proves that logarithmic spiral projections onto 3D spheres yield optimal packing density with minimal harmonic distortion.'
              },
              {
                title: 'Universal Constants in Ancient Geodetic Architecture',
                author: 'Prof. Marcus Aurel & GIE Research',
                summary: 'Rigorous statistical analysis of 128 ancient megalithic sites showing 99.99% correlation with Pi and Phi angles.'
              }
            ].map((paper, idx) => (
              <div key={idx} className="p-5 bg-slate-900/80 border border-cyan-500/30 rounded space-y-2">
                <h3 className="text-base font-bold text-cyan-200">{paper.title}</h3>
                <div className="text-xs text-amber-400">{paper.author}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{paper.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCUMENTATION TAB */}
      {activeTab === 'DOCUMENTATION' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="border-b border-cyan-500/30 pb-4">
            <h1 className="text-3xl font-bold text-cyan-300 flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-cyan-400" />
              <span>GIE ENGINE API & FORMULA SPECIFICATION</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Developer documentation for integrating the GIE geometric engine API</p>
          </div>

          <div className="p-5 bg-slate-900 border border-cyan-500/30 rounded space-y-3">
            <div className="text-xs text-cyan-400 font-bold uppercase">REST API ENDPOINT: /api/v1/geometric/decode</div>
            <pre className="p-3 bg-slate-950 rounded text-xs text-emerald-300 overflow-x-auto">
{`POST /api/v1/geometric/decode
Content-Type: application/json

{
  "matrix": [[1.618, 0, 0], [0, 1.618, 0], [0, 0, 1]],
  "targetRatio": "PHI",
  "tolerance": 0.0001
}`}
            </pre>
          </div>
        </div>
      )}

      {/* PUBLIC ACTIVITY TAB */}
      {activeTab === 'PUBLIC_ACTIVITY' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="border-b border-cyan-500/30 pb-4">
            <h1 className="text-3xl font-bold text-cyan-300 flex items-center space-x-3">
              <Globe className="w-8 h-8 text-cyan-400" />
              <span>GLOBAL PUBLIC ACTIVITY FEED</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Real-time public geometric decoding activity from around the world</p>
          </div>

          <div className="space-y-3">
            {[
              { location: 'Tokyo, JP', action: 'Uploaded CAD schematic of Tokyo Skytree structural lattice', time: 'Just now' },
              { location: 'London, UK', action: 'Decoded Golden Ratio match in St. Paul\'s Cathedral dome', time: '2m ago' },
              { location: 'Denver, US', action: 'Executed 10M vector harmonic tensor calculation', time: '5m ago' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-900/80 border border-cyan-500/30 rounded flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-cyan-300">{item.location}</div>
                  <div className="text-xs text-slate-300 mt-1">{item.action}</div>
                </div>
                <span className="text-[10px] text-slate-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUPPORT GIE TAB */}
      {activeTab === 'SUPPORT_GIE' && (
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <div className="border-b border-cyan-500/30 pb-4">
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-2 animate-bounce" />
            <h1 className="text-3xl font-bold text-cyan-300">SUPPORT THE GIE FOUNDATION</h1>
            <p className="text-xs text-slate-400 mt-2">
              Help us map universal geometry and make advanced engineering mathematics accessible to everyone.
            </p>
          </div>

          <div className="p-6 bg-slate-900 border border-cyan-500/30 rounded space-y-4">
            <h3 className="text-lg font-bold text-amber-300">OPEN SCIENCE & OPEN GEOMETRY</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              GIE is built with open research standards so students, architects, engineers, and scientists can analyze geometric structures freely.
            </p>
            <button
              onClick={() => soundManager.playChime()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-950 to-emerald-950 border border-cyan-400 rounded text-cyan-200 font-bold uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              JOIN THE GEOMETRIC RESEARCH COMMUNITY &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
