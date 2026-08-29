"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { 
  Building2, 
  Map, 
  Binary, 
  Cpu, 
  Globe, 
  Layers, 
  Activity, 
  Zap, 
  Maximize2, 
  ShieldAlert, 
  Radio, 
  Grid, 
  RefreshCw, 
  Lock 
} from "lucide-react";

// --- 3D GLOBE ENGINE COMPONENTS ---
function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial 
          color="#10b981" 
          transparent={true} 
          opacity={0.15} 
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.22, 24, 24]} />
        <meshBasicMaterial 
          color="#00f0ff" 
          wireframe={true} 
          transparent={true} 
          opacity={0.4} 
        />
      </mesh>
      <ConnectingArcs />
    </group>
  );
}

function ConnectingArcs() {
  const groupRef = useRef<THREE.Group>(null);

  const pairs = [
    { start: [0, 2.2, 0], end: [1.5, -1.2, 1.2], color: "#00f0ff" },
    { start: [-1.5, 1.2, 1.2], end: [1.8, 1.0, -1.0], color: "#a855f7" },
    { start: [0, -2.2, 0], end: [-1.2, 1.5, -1.2], color: "#eab308" },
    { start: [1.8, 0, 1.2], end: [-1.8, 0, -1.2], color: "#00f0ff" },
    { start: [-1.0, -1.5, 1.2], end: [1.0, 1.5, -1.2], color: "#10b981" }
  ];

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {pairs.map((pair, idx) => {
        const startVec = new THREE.Vector3(...pair.start);
        const endVec = new THREE.Vector3(...pair.end);
        
        const midVec = new THREE.Vector3()
          .addVectors(startVec, endVec)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(3.2);

        const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
        const points = curve.getPoints(30);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <group key={idx}>
            <line geometry={geometry}>
              <lineBasicMaterial color={pair.color} transparent opacity={0.8} />
            </line>
            <mesh position={[midVec.x, midVec.y, midVec.z]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color={pair.color} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// --- MAIN INTERFACE PANEL COMPONENTS ---
export default function GieDashboard() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/Chicago"
      };
      setTime(now.toLocaleTimeString("en-US", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-[#01040f] text-slate-200 font-mono flex flex-col p-2 select-none overflow-hidden justify-between">
      
      {/* 1. TOP HEADER FRAMEWORK */}
      <header className="w-full flex items-center justify-between border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(0,240,255,0.15)]">
        <div className="flex items-center gap-3">
          <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <div className="text-[9px] tracking-wider text-cyan-500/70">
            [ SECURE_SYSTEM_NODE_ONLINE ]
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-lg font-black text-cyan-400 tracking-[0.25em] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
            G I E
          </h1>
          <p className="text-[7.5px] text-cyan-300/60 uppercase tracking-[0.4em] mt-0.5">
            Geometric Intelligence Engine / Written Through Mathematics
          </p>
        </div>

        <div>
          <button className="flex items-center gap-1.5 border border-emerald-500 text-emerald-400 bg-emerald-950/30 hover:bg-emerald-500 hover:text-black transition-all duration-300 text-[9px] px-2.5 py-0.5 font-bold uppercase tracking-wider rounded shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <Zap className="h-2.5 w-2.5" />
            Launch Engine
          </button>
        </div>
      </header>

      {/* SUB HEADER NAV MENU */}
      <div className="w-full flex justify-center gap-5 text-[8.5px] tracking-[0.15em] font-bold text-cyan-400/70 border-b border-cyan-500/10 py-0.5">
        <span className="text-cyan-400 border-b border-cyan-400 pb-0.5 cursor-pointer">HOME</span>
        <span className="hover:text-cyan-400 transition-colors cursor-pointer">ENGINE</span>
        <span className="hover:text-cyan-400 transition-colors cursor-pointer">PROJECTS</span>
        <span className="hover:text-cyan-400 transition-colors cursor-pointer">BLUEPRINT LIBRARY</span>
        <span className="hover:text-cyan-400 transition-colors cursor-pointer">RESEARCH</span>
        <span className="hover:text-cyan-400 transition-colors cursor-pointer">DOCUMENTATION</span>
        <span className="hover:text-cyan-400 transition-colors cursor-pointer">PUBLIC ACTIVITY</span>
      </div>

      {/* 2. BODY LAYOUT */}
      <div className="flex flex-1 w-full gap-2 items-stretch my-1.5 min-h-0 overflow-hidden">
        
        {/* LEFT COMPACT VERTICAL SIDEBAR */}
        <div className="flex flex-col justify-start items-center gap-2.5 w-9 border border-cyan-500/20 bg-cyan-950/10 rounded-md p-1 py-2.5 shrink-0">
          <button className="p-1 bg-cyan-500/20 border border-cyan-400 text-cyan-300 rounded"><Globe className="h-3.5 w-3.5" /></button>
          <button className="p-1 hover:bg-cyan-500/10 text-cyan-500/40 hover:text-cyan-400 transition-all rounded"><Layers className="h-3.5 w-3.5" /></button>
          <button className="p-1 hover:bg-cyan-500/10 text-cyan-500/40 hover:text-cyan-400 transition-all rounded"><Radio className="h-3.5 w-3.5" /></button>
          <button className="p-1 hover:bg-cyan-500/10 text-cyan-500/40 hover:text-cyan-400 transition-all rounded"><Grid className="h-3.5 w-3.5" /></button>
          <button className="p-1 hover:bg-cyan-500/10 text-cyan-500/40 hover:text-cyan-400 transition-all rounded"><Lock className="h-3.5 w-3.5" /></button>
          <button className="p-1 hover:bg-cyan-500/10 text-cyan-500/40 hover:text-cyan-400 transition-all rounded"><RefreshCw className="h-3.5 w-3.5" /></button>
        </div>

        {/* LEFT HUD INTERACTIVE DATA CARDS */}
        <div className="w-[230px] flex flex-col gap-2 justify-between shrink-0 min-h-0">
          
          <div className="flex-1 border border-cyan-400 bg-[#000514]/80 p-1.5 rounded-sm shadow-[0_0_10px_rgba(0,240,255,0.15)] flex flex-col justify-between min-h-0">
            <div className="flex justify-between items-start border-b border-cyan-500/20 pb-0.5">
              <div>
                <span className="text-[7.5px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 px-1 py-0.2 mr-1 rounded-sm font-bold">01</span>
                <span className="text-[9px] font-bold text-cyan-300 tracking-wider">ARCHITECTURAL BLUEPRINT</span>
              </div>
              <Maximize2 className="h-2 w-2 text-cyan-400/70 cursor-pointer hover:text-cyan-300" />
            </div>
            <div className="flex items-center justify-center border border-cyan-500/5 bg-cyan-950/5 rounded-sm p-0.5 min-h-0">
              <Building2 className="h-6 w-6 text-cyan-500/20" />
            </div>
            <div className="text-[7.5px] uppercase tracking-wider text-cyan-400/40 font-bold border-t border-cyan-500/10 pt-0.5">
              STATUS // MATRIX_READY
            </div>
          </div>

          <div className="flex-1 border border-cyan-400 bg-[#000514]/80 p-1.5 rounded-sm shadow-[0_0_10px_rgba(0,240,255,0.15)] flex flex-col justify-between min-h-0">
            <div className="flex justify-between items-start border-b border-cyan-500/20 pb-0.5">
              <div>
                <span className="text-[7.5px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 px-1 py-0.2 mr-1 rounded-sm font-bold">02</span>
                <span className="text-[9px] font-bold text-cyan-300 tracking-wider">CITY / INFRASTRUCTURE</span>
              </div>
              <Maximize2 className="h-2 w-2 text-cyan-400/70 cursor-pointer hover:text-cyan-300" />
            </div>
            <div className="flex items-center justify-center border border-cyan-500/5 bg-cyan-950/5 rounded-sm p-0.5 min-h-0">
              <Map className="h-6 w-6 text-cyan-500/20" />
            </div>
            <div className="text-[7.5px] uppercase tracking-wider text-cyan-400/40 font-bold border-t border-cyan-500/10 pt-0.5">
              STATUS // INFRASTRUCTURE_MAPPED
            </div>
          </div>

          <div className="flex-1 border border-cyan-400 bg-[#000514]/80 p-1.5 rounded-sm shadow-[0_0_10px_rgba(0,240,255,0.15)] flex flex-col justify-between min-h-0">
            <div className="flex justify-between items-start border-b border-cyan-500/20 pb-0.5">
              <div>
                <span className="text-[7.5px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 px-1 py-0.2 mr-1 rounded-sm font-bold">03</span>
                <span className="text-[9px] font-bold text-cyan-300 tracking-wider">CROP-CIRCLE SITE ANALYSIS</span>
              </div>
              <Maximize2 className="h-2 w-2 text-cyan-400/70 cursor-pointer hover:text-cyan-300" />
            </div>
