import { Html } from "@react-three/drei";

const panelStyle = {
  width: "190px",
  padding: "9px 12px",
  border: "1px solid rgba(0,245,255,.48)",
  borderRadius: "5px",
  background: "rgba(1,10,20,.88)",
  color: "#9ffcff",
  fontFamily: 'Consolas, "Courier New", monospace',
  boxShadow:
    "0 0 16px rgba(0,245,255,.12), inset 0 0 10px rgba(0,245,255,.05)",
  pointerEvents: "none" as const,
};

const titleStyle = {
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: ".14em",
  color: "#8fa7bb",
  marginBottom: "4px",
  whiteSpace: "nowrap" as const,
};

const valueStyle = {
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: ".02em",
  color: "#66f7ff",
  lineHeight: "1.2",
  whiteSpace: "nowrap" as const,
};

const detailStyle = {
  fontSize: "8px",
  color: "#7d91a6",
  marginTop: "3px",
  whiteSpace: "nowrap" as const,
};

interface FormulaBoxProps {
  position: [number, number, number];
  title: string;
  value: string;
  detail: string;
}

function FormulaBox({
  position,
  title,
  value,
  detail,
}: FormulaBoxProps) {
  return (
    <Html
      position={position}
      center
      transform={false}
      distanceFactor={8}
      style={{ pointerEvents: "none" }}
    >
      <div style={panelStyle}>
        <div style={titleStyle}>{title}</div>
        <div style={valueStyle}>{value}</div>
        <div style={detailStyle}>{detail}</div>
      </div>
    </Html>
  );
}

export default function FormulaOverlay() {
  return (
    <>
      {/* LEFT SIDE */}

      <FormulaBox
        position={[-3.15, 0.72, 0]}
        title="GEOMETRIC ANALYSIS"
        value="Shape → Ratio → Relation"
        detail="Structural Pattern Analysis"
      />

      <FormulaBox
        position={[-3.15, 0.02, 0]}
        title="HARMONIC GEOMETRY"
        value="φ • π • Fibonacci"
        detail="Proportional Relationships"
      />

      <FormulaBox
        position={[-3.15, -0.68, 0]}
        title="PATTERN RECURRENCE"
        value="Pₙ → Pₙ₊₁ → Pₙ₊₂"
        detail="Recurring Geometric Structure"
      />

      {/* RIGHT SIDE */}

      <FormulaBox
        position={[3.15, 0.72, 0]}
        title="SPATIAL MAPPING"
        value="(r, θ, φ) ∈ ℝ³"
        detail="Coordinate Relationship Model"
      />

      <FormulaBox
        position={[3.15, 0.02, 0]}
        title="FREQUENCY ANALYSIS"
        value="f ↔ λ ↔ Geometry"
        detail="Harmonic Pattern Correlation"
      />

      <FormulaBox
        position={[3.15, -0.68, 0]}
        title="TRACE VERIFICATION"
        value="Input → DAG → Result"
        detail="Verifiable Reasoning Trace"
      />
    </>
  );
}