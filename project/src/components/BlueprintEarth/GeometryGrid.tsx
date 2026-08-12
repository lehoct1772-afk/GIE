import { Html } from "@react-three/drei";

const panelStyle = {
  padding: "8px 12px",
  border: "1px solid rgba(0,245,255,.65)",
  borderRadius: "6px",
  background: "rgba(0,12,20,.82)",
  color: "#9ffcff",
  fontFamily:
    'Consolas, "Courier New", monospace',
  fontSize: "11px",
  lineHeight: "1.4",
  whiteSpace: "nowrap" as const,
  boxShadow:
    "0 0 18px rgba(0,245,255,.25), inset 0 0 12px rgba(0,245,255,.08)",
};

export default function FormulaOverlay() {
  return (
    <>
      <Html position={[-1.65, 0.95, 0]} center>
        <div style={panelStyle}>
          <b style={{ color: "#00F5FF" }}>EARTH GRID</b>
          <br />
          Latitude / Longitude
          <br />
          φ • θ • r
        </div>
      </Html>

      <Html position={[1.65, 0.82, 0]} center>
        <div style={panelStyle}>
          <b style={{ color: "#66FFFF" }}>GOLDEN RATIO</b>
          <br />
          φ = 1.61803398875
          <br />
          Fibonacci Harmonics
        </div>
      </Html>

      <Html position={[-1.65, -0.15, 0]} center>
        <div style={panelStyle}>
          <b style={{ color: "#7AFFD7" }}>GEOMETRIC ENGINE</b>
          <br />
          Euclidean Space
          <br />
          x • y • z
        </div>
      </Html>

      <Html position={[1.65, -0.32, 0]} center>
        <div style={panelStyle}>
          <b style={{ color: "#FFD54A" }}>FREQUENCY</b>
          <br />
          λ = c / f
          <br />
          Harmonic Resonance
        </div>
      </Html>

      <Html position={[0, 1.55, 0]} center>
        <div
          style={{
            color: "#00F5FF",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "3px",
            textShadow: "0 0 18px #00F5FF",
            fontFamily: "Arial",
          }}
        >
          G I E
        </div>
      </Html>
    </>
  );
}