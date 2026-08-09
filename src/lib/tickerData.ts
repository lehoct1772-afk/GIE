export interface TickerItem {
  label: string;
  value: string;
  category: string;
}

// All content is DEMO data until connected to live engine output.
export const TICKER_ITEMS: TickerItem[] = [
  { label: 'P', value: '(0.000, 0.000)', category: 'COORD' },
  { label: 'r', value: '12.500', category: 'RADIUS' },
  { label: 'd', value: '25.000', category: 'DIAMETER' },
  { label: 'θ', value: '45.00°', category: 'ANGLE' },
  { label: 'φ', value: '1.61803', category: 'RATIO' },
  { label: 'dist', value: '8.660', category: 'DISTANCE' },
  { label: 'sym', value: 'C6 order', category: 'SYMMETRY' },
  { label: 'Δ', value: 'equilateral', category: 'TRIANGLE' },
  { label: 'A', value: 'π·r² = 490.87', category: 'FORMULA' },
  { label: 'P', value: '(−4.2, 3.1)', category: 'COORD' },
  { label: '∠', value: '90.00°', category: 'ANGLE' },
  { label: 'ratio', value: '3:4:5', category: 'RATIO' },
  { label: 'spiral', value: 'logarithmic b=0.18', category: 'CURVE' },
  { label: 'arc', value: '60° · len 13.09', category: 'ARC' },
  { label: 'v', value: '6 · e=6 · f=12', category: 'POLYHEDRON' },
  { label: 'tess', value: 'hexagonal', category: 'TESSELLATION' },
  { label: 'rot', value: 'R(60°)', category: 'TRANSFORM' },
  { label: 'reflect', value: 'x = 0', category: 'TRANSFORM' },
  { label: 'scale', value: '×1.25', category: 'TRANSFORM' },
  { label: 'engine', value: 'idle · awaiting input', category: 'ACTIVITY' },
  { label: 'P', value: '(7.330, −2.110)', category: 'COORD' },
  { label: 'r', value: '5.000', category: 'RADIUS' },
  { label: 'θ', value: '120.00°', category: 'ANGLE' },
  { label: 'Δ', value: 'isoceles · a=b', category: 'TRIANGLE' },
  { label: 'sym', value: 'D2 order', category: 'SYMMETRY' },
  { label: 'A', value: '½·b·h = 18.75', category: 'FORMULA' },
  { label: 'intersect', value: '(2.04, 1.50)', category: 'INTERSECTION' },
  { label: 'ratio', value: '√2 : 1', category: 'RATIO' },
  { label: 'engine', value: 'mesh · 64 verts', category: 'ACTIVITY' },
  { label: 'arc', value: '180° · len 15.71', category: 'ARC' },
];
