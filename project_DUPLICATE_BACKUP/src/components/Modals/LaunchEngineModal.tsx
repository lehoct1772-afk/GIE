import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/audio';
import { X, Upload, Cpu, CheckCircle2, Zap, Sliders } from 'lucide-react';

interface LaunchEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchEngineModal: React.FC<LaunchEngineModalProps> = ({ isOpen, onClose }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    goldenRatioMatch: number;
    extractedNodes: number;
    fractalDimension: number;
    eulerCharacteristic: string;
    symmetryGroup: string;
    harmonicStatus: string;
  } | null>(null);

  const handleRunAnalysis = () => {
    soundManager.playScan();
    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          soundManager.playChime();
          setResult({
            goldenRatioMatch: 98.42,
            extractedNodes: 184,
            fractalDimension: 1.618,
            eulerCharacteristic: 'V - E + F = 2',
            symmetryGroup: 'D6 Hexagonal Lattice',
            harmonicStatus: 'RESONANT (ALIGNED)'
          });
          return 100;
        }
        return prev + 12;
      });
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-slate-950 border-2 border-cyan-400/80 rounded-lg p-6 shadow-[0_0_40px_rgba(0,240,255,0.4)] relative font-mono text-slate-200"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4 border-b border-cyan-500/30">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h2 className="text-lg font-bold text-cyan-300 uppercase tracking-widest">
                GIE ENGINE ANALYZER & FEATURE EXTRACTOR
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

          {/* Body */}
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Run real-time high-precision geometric analysis on blueprints, CAD schematics, architectural images, or mathematical matrices.
            </p>

            {/* Drop / Select zone */}
            <div className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-lg p-6 text-center bg-slate-900/50 hover:bg-slate-900/80 transition-all cursor-pointer group">
              <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm text-cyan-200 font-bold uppercase">Drop Blueprint / Image Here</div>
              <div className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, DWG, DXF, SVG, PDF up to 50MB</div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className={`w-full py-3 rounded font-bold uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                analyzing
                  ? 'bg-slate-800 text-slate-500 border border-slate-700'
                  : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{analyzing ? `ANALYZING GEOMETRY (${progress}%)` : 'EXECUTE HARMONIC DECODING'}</span>
            </button>

            {/* Progress Bar */}
            {analyzing && (
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Results Grid */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-900/90 border border-emerald-500/50 rounded space-y-3"
              >
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <span className="text-xs text-emerald-400 font-bold uppercase flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> ANALYSIS COMPLETE
                  </span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                    {result.harmonicStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-2 rounded border border-cyan-500/20">
                    <span className="text-[10px] text-slate-400 uppercase block">GOLDEN RATIO FIT</span>
                    <span className="text-amber-300 font-bold">{result.goldenRatioMatch}%</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-cyan-500/20">
                    <span className="text-[10px] text-slate-400 uppercase block">EXTRACTED NODES</span>
                    <span className="text-cyan-300 font-bold">{result.extractedNodes} vertices</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-cyan-500/20">
                    <span className="text-[10px] text-slate-400 uppercase block">FRACTAL DIMENSION</span>
                    <span className="text-emerald-300 font-bold">{result.fractalDimension} (&phi;)</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-cyan-500/20">
                    <span className="text-[10px] text-slate-400 uppercase block">EULER EQUATION</span>
                    <span className="text-cyan-300 font-bold">{result.eulerCharacteristic}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-cyan-500/20 col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase block">SYMMETRY GROUP</span>
                    <span className="text-cyan-200 font-bold">{result.symmetryGroup}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
