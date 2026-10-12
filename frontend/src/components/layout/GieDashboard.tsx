import React, { useRef, useEffect, useMemo, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import {
  Activity,
  Cpu,
  Terminal,
  Layers,
  Hammer,
  Compass,
} from 'lucide-react';

const MAP_NODES = [
  {
    id: 1,
    lat: 51.4138,
    lng: -1.8583,
    label: 'Node Alpha - Avebury',
    color: '#00ffff',
  },
  {
    id: 2,
    lat: 51.1789,
    lng: -1.8262,
    label: 'Node Beta - Stonehenge',
    color: '#a855f7',
  },
  {
    id: 3,
    lat: 19.4326,
    lng: -99.1332,
    label: 'Node Gamma - Teotihuacan',
    color: '#22c55e',
  },
  {
    id: 4,
    lat: 30.0444,
    lng: 31.2357,
    label: 'Node Delta - Giza',
    color: '#eab308',
  },
  {
    id: 5,
    lat: -13.1631,
    lng: -72.545,
    label: 'Node Epsilon - Machu Picchu',
    color: '#ec4899',
  },
  {
    id: 6,
    lat: 34.2685,
    lng: 108.9501,
    label: "Node Zeta - Xi'an",
    color: '#00ffff',
  },
  {
    id: 7,
    lat: 22.9519,
    lng: -43.2105,
    label: 'Node Eta - Rio',
    color: '#a855f7',
  },
  {
    id: 8,
    lat: 35.6762,
    lng: 139.6503,
    label: 'Node Theta - Tokyo',
    color: '#22c55e',
  },
  {
    id: 9,
    lat: -3.4653,
    lng: -62.2159,
    label: 'Node Iota - Amazon',
    color: '#eab308',
  },
  {
    id: 10,
    lat: 45.4371,
    lng: 12.3326,
    label: 'Node Kappa - Venice',
    color: '#ec4899',
  },
];

export default function GieDashboard() {
  const globeEl = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const arcData = useMemo(() => {
    return MAP_NODES.map((node, index) => {
      const nextNode = MAP_NODES[(index + 1) % MAP_NODES.length];

      return {
        startLat: node.lat,
        startLng: node.lng,
        endLat: nextNode.lat,
        endLng: nextNode.lng,
        color: [
          'rgba(6, 182, 212, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        label: `Vector Link ${node.id} → ${nextNode.id}`,
      };
    });
  }, []);

  useEffect(() => {
    if (!globeEl.current) {
      return;
    }

    const scene = globeEl.current.scene();

    /*
     * MULTI-LAYER BLUEPRINT HOLOGRAM CAGE
     */
    const geometry = new THREE.IcosahedronGeometry(102, 2);

    const material = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const cageMesh = new THREE.Mesh(geometry, material);

    scene.add(cageMesh);

    /*
     * EXTERNAL GLOWING VECTOR HOOPS
     */
    const ringGroup = new THREE.Group();

    const ringColors = [
      0x00ffff,
      0xa855f7,
      0x22c55e,
    ];

    for (let i = 0; i < 3; i += 1) {
      const radius = 106 + i * 4;

      const ringGeo = new THREE.RingGeometry(
        radius,
        radius + 0.5,
        64
      );

      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[i],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const ringMesh = new THREE.Mesh(
        ringGeo,
        ringMat
      );

      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.rotation.y = (i * Math.PI) / 4;

      ringGroup.add(ringMesh);
    }

    scene.add(ringGroup);

    /*
     * ANIMATION LOOP
     */
    const animate = () => {
      cageMesh.rotation.y += 0.002;
      cageMesh.rotation.x += 0.0005;

      ringGroup.children.forEach(
        (ring, index) => {
          ring.rotation.z +=
            0.001 * (index + 1);
        }
      );

      animationFrameRef.current =
        requestAnimationFrame(animate);
    };

    animate();

    /*
     * GLOBE CONTROLS
     */
    const controls =
      globeEl.current.controls();

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = true;
    controls.minDistance = 200;
    controls.maxDistance = 500;

    /*
     * CLEANUP
     */
    return () => {
      if (
        animationFrameRef.current !== null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      scene.remove(cageMesh);
      scene.remove(ringGroup);

      geometry.dispose();
      material.dispose();

      ringGroup.children.forEach(
        (child: any) => {
          if (child.geometry) {
            child.geometry.dispose();
          }

          if (child.material) {
            if (
              Array.isArray(child.material)
            ) {
              child.material.forEach(
                (childMaterial: THREE.Material) =>
                  childMaterial.dispose()
              );
            } else {
              child.material.dispose();
            }
          }
        }
      );
    };
  }, []);

  return (
    <div className="flex h-screen w-screen bg-slate-950 font-sans text-slate-100 overflow-hidden select-none">

      {/* LEFT SIDEBAR */}
      <div className="w-80 border-r border-slate-900 bg-slate-950/80 p-5 flex flex-col gap-5 backdrop-blur-md z-10">

        {/* GIE HEADER */}
        <div className="flex items-center gap-3 border-b border-slate-900 pb-3">
          <Terminal className="h-6 w-6 text-cyan-400 animate-pulse" />

          <div>
            <h1 className="text-md font-bold tracking-widest text-white uppercase">
              G I E
            </h1>

            <p className="text-[10px] text-cyan-400 font-mono tracking-wider">
              GEOMETRIC INTELLIGENCE ENGINE
            </p>
          </div>
        </div>

        {/* BLUEPRINT MODULES */}
        <div className="flex flex-col gap-2">

          <div className="border border-cyan-500/30 bg-cyan-950/20 p-2.5 rounded flex items-center justify-between cursor-pointer group hover:bg-cyan-500/10 transition-all">
            <span className="text-xs font-medium tracking-wide flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              01 ARCHITECTURAL BLUEPRINT
            </span>
          </div>

          <div className="border border-slate-800 bg-slate-900/40 p-2.5 rounded flex items-center justify-between cursor-pointer hover:bg-slate-900/80 transition-all">
            <span className="text-xs font-medium tracking-wide flex items-center gap-2">
              <Hammer className="h-3.5 w-3.5 text-slate-400" />
              02 CITY / INFRASTRUCTURE
            </span>
          </div>

          <div className="border border-cyan-500/30 bg-cyan-950/20 p-2.5 rounded flex items-center justify-between cursor-pointer group hover:bg-cyan-500/10 transition-all">
            <span className="text-xs font-medium tracking-wide flex items-center gap-2">
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              03 CROP-CIRCLE SITE ANALYSIS
            </span>
          </div>

        </div>

        {/* SYSTEM TELEMETRY */}
        <div className="flex flex-col gap-2.5">

          <h2 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            SYSTEM TELEMETRY
          </h2>

          <div className="grid grid-cols-2 gap-2">

            <div className="bg-slate-900/50 border border-slate-900 p-2.5 rounded flex flex-col">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                CORE
              </span>

              <span className="text-xs font-semibold text-emerald-400 mt-0.5">
                NOMINAL
              </span>
            </div>

            <div className="bg-slate-900/50 border border-slate-900 p-2.5 rounded flex flex-col">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                MATH
              </span>

              <span className="text-xs font-semibold text-purple-400 mt-0.5">
                100% SYNC
              </span>
            </div>

          </div>
        </div>

        {/* ACTIVE GEOMETRIC NODES */}
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1">

          <h2 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            ACTIVE GEOMETRIC NODES
          </h2>

          <div className="flex flex-col gap-1.5">

            {MAP_NODES.map((node) => (
              <div
                key={node.id}
                className={`p-2 rounded border text-[11px] font-mono transition-all cursor-pointer ${
                  hoveredNode === node.label
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900/20 border-slate-900/60 text-slate-400'
                }`}
                onMouseEnter={() =>
                  setHoveredNode(node.label)
                }
                onMouseLeave={() =>
                  setHoveredNode(null)
                }
              >
                <div className="flex items-center justify-between">

                  <span className="truncate">
                    {node.label}
                  </span>

                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        node.color,
                    }}
                  />

                </div>
              </div>
            ))}

          </div>
        </div>

      </div>

      {/* CENTER VIEWPORT */}
      <div className="flex-1 h-full relative bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.6)_0%,rgba(2,6,23,1)_100%)] flex flex-col">

        {/* TOP ENGINE HEADER */}
        <div className="absolute top-5 left-0 right-0 z-10 flex flex-col items-center pointer-events-none text-center">

          <div className="text-[11px] font-mono tracking-[0.3em] text-cyan-400 font-medium">
            WRITTEN THROUGH MATHEMATICS
          </div>

        </div>

        {/* 3D ENGINE CANVAS */}
        <div className="flex-1 min-h-0 flex items-center justify-center cursor-grab active:cursor-grabbing">

          <Globe
            ref={globeEl}

            backgroundColor="rgba(0,0,0,0)"

            showGlobe={true}

            showAtmosphere={true}

            atmosphereColor="#00ffff"

            atmosphereRadiusScale={0.15}

            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"

            pointsData={MAP_NODES}

            pointLat="lat"

            pointLng="lng"

            pointColor="color"

            pointAltitude={0.03}

            pointRadius={0.4}

            pointsMerge={false}

            arcsData={arcData}

            arcStartLat="startLat"

            arcStartLng="startLng"

            arcEndLat="endLat"

            arcEndLng="endLng"

            arcColor="color"

            arcAltitudeAutoScaling={0.4}

            arcStroke={0.5}

            arcDashLength={0.6}

            arcDashGap={2}

            arcDashAnimateTime={1000}
          />

        </div>

        {/* HOVERED NODE DISPLAY */}
        {hoveredNode && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-slate-950/90 border border-cyan-500/40 px-4 py-2 rounded font-mono text-xs tracking-wider text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            NODE VECTOR SCANNING:{' '}
            {hoveredNode.toUpperCase()}
          </div>
        )}

        {/* BOTTOM METRIC TOOLBAR MATRIX */}
        <div className="w-full border-t border-cyan-500/20 bg-black/40 p-4 backdrop-blur-md flex items-center justify-between">

          <span className="text-xs font-mono tracking-widest text-cyan-400/60">
            SYSTEM STATUS: ACTIVE
          </span>

          <div className="flex items-center gap-2">

            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00ffff]" />

            <span className="text-xs font-mono text-cyan-400">
              NODE_OK
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}