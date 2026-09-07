import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BLUEPRINT_PRESETS } from '../../data/mockData';
import { BlueprintPreset } from '../../types';
import { soundManager } from '../../utils/audio';
import { X, BookOpen, Compass, Check } from 'lucide-react';

interface BlueprintLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset?: (preset: BlueprintPreset) => void;
}

export const BlueprintLibraryModal: React.FC<BlueprintLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset
}) => {
  const [selectedPreset, setSelectedPreset] = useState<BlueprintPreset>(BLUEPRINT_PRESETS[0]);
  const [copiedFormula, setCopiedFormula] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-[min(92vw,1024px)] max-h-[90vh] overflow-y-auto bg-slate-950 border-2 border-cyan-500/80 rounded-lg p-4 sm:p-6 shadow-[0_0_40px_rgba(0,240,255,0.4)] relative font-mono text-slate-200 flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4 border-b border-cyan-500/30 flex-shrink-0">
            <div className="flex items-center space-x-2 min-w-0">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 flex-shrink-0" />
              <h2 className="text-sm sm:text-lg font-bold text-cyan-300 uppercase tracking-widest truncate">
                BLUEPRINT & ARCHITECTURAL GEOMETRY LIBRARY
              </h2>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-300 transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 overflow-y-auto pr-1 flex-1">
            {/* Left list of presets */}
            <div className="space-y-2">
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                SELECT PRESET ARCHETYPE
              </span>
              <div className="space-y-1.5 max-h-[300px] md:max-h-none overflow-y-auto">
                {BLUEPRINT_PRESETS.map(bp => {
                  const isSel = selectedPreset.id === bp.id;
                  return (
                    <button
                      key={bp.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedPreset(bp);
                      }}
                      className={`w-full text-left p-2 sm:p-3 rounded border text-[10px] sm:text-xs transition-all flex flex-col justify-between cursor-pointer ${
                        isSel
                          ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900'
                      }`}
                    >
                      <span className="font-bold tracking-wider truncate">{bp.name}</span>
                      <span className="text-[8px] sm:text-[10px] text-cyan-400/80 mt-1 uppercase truncate">{bp.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right detail view */}
            <div className="md:col-span-2 bg-slate-900/80 border border-cyan-500/30 rounded p-3 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4">
              <div>
                <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                  <div className="min-w-0">
                    <span className="text-[8px] sm:text-[10px] text-amber-400 font-bold uppercase tracking-widest block truncate">
                      {selectedPreset.category}
                    </span>
                    <h3 className="text-base sm:text-xl font-bold text-cyan-300 truncate">{selectedPreset.name}</h3>
                  </div>
                  <span className="text-[8px] sm:text-xs bg-cyan-950 text-cyan-200 border border-cyan-500/40 px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                    {selectedPreset.complexity}
                  </span>
                </div>

                <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed mb-3 sm:mb-4">
                  {selectedPreset.description}
                </p>

                {/* Vector graphic preview box */}
                <div className="w-full h-24 sm:h-36 bg-slate-950 border border-cyan-500/30 rounded flex items-center justify-center relative overflow-hidden mb-3 sm:mb-4">
                  <svg className="w-16 h-16 sm:w-24 sm:h-24 text-cyan-400 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 100 100">
                    <path d={selectedPreset.svgPath} stroke="#00f0ff" strokeDasharray="3 3" />
                  </svg>
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-[7px] sm:text-[10px] text-cyan-500/80">
                    {selectedPreset.author}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[9px] sm:text-xs font-mono">
                  <div className="p-2 bg-slate-950 rounded border border-cyan-500/20">
                    <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase block">TARGET RATIO</span>
                    <span className="text-amber-300 font-bold text-[10px] sm:text-sm truncate">{selectedPreset.ratio}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-cyan-500/20">
                    <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase block">SYMMETRY GROUP</span>
                    <span className="text-emerald-300 font-bold text-[10px] sm:text-sm truncate">{selectedPreset.symmetryGroup}</span>
                  </div>
                </div>

                {/* Formula */}
                <div className="mt-2 sm:mt-3 p-2 sm:p-2.5 bg-slate-950 rounded border border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-[9px] sm:text-xs">
                  <div className="min-w-0 flex-1">
                    <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase block">MATHEMATICAL FORMULA</span>
                    <span className="text-cyan-300 font-bold break-all">{selectedPreset.formula}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPreset.formula);
                      setCopiedFormula(true);
                      setTimeout(() => setCopiedFormula(false), 2000);
                    }}
                    className="px-2 py-1 text-[8px] sm:text-[10px] bg-slate-900 border border-cyan-500/40 rounded text-cyan-300 hover:text-cyan-100 flex items-center space-x-1 flex-shrink-0"
                  >
                    {copiedFormula ? <Check className="h-3 w-3 text-emerald-400" /> : <Compass className="h-3 w-3" />}
                    <span>{copiedFormula ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  soundManager.playChime();
                  if (onSelectPreset) onSelectPreset(selectedPreset);
                  onClose();
                }}
                className="w-full py-2 sm:py-2.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-400 rounded font-bold uppercase tracking-widest text-[9px] sm:text-xs flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
              >
                <span>LOAD BLUEPRINT INTO 3D CANVAS</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};