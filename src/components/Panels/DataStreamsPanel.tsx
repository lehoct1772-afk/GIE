import React from 'react';
import { DATA_STREAMS } from '../../data/mockData';
import { Database, Image, Brain, FileCheck, GitCompare } from 'lucide-react';

export const DataStreamsPanel: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'ds-1':
        return <Database className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]" />;
      case 'ds-2':
        return <Image className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]" />;
      case 'ds-3':
        return <Brain className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)]" />;
      case 'ds-4':
        return <FileCheck className="w-3.5 h-3.5 text-purple-400 drop-shadow-[0_0_4px_rgba(192,132,252,0.4)]" />;
      default:
        return <GitCompare className="w-3.5 h-3.5 text-pink-400 drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]" />;
    }
  };

  return (
    <div className="bg-slate-950/80 border border-cyan-500/40 rounded p-3.5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-cyan-500/20 bg-slate-950/20 px-0.5">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
          GLOBAL DATA STREAMS
        </span>
      </div>

      {/* Streams list */}
      <div className="space-y-2.5 font-mono text-[11px]">
        {DATA_STREAMS.map(stream => (
          <div key={stream.id} className="space-y-1">
            <div className="flex justify-between items-center px-0.5">
              <div className="flex items-center space-x-1.5">
                {getIcon(stream.id)}
                <span className="text-slate-300 transition-colors duration-200 hover:text-white">{stream.name}</span>
              </div>
              <span className="text-cyan-300 font-bold drop-shadow-[0_0_4px_rgba(34,211,238,0.3)]">{stream.value}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-[#010a15] rounded-full overflow-hidden border border-cyan-500/20 p-[1px] shadow-[inset_0_0_4px_rgba(6,182,212,0.1)]">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${stream.percent}%`,
                  backgroundColor: stream.color,
                  boxShadow: `0 0 10px ${stream.color}`
                }}
              />
            </div>
          </div>
        ))}

        {/* Total Streams Row */}
        <div className="pt-2 border-t border-cyan-500/20 flex justify-between items-center font-bold px-0.5">
          <span className="text-slate-400 tracking-wider">TOTAL STREAMS</span>
          <span className="text-amber-400 font-black drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]">8.652M</span>
        </div>
      </div>

    </div>
  );
};
