import React from 'react';
import { MathConstant } from '../../types';
import { MATH_CONSTANTS } from '../../data/mockData';
import { soundManager } from '../../utils/audio';
import { ArrowRight } from 'lucide-react';

interface ConstantsPanelProps {
  onSelectConstant: (constant: MathConstant) => void;
  onOpenMoreConstants: () => void;
}

export const ConstantsPanel: React.FC<ConstantsPanelProps> = ({ onSelectConstant, onOpenMoreConstants }) => {
  return (
    <div className="bg-slate-950/80 border border-cyan-500/40 rounded p-3.5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-cyan-500/20 bg-slate-950/20 px-0.5">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
          MATHEMATICAL CONSTANTS
        </span>
      </div>

      {/* List matching reference layout */}
      <div className="space-y-1.5 font-mono text-[11px]">
        {MATH_CONSTANTS.map(item => (
          <div
            key={item.symbol}
            onClick={() => {
              soundManager.playClick();
              onSelectConstant(item);
            }}
            className="flex justify-between items-center hover:bg-cyan-950/30 px-1.5 py-1 rounded cursor-pointer transition-all duration-200 group border border-transparent hover:border-cyan-500/10"
          >
            <span className="text-slate-300 group-hover:text-amber-400 transition-colors font-bold tracking-wide">
              {item.symbol}
            </span>
            <span className="text-cyan-300 font-mono tracking-wider font-semibold drop-shadow-[0_0_4px_rgba(34,211,238,0.25)] group-hover:text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <button
        onClick={() => {
          soundManager.playClick();
          onOpenMoreConstants();
        }}
        className="w-full mt-3 pt-2 border-t border-cyan-500/20 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center justify-between group cursor-pointer bg-transparent border-none outline-none"
      >
        <span className="tracking-widest uppercase font-bold text-[10px]">MORE CONSTANTS</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-cyan-400 group-hover:drop-shadow-[0_0_3px_rgba(6,182,212,0.6)]" />
      </button>

    </div>
  );
};
