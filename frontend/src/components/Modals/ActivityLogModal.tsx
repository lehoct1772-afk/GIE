import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_ACTIVITY_FEED } from '../../data/mockData';
import { soundManager } from '../../utils/audio';
import { X, Activity, Search, Download } from 'lucide-react';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityLogModal: React.FC<ActivityLogModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredFeed = INITIAL_ACTIVITY_FEED.filter(item =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-slate-950 border-2 border-cyan-400/80 rounded-lg p-6 shadow-[0_0_40px_rgba(0,240,255,0.4)] relative font-mono text-slate-200 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4 border-b border-cyan-500/30 shrink-0">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-cyan-300 uppercase tracking-widest">
                FULL TELEMETRY & ACTIVITY AUDIT FEED
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

          {/* Search bar */}
          <div className="relative mb-3 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search event logs by keyword..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-cyan-500/30 rounded text-xs text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Log list */}
          <div className="overflow-y-auto space-y-2 pr-1 font-mono text-xs flex-1">
            {filteredFeed.map(item => (
              <div
                key={item.id}
                className="p-2.5 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded flex justify-between items-center transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-cyan-200">{item.text}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">{item.timestamp}</span>
                  <span className="text-[9px] text-emerald-400 font-bold uppercase">{item.type}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Export */}
          <div className="pt-3 mt-3 border-t border-cyan-500/20 flex justify-between items-center shrink-0">
            <span className="text-[10px] text-slate-400">SHOWING {filteredFeed.length} TELEMETRY EVENTS</span>
            <button
              onClick={() => {
                soundManager.playClick();
                const logData = JSON.stringify(filteredFeed, null, 2);
                const blob = new Blob([logData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `gie_telemetry_logs_${Date.now()}.json`;
                a.click();
              }}
              className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT JSON LOGS</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
