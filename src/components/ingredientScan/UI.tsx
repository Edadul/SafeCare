import type { ReactNode } from "react";

export const COLORS = {
  bg: "#0A0C10",
  surface: "#111318",
  card: "#161B22",
  border: "#21262D",
  accent: "#58A6FF",
  accentGlow: "#388BFD",
  green: "#3FB950",
  yellow: "#D29922",
  red: "#F85149",
  purple: "#BC8CFF",
  text: "#E6EDF3",
  muted: "#7D8590",
} as const;

interface RiskBarProps {
  value: number;
  label?: string;
  animated?: boolean;
}

export function RiskBar({ value, label, animated = true }: RiskBarProps) {
  const color =
    value >= 0.7 ? COLORS.red : value >= 0.45 ? COLORS.yellow : COLORS.green;

  const barStyle = {
    width: `${value * 100}%`,
    height: "100%",
    background: `linear-gradient(90deg, ${color}88, ${color})`,
    borderRadius: 4,
    transition: animated ? "width 0.8s cubic-bezier(0.4,0,0.2,1)" : "none",
    boxShadow: `0 0 8px ${color}55`,
  } as const;

  return (
    <div style={{ marginBottom: 6 }}>
      {label && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              color: COLORS.muted,
              fontSize: 11,
              fontFamily: "monospace",
            }}
          >
            {label}
          </span>
          <span
            style={{
              color,
              fontSize: 11,
              fontFamily: "monospace",
              fontWeight: 700,
            }}
          >
            {(value * 100).toFixed(1)}%
          </span>
        </div>
      )}
      <div
        style={{
          background: COLORS.border,
          borderRadius: 4,
          height: 6,
          overflow: "hidden",
        }}
      >
        <div style={barStyle} />
      </div>
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  color: string;
}

export function Badge({ children, color }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 10,
        fontFamily: "monospace",
        fontWeight: 700,
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const color =
    score >= 7 ? COLORS.red : score >= 4 ? COLORS.yellow : COLORS.green;
  const label = score >= 7 ? "ALTO" : score >= 4 ? "MODERADO" : "BAJO";
  const circ = Math.PI * 64;
  const dash = (score / 10) * circ;

  return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <svg width="160" height="90" viewBox="0 0 160 90">
        <path
          d="M 16 80 A 64 64 0 0 1 144 80"
          fill="none"
          stroke={COLORS.border}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 16 80 A 64 64 0 0 1 144 80"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
            transition: "stroke-dasharray 1s ease",
          }}
        />
        <text
          x="80"
          y="72"
          textAnchor="middle"
          fill={color}
          fontSize="26"
          fontFamily="monospace"
          fontWeight="700"
        >
          {score.toFixed(0)}
        </text>
      </svg>
      <div
        style={{
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 13,
          color,
          letterSpacing: "0.12em",
          marginTop: -8,
        }}
      >
        RIESGO {label}
      </div>
    </div>
  );
}

interface TagProps {
  children: ReactNode;
  onClick: () => void;
}

export function Tag({ children, onClick }: TagProps) {
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 10px",
        borderRadius: 20,
        fontSize: 12,
        background: COLORS.border,
        color: COLORS.muted,
        margin: "3px",
        cursor: "pointer",
        fontFamily: "monospace",
      }}
    >
      {children}
    </span>
  );
}
