import React, { useState, useEffect } from 'react';
import { ActivityFeedItem } from '../../types';
import { INITIAL_ACTIVITY_FEED } from '../../data/mockData';
import { soundManager } from '../../utils/audio';
import { ArrowRight } from 'lucide-react';

interface LiveDataFeedPanelProps {
  onOpenActivityLog: () => void;
}

export const LiveDataFeedPanel: React.FC<LiveDataFeedPanelProps> = ({ onOpenActivityLog }) => {
  const [feed, setFeed] = useState<ActivityFeedItem[]>(INITIAL_ACTIVITY_FEED);

  useEffect(() => {
    const newItems = [
      'Golden Ratio Phi resonance verified',
      'Icosahedron vertex tensor mapped',
      'Euclidean vector norm calculated',
      'Euler-Poincaré characteristic V-E+F=2',
      'Fibonacci harmonic ratio synchronized',
      'Platonic dual symmetry detected',
      'Sacred spiral angle 137.507° locked'
    ];

    const interval = setInterval(() => {
      const randomText = newItems[Math.floor(Math.random() * newItems.length)];
      const newItem: ActivityFeedItem = {
        id: `act-${Date.now()}`,
        text: randomText,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        timeAgo: '1s ago',
        type: 'DETECTED'
      };

      setFeed(prev => [newItem, ...prev.slice(0, 7)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950/80 border border-cyan-500/30 rounded p-3.5 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.08)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-cyan-500/20">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 animate-ping"></span>
            LIVE DATA FEED
          </span>
        </div>

        {/* Feed List */}
        <div className="space-y-2 font-mono text-[11px]">
          {feed.slice(0, 6).map(item => (
            <div key={item.id} className="flex justify-between items-center group">
              <div className="flex items-center space-x-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span className="text-cyan-100 group-hover:text-cyan-300 transition-colors truncate">
                  {item.text}
                </span>
              </div>
              <span className="text-slate-500 text-[10px] ml-2 shrink-0">{item.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <button
        onClick={() => {
          soundManager.playClick();
          onOpenActivityLog();
        }}
        className="w-full mt-3 pt-2 border-t border-cyan-500/20 text-xs font-mono text-cyan-400 hover:text-cyan-200 flex items-center justify-between group cursor-pointer"
      >
        <span className="tracking-wider uppercase">VIEW ALL ACTIVITY</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
