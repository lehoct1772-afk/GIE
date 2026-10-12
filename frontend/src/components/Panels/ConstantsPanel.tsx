import React from 'react';
import { MathConstant } from '../../types';
import { MATH_CONSTANTS } from '../../data/mockData';
import { soundManager } from '../../utils/audio';
import { ArrowRight } from 'lucide-react';

interface ConstantsPanelProps {
  onSelectConstant: (constant: MathConstant) => void;
  onOpenMoreConstants: () => void;
}

export const ConstantsPanel: React.FC<ConstantsPanelProps> = ({
  onSelectConstant,
  onOpenMoreConstants
}) => {
  return (
    <div className="bg-slate-950/80 border border-cyan-500/30 rounded p-3.5 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.08)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-cyan-500/20">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
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
            className="flex justify-between items-center hover:bg-cyan-950/40 px-1.5 py-1 rounded cursor-pointer transition-colors group"
          >
            <span className="text-slate-300 group-hover:text-amber-300 transition-colors font-semibold">
              {item.symbol}
            </span>
            <span className="text-cyan-300 font-mono tracking-wider">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <button
        onClick={() => {
          soundManager.playClick();
          onOpenMoreConstants();
        }}
        className="w-full mt-3 pt-2 border-t border-cyan-500/20 text-xs font-mono text-cyan-400 hover:text-cyan-200 flex items-center justify-between group cursor-pointer"
      >
        <span className="tracking-wider uppercase">MORE CONSTANTS</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
