import React from 'react';

export const NeonHUDPanel: React.FC = () => {
  return (
    <div className="absolute top-4 left-4 z-50 p-4 w-64 backdrop-blur-md bg-black/40 border border-cyan-500 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.4)] text-cyan-400 font-mono">
      <h2 className="text-lg font-bold mb-3 border-b border-cyan-500/30 pb-1 text-cyan-300">GIE ENGINE HUD</h2>
      <div className="space-y-3 text-xs">
        <div className="flex justify-between">
          <span>ACTIVE NODES:</span>
          <span className="font-bold animate-pulse text-cyan-200">1,024</span>
        </div>
        <div className="flex justify-between">
          <span>VECTOR HOOP ROTATION:</span>
          <span className="font-bold text-cyan-200">0.45 rad/s</span>
        </div>
        <div className="flex justify-between">
          <span>RENDER FPS:</span>
          <span className="font-bold text-green-400">60.0</span>
        </div>
      </div>
    </div>
  );
};
