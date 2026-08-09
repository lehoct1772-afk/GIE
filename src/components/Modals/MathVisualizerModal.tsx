import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/audio';
import { X, Activity, Play, RefreshCw } from 'lucide-react';

interface MathVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MathVisualizerModal: React.FC<MathVisualizerModalProps> = ({ isOpen, onClose }) => {
  const [selectedEquation, setSelectedEquation] = useState<'wave' | 'spiral' | 'hyperbolic'>('wave');
  const [paramA, setParamA] = useState(1.618);
  const [paramB, setParamB] = useState(2.5);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-3xl bg-slate-950 border-2 border-cyan-400/80 rounded-lg p-6 shadow-[0_0_40px_rgba(0,240,255,0.4)] relative font-mono text-slate-200"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4 border-b border-cyan-500/30">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-cyan-300 uppercase tracking-widest">
                INTERACTIVE MATHEMATICAL GRAPH & WAVE VISUALIZER
              </h2>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls & Presets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedEquation('wave');
              }}
              className={`p-2.5 rounded border text-xs text-left cursor-pointer transition-colors ${
                selectedEquation === 'wave'
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-cyan-500/30'
              }`}
            >
              <div className="font-bold">HARMONIC WAVE</div>
              <div className="text-[10px] opacity-75">z = sin(a·x) · cos(b·y)</div>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedEquation('spiral');
              }}
              className={`p-2.5 rounded border text-xs text-left cursor-pointer transition-colors ${
                selectedEquation === 'spiral'
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-cyan-500/30'
              }`}
            >
              <div className="font-bold">GOLDEN LOGARITHMIC</div>
              <div className="text-[10px] opacity-75">r = a · e^(b · &theta;)</div>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedEquation('hyperbolic');
              }}
              className={`p-2.5 rounded border text-xs text-left cursor-pointer transition-colors ${
                selectedEquation === 'hyperbolic'
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-cyan-500/30'
              }`}
            >
              <div className="font-bold">HYPERBOLIC PARABOLOID</div>
              <div className="text-[10px] opacity-75">z = (x²/a²) - (y²/b²)</div>
            </button>
          </div>

          {/* Interactive Graph Box */}
          <div className="w-full h-64 bg-slate-900/90 border border-cyan-500/30 rounded p-4 relative flex flex-col items-center justify-center overflow-hidden">
            <svg className="w-full h-full text-cyan-400" viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="50%" stopColor="#ffb700" />
                  <stop offset="100%" stopColor="#00ff9d" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
              <line x1="200" y1="0" x2="200" y2="200" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />

              {/* Dynamic plot line */}
              <path
                d={
                  selectedEquation === 'wave'
                    ? `M 0 ${100 + Math.sin(0 * paramA) * 60} Q 100 ${100 + Math.sin(1 * paramA) * 80 * paramB}, 200 ${100 - Math.sin(2 * paramA) * 60} T 400 ${100 + Math.sin(4 * paramA) * 50}`
                    : selectedEquation === 'spiral'
                    ? `M 50 150 Q 150 20 250 150 T 350 50`
                    : `M 0 180 Q 200 20 400 180`
                }
                fill="none"
                stroke="url(#waveGrad)"
                strokeWidth="3"
              />
            </svg>

            <div className="absolute top-3 left-3 text-[10px] text-cyan-400">
              PARAMETER &phi; ALIGNMENT: {paramA.toFixed(3)}
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>FREQUENCY COEFFICIENT (a)</span>
                <span className="text-cyan-300 font-bold">{paramA.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.05"
                value={paramA}
                onChange={e => setParamA(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-900 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>AMPLITUDE RATIO (b)</span>
                <span className="text-amber-300 font-bold">{paramB.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.05"
                value={paramB}
                onChange={e => setParamB(parseFloat(e.target.value))}
                className="w-full accent-amber-400 bg-slate-900 cursor-pointer"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
