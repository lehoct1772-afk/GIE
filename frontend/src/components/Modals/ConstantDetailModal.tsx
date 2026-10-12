import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MathConstant } from '../../types';
import { soundManager } from '../../utils/audio';
import { X, Copy, Check, Sparkles } from 'lucide-react';

interface ConstantDetailModalProps {
  constant: MathConstant | null;
  onClose: () => void;
}

export const ConstantDetailModal: React.FC<ConstantDetailModalProps> = ({ constant, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!constant) return null;

  const handleCopy = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(constant.fullValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg bg-slate-950 border-2 border-amber-500/80 rounded-lg p-6 shadow-[0_0_40px_rgba(255,183,0,0.3)] relative font-mono text-slate-200"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4 border-b border-amber-500/30">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-amber-300 uppercase tracking-widest">
                {constant.symbol} - {constant.name}
              </h2>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-amber-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Formula Box */}
            <div className="p-3 bg-slate-900 rounded border border-amber-500/30">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">CANONICAL FORMULA</span>
              <span className="text-amber-300 text-sm font-bold">{constant.formula}</span>
            </div>

            {/* High Precision Expansion */}
            <div className="p-3 bg-slate-900 rounded border border-cyan-500/30 relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-400 uppercase">50-DIGIT HIGH PRECISION EXPANSION</span>
                <button
                  onClick={handleCopy}
                  className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 rounded text-[10px] text-cyan-300 hover:text-cyan-100 flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <div className="text-cyan-300 font-bold break-all leading-relaxed bg-slate-950 p-2 rounded">
                {constant.fullValue}
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase block mb-1 font-bold">MATHEMATICAL DESCRIPTION</span>
              <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800">
                {constant.description}
              </p>
            </div>

            {/* Geometric Significance */}
            <div>
              <span className="text-[10px] text-amber-400 uppercase block mb-1 font-bold">GEOMETRIC INTELLIGENCE SIGNIFICANCE</span>
              <p className="text-amber-200/90 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-amber-500/20">
                {constant.geometricSignificance}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
