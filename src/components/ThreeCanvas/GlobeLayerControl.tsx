import React, { useState } from 'react';
import { GlobeLayers } from '../../types';
import { Layers, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface GlobeLayerControlProps {
  layers: GlobeLayers;
  onToggleLayer: (key: keyof GlobeLayers) => void;
  onResetLayers: () => void;
}

const CATEGORIES: { title: string; keys: (keyof GlobeLayers)[] }[] = [
  {
    title: 'GIE DISPLAY OVERLAYS',
    keys: ['gieNodes', 'connectionArcs', 'harmonicRing', 'latitudeLongitude', 'globeWireframe']
  },
  {
    title: 'GEOGRAPHY & BOUNDARIES',
    keys: ['continents', 'coastlines', 'countries', 'rivers', 'mountains']
  },
  {
    title: 'GEOLOGICAL & BATHYMETRY',
    keys: ['bathymetry', 'oceanTrenches', 'volcanoes', 'earthquakes', 'tectonicPlates']
  },
  {
    title: 'RESEARCH & SACRED GEOMETRY',
    keys: ['leyLines', 'ancientSites', 'cropCircles', 'mathOverlays', 'userUploads', 'researchMarkers']
  }
];

const LAYER_LABELS: Record<keyof GlobeLayers, string> = {
  continents: 'Continents',
  countries: 'Country Borders',
  coastlines: 'Coastlines (Vector)',
  rivers: 'Major Rivers',
  mountains: 'Mountain Ranges',
  bathymetry: 'Bathymetry Depths',
  oceanTrenches: 'Ocean Trenches',
  volcanoes: 'Active Volcanoes',
  earthquakes: 'Seismic Events',
  tectonicPlates: 'Tectonic Plates',
  leyLines: 'Geodesic Ley Lines',
  ancientSites: 'Ancient Monuments',
  cropCircles: 'Crop Circle Sites',
  mathOverlays: 'Mathematical Grid',
  userUploads: 'User Datasets',
  researchMarkers: 'Research Papers',
  latitudeLongitude: 'Latitude / Longitude Grid',
  connectionArcs: 'GIE Connection Lines',
  harmonicRing: 'Gold Harmonic Ring',
  gieNodes: 'GIE Nodes',
  globeWireframe: 'Blueprint Wireframe'
};

export const GlobeLayerControl: React.FC<GlobeLayerControlProps> = ({
  layers,
  onToggleLayer,
  onResetLayers
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="absolute top-4 right-4 z-20 font-mono select-none">
      <div className="bg-slate-950/90 border border-cyan-500/40 rounded backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.2)] overflow-hidden min-w-[200px] max-w-[280px]">
        {/* Toggle Button Header */}
        <button
          onClick={() => {
            soundManager.playClick();
            setIsOpen(!isOpen);
          }}
          className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-cyan-950/40 transition-colors cursor-pointer border-b border-cyan-500/20"
        >
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold text-cyan-300 tracking-wider">
              GLOBE LAYERS
            </span>
            <span className="text-[9px] px-1.5 py-0.5 bg-cyan-950 border border-cyan-500/40 text-emerald-400 rounded-full font-semibold">
              {activeCount}/{Object.keys(layers).length}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-cyan-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        {/* Collapsible Layer Checklist */}
        {isOpen && (
          <div className="p-2.5 max-h-[380px] overflow-y-auto space-y-3 custom-scrollbar text-[10px]">
            {CATEGORIES.map(cat => (
              <div key={cat.title} className="space-y-1">
                <div className="text-[8px] font-bold text-cyan-400/80 tracking-widest border-b border-cyan-500/20 pb-0.5">
                  {cat.title}
                </div>
                <div className="grid grid-cols-1 gap-1 pt-1">
                  {cat.keys.map(key => {
                    const isEnabled = layers[key];
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          soundManager.playClick();
                          onToggleLayer(key);
                        }}
                        className={`w-full px-2 py-1 rounded text-left flex items-center justify-between transition-colors border ${
                          isEnabled
                            ? 'bg-cyan-950/80 text-cyan-200 border-cyan-500/50 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                            : 'bg-slate-900/40 text-slate-500 border-slate-800 hover:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{LAYER_LABELS[key]}</span>
                        {isEnabled ? (
                          <Eye className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-slate-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="pt-2 border-t border-cyan-500/20 flex justify-between items-center text-[9px]">
              <span className="text-slate-500">Toggle layers freely</span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onResetLayers();
                }}
                className="text-cyan-400 hover:text-cyan-200 underline cursor-pointer"
              >
                Reset Default
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
