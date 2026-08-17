// worldTexture.ts
import * as THREE from 'three';

export function createWorldTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return new THREE.Texture();

  // 1. Fill Oceans
  ctx.fillStyle = '#0a1128';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Procedural Continents (Stylized High-Tech Grid/Noise)
  ctx.fillStyle = '#1c3d5a';
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 50 + Math.random() * 150;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Geographic Grid Layer (Latitude & Longitude lines)
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
  ctx.lineWidth = 1;
  
  // Draw Longitude Lines
  for (let x = 0; x < canvas.width; x += canvas.width / 18) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  // Draw Latitude Lines
  for (let y = 0; y < canvas.height; y += canvas.height / 9) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
