import React from 'react';
import { MessageSquare, Bot, Sparkles, Terminal } from 'lucide-react';

export const AIChatDockReserved: React.FC = () => {
  return (
    <div className="bg-slate-950/90 border border-cyan-500/40 rounded p-3 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col space-y-2 select-none">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-cyan-950/80 border border-cyan-400 rounded">
            <Bot className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          </div>
          <span className="text-[11px] font-mono font-bold text-cyan-300 tracking-wider">
            AI CHAT DOCK
          </span>
        </div>
        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded flex items-center space-x-1">
          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
          <span>RESERVED</span>
        </span>
      </div>

      <div className="border border-dashed border-cyan-500/30 bg-cyan-950/20 rounded p-3 flex flex-col items-center justify-center text-center space-y-1.5 min-h-[72px]">
        <div className="flex items-center space-x-1.5 text-cyan-400">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-mono font-semibold tracking-wider text-cyan-200">
            GIE COPILOT INTERFACE
          </span>
        </div>
        <p className="text-[9px] font-mono text-slate-400 leading-tight">
          Reserved slot for conversational AI assistant & geometric problem solver
        </p>
        <span className="text-[8px] font-mono text-cyan-500/80 tracking-widest uppercase">
          [ DOCK READY FOR SESSION ]
        </span>
      </div>
    </div>
  );
};
