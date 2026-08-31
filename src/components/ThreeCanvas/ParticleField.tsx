import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Custom shader for dynamic, crackling electric lightning paths
const LightningShader = {
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying float vNoise;
    
    // Simple 3D Noise function for lightning jaggedness
    float hash(vec3 p) {
      p = fract(p * 0.1031);
      p += dot(p, p.yzx + 33.33);
      return fract((p.x + p.y) * p.z);
    }
    float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f*f*(3.0-2.0*f);
      return mix(mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)),f.x),
                     mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)),f.x),f.y),
                 mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)),f.x),
                     mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)),f.x),f.y),f.z);
    }

    void main() {
      vUv = uv;
      // Generate sharp electrical crackle along the arc length
      vec3 pos = position;
      float crackle = noise(vec3(pos.xy * 8.0, uTime * 12.0));
      if(uv.x > 0.0 && uv.x < 1.0) {
        pos += normal * crackle * 0.12; // Static displacement
      }
      vNoise = crackle;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uTime;
    varying vec2 vUv;
    varying float vNoise;

    void main() {
      // Create core high-intensity glow and outer electrical arc falloff
      float intensity = pow(1.0 - abs(vUv.y - 0.5) * 2.0, 4.0);
      float flash = step(0.4, sin(uTime * 25.0 + vNoise * 10.0)); // Rapid static blinking
      
      vec3 finalColor = mix(uColor, vec3(1.0, 1.0, 1.0), intensity * 0.6);
      gl_FragColor = vec4(finalColor, intensity * (0.7 + flash * 0.3));
    }
  `
};

export const ParticleField: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // High-performance static parameters computed once
  const lightningArcs = useMemo(() => {
    const arcs = [];
    const colorOptions = [
      new THREE.Color('#00f3ff'), // Electric Cyan
      new THREE.Color('#00ff66'), // Active Green
      new THREE.Color('#7000ff')  // High-Voltage Purple
    ];

    // Generate 10 lightning paths hugging the earth sphere parameters
    for (let i = 0; i < 10; i++) {
      const points = [];
      const radius = 5.0; // Fixed baseline globe reference radius
      
      // Calculate start/end nodes on the sphere surface
      const phi1 = Math.random() * Math.PI;
      const theta1 = Math.random() * 2 * Math.PI;
      const phi2 = Math.random() * Math.PI;
      const theta2 = Math.random() * 2 * Math.PI;

      const p1 = new THREE.Vector3().setFromSphericalCoords(radius, phi1, theta1);
      const p2 = new THREE.Vector3().setFromSphericalCoords(radius, phi2, theta2);

      // Interpolate arc segments hugging the spherical curve
      const segments = 32;
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const p = new THREE.Vector3().lerpVectors(p1, p2, t).normalize().multiplyScalar(radius);
        points.push(p);
      }

      const geometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        64,   // Tubular segments
        0.02, // Wire radius thickness
        4,    // Radial segments (low poly to save laptop RAM)
        false
      );

      arcs.push({ geometry, color: colorOptions[i % colorOptions.length] });
    }
    return arcs;
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group ref={groupRef} name="gie-lightning-network-wrap" style={{ width: '100%', height: '100%', display: 'flex' }}>
      {lightningArcs.map((arc, index) => (
        <mesh key={index} geometry={arc.geometry}>
          <shaderMaterial
            ref={materialRef}
            attach="material"
            transparent
            blending={THREE.AdditiveBlending}
            uniforms={{
              uTime: { value: 0 },
              uColor: { value: arc.color }
            }}
            vertexShader={LightningShader.vertexShader}
            fragmentShader={LightningShader.fragmentShader}
          />
        </mesh>
      ))}
    </group>
  );
};
