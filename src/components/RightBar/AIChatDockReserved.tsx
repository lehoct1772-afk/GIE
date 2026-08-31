import React from 'react';
import { MessageSquare, Bot, Sparkles, Terminal } from 'lucide-react';

export const AIChatDockReserved: React.FC = () => {
  return (
    <div className="bg-slate-950/90 border border-cyan-500/40 rounded p-3 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)] flex flex-col space-y-2 select-none transition-all duration-300">
      
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 bg-slate-950/20 px-0.5">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-cyan-950/80 border border-cyan-500/40 rounded shadow-[0_0_6px_rgba(6,182,212,0.2)]">
            <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse drop-shadow-[0_0_3px_#06b6d4]" />
          </div>
          <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-widest drop-shadow-[0_0_5px_rgba(6,182,212,0.45)]">
            AI CHAT DOCK
          </span>
        </div>
        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-1.5 py-0.5 rounded flex items-center space-x-1 font-bold tracking-wider drop-shadow-[0_0_4px_rgba(52,211,153,0.3)]">
          <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
          <span>RESERVED</span>
        </span>
      </div>

      <div className="border border-dashed border-cyan-500/40 bg-[#010a15] rounded p-3 flex flex-col items-center justify-center text-center space-y-1.5 min-h-[72px] shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]">
        <div className="flex items-center space-x-1.5 text-cyan-400">
          <Terminal className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_3px_#06b6d4]" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300">
            GIE COPILOT INTERFACE
          </span>
        </div>
        <p className="text-[9px] font-mono text-slate-400 leading-tight font-sans tracking-wide px-1">
          Reserved slot for conversational AI assistant & geometric problem solver
        </p>
        <span className="text-[8px] font-mono text-cyan-400 font-bold tracking-widest uppercase animate-pulse mt-0.5">
          [ DOCK READY FOR SESSION ]
        </span>
      </div>

    </div>
  );
};
