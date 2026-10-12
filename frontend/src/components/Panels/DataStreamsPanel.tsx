import React from 'react';
import { DATA_STREAMS } from '../../data/mockData';
import { Database, Image, Brain, FileCheck, GitCompare } from 'lucide-react';

export const DataStreamsPanel: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'ds-1': return <Database className="w-3.5 h-3.5 text-cyan-400" />;
      case 'ds-2': return <Image className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ds-3': return <Brain className="w-3.5 h-3.5 text-amber-400" />;
      case 'ds-4': return <FileCheck className="w-3.5 h-3.5 text-purple-400" />;
      default: return <GitCompare className="w-3.5 h-3.5 text-pink-400" />;
    }
  };

  return (
    <div className="bg-slate-950/80 border border-cyan-500/30 rounded p-3.5 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.08)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-cyan-500/20">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
          GLOBAL DATA STREAMS
        </span>
      </div>

      {/* Streams list */}
      <div className="space-y-2.5 font-mono text-[11px]">
        {DATA_STREAMS.map(stream => (
          <div key={stream.id} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1.5">
                {getIcon(stream.id)}
                <span className="text-slate-300">{stream.name}</span>
              </div>
              <span className="text-cyan-300 font-semibold">{stream.value}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${stream.percent}%`,
                  backgroundColor: stream.color,
                  boxShadow: `0 0 8px ${stream.color}`
                }}
              />
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-cyan-500/20 flex justify-between items-center font-bold">
          <span className="text-slate-400">TOTAL STREAMS</span>
          <span className="text-amber-300">8.652M</span>
        </div>
      </div>
    </div>
  );
};
