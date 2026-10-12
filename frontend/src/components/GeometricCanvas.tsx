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

const CYAN = "0,245,255";

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
      ctx.clearRect(0, 0, w, h);

      if (Math.random() > .96) {
        pulses.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0,
          a: .35,
        });
      }

      for (const p of pulses) {
        p.r += 1.5;
        p.a *= .985;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${CYAN},${p.a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      pulses = pulses.filter((p) => p.a > .01);

      for (const n of nodes) {

        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {

        for (let j = i + 1; j < nodes.length; j++) {

          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;

          const d = Math.hypot(dx, dy);

          if (d < 170) {

            const a = (1 - d / 170) * .45;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            ctx.strokeStyle = `rgba(${CYAN},${a})`;
            ctx.lineWidth = 1;

            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {

        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);

        ctx.fillStyle = "#00F5FF";

        ctx.shadowBlur = 18;
        ctx.shadowColor = "#00F5FF";

        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, 10, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(0,245,255,.10)";

        ctx.fill();
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
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
    />
  );
}