import { useEffect, useRef } from "react";

interface Vertex {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Pulse {
  x: number;
  y: number;
  r: number;
  a: number;
}

const CYAN = "6,182,212"; // Enhanced neon cyan palette marker for intense glow

export default function GeometricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let animation = 0;
    let nodes: Vertex[] = [];
    let pulses: Pulse[] = [];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(
        30,
        Math.floor((w * h) / 14000)
      );
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - .5) * .35,
          vy: (Math.random() - .5) * .35,
        });
      }
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      // Create dark, deep void clearing path
      ctx.clearRect(0, 0, w, h);

      // Trigger quantum blueprint data pulse
      if (Math.random() > .96) {
        pulses.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0,
          a: .45,
        });
      }

      // Render expanding neon blueprint ripples
      ctx.save();
      for (const p of pulses) {
        p.r += 1.5;
        p.a *= .985;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${CYAN},${p.a})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${CYAN},${p.a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
      
      pulses = pulses.filter((p) => p.a > .01);

      // Update node path trajectories
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // Draw high-tech vector alignment links
      ctx.save();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);

          if (d < 170) {
            const a = (1 - d / 170) * .35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${CYAN},${a})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Render glowing coordinate network points
      for (const n of nodes) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#22d3ee";
        ctx.shadowBlur = 14;
        ctx.shadowColor = "#06b6d4";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(6,182,212,0.08)";
        ctx.fill();
        ctx.restore();
      }

      animation = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animation);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
  );
}
