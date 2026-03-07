import { useState, useRef } from "react";
import type { ReactNode, KeyboardEvent, MouseEvent } from "react";

// ─── Palette & Theme ──────────────────────────────────────────────
const COLORS = {
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

// ─── Types ────────────────────────────────────────────────────────
type Perfil = "normal" | "sensible";
type TabId = "analisis" | "reporte";
type NivelRiesgo = "ALTO" | "MODERADO" | "BAJO";

interface IngredientRecord {
  riskLevel: number;
  category: string;
  sources: string[];
}

interface ProxyResult extends IngredientRecord {
  fromCache: boolean;
}

interface ChainResult {
  finalScore: number;
  alerts: string[];
}

interface IngredienteDetalle {
  nombre: string;
  riskBruto: number;
  riskAjustado: number;
  categoria: string;
  fuentes: string[];
  fromCache: boolean;
}

interface Report {
  id: string;
  fecha: string;
  perfil: Perfil;
  ingredientes: string[];
  detalles: IngredienteDetalle[];
  chain: ChainResult;
  puntajeFinal: number;
  nivelRiesgo: NivelRiesgo;
}

interface BuildReportParams {
  ingredientes: string[];
  perfil: Perfil;
  proxyResults: ProxyResult[];
  adjustedRisks: number[];
  chain: ChainResult;
}

// ─── Mock DB ──────────────────────────────────────────────────────
const INGREDIENT_DB: Record<string, IngredientRecord> = {
  parabenos: {
    riskLevel: 0.72,
    category: "conservante",
    sources: ["FDA", "EFSA"],
  },
  "bisfenol-a": { riskLevel: 0.91, category: "plástico", sources: ["WHO"] },
  cafeína: { riskLevel: 0.35, category: "estimulante", sources: ["EFSA"] },
  retinol: { riskLevel: 0.55, category: "vitamina", sources: ["EMA"] },
  ácido_ascórbico: { riskLevel: 0.08, category: "vitamina", sources: ["EFSA"] },
  ftalatos: { riskLevel: 0.83, category: "plastificante", sources: ["EPA"] },
  glutamato: { riskLevel: 0.28, category: "potenciador", sources: ["FDA"] },
  mercurio: {
    riskLevel: 0.97,
    category: "metales pesados",
    sources: ["WHO", "EPA"],
  },
  alcohol_etílico: { riskLevel: 0.42, category: "solvente", sources: ["FDA"] },
  colorante_rojo40: {
    riskLevel: 0.61,
    category: "colorante",
    sources: ["EFSA"],
  },
  aspartamo: {
    riskLevel: 0.44,
    category: "edulcorante",
    sources: ["EFSA", "FDA"],
  },
  plomo: { riskLevel: 0.95, category: "metales pesados", sources: ["WHO"] },
};

// ─── Proxy ────────────────────────────────────────────────────────
const proxyCache = new Map<string, IngredientRecord>();

function proxyConsulta(ingrediente: string): ProxyResult {
  const key = ingrediente.toLowerCase().replace(/\s+/g, "_");
  if (proxyCache.has(key)) {
    return { ...proxyCache.get(key)!, fromCache: true };
  }
  const result: IngredientRecord = INGREDIENT_DB[key] ?? {
    riskLevel: 0.5,
    category: "desconocido",
    sources: [],
  };
  proxyCache.set(key, result);
  return { ...result, fromCache: false };
}

// ─── Strategy ─────────────────────────────────────────────────────
const strategies: Record<Perfil, (rawRisk: number) => number> = {
  sensible: (rawRisk) => Math.min(1, rawRisk * 1.45),
  normal: (rawRisk) => rawRisk,
};

function applyStrategy(rawRisk: number, perfil: Perfil): number {
  return strategies[perfil](rawRisk);
}

// ─── Chain of Responsibility ──────────────────────────────────────
function chainOfResponsibility(adjustedRisks: number[]): ChainResult {
  let score = 0;
  const alerts: string[] = [];

  const avg = adjustedRisks.reduce((a, b) => a + b, 0) / adjustedRisks.length;
  score += avg * 50;

  const highRisk = adjustedRisks.filter((r) => r >= 0.65).length;
  if (highRisk >= 3) {
    score += 20;
    alerts.push("⚠ Alta acumulación de ingredientes riesgosos");
  } else if (highRisk >= 1) {
    score += 10;
    alerts.push("◎ Presencia de ingredientes con riesgo moderado-alto");
  }

  const maxRisk = Math.max(...adjustedRisks);
  if (maxRisk >= 0.9) {
    score += 25;
    alerts.push("✕ Ingrediente crítico detectado");
  }

  return { finalScore: Math.min(100, score), alerts };
}

// ─── Builder ─────────────────────────────────────────────────────
function buildReport({
  ingredientes,
  perfil,
  proxyResults,
  adjustedRisks,
  chain,
}: BuildReportParams): Report {
  const nivelRiesgo: NivelRiesgo =
    chain.finalScore >= 70
      ? "ALTO"
      : chain.finalScore >= 40
        ? "MODERADO"
        : "BAJO";

  return {
    id: `RPT-${Date.now()}`,
    fecha: new Date().toLocaleString("es-CO"),
    perfil,
    ingredientes,
    detalles: ingredientes.map((ing, i) => ({
      nombre: ing,
      riskBruto: proxyResults[i].riskLevel,
      riskAjustado: adjustedRisks[i],
      categoria: proxyResults[i].category,
      fuentes: proxyResults[i].sources,
      fromCache: proxyResults[i].fromCache,
    })),
    chain,
    puntajeFinal: chain.finalScore,
    nivelRiesgo,
  };
}

// ─── UI Components ────────────────────────────────────────────────

interface RiskBarProps {
  value: number;
  label?: string;
  animated?: boolean;
}

function RiskBar({ value, label, animated = true }: RiskBarProps) {
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

function Badge({ children, color }: BadgeProps) {
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

function ScoreGauge({ score }: ScoreGaugeProps) {
  const color =
    score >= 70 ? COLORS.red : score >= 40 ? COLORS.yellow : COLORS.green;
  const label = score >= 70 ? "ALTO" : score >= 40 ? "MODERADO" : "BAJO";
  const circ = Math.PI * 54;
  const dash = (score / 100) * circ;

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

function Tag({ children, onClick }: TagProps) {
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

// ─── Main App ─────────────────────────────────────────────────────
export default function MainApp() {
  const [perfil, setPerfil] = useState<Perfil>("normal");
  const [inputText, setInputText] = useState<string>("");
  const [ingredientes, setIngredientes] = useState<string[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>("analisis");
  const reportRef = useRef<HTMLDivElement>(null);

  const SUGERENCIAS = Object.keys(INGREDIENT_DB);

  function addIngrediente(nombre: string): void {
    const n = nombre.trim().toLowerCase().replace(/\s+/g, "_");
    if (n && !ingredientes.includes(n)) {
      setIngredientes((prev) => [...prev, n]);
    }
    setInputText("");
  }

  function removeIngrediente(n: string): void {
    setIngredientes((prev) => prev.filter((i) => i !== n));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter" && inputText.trim()) {
      addIngrediente(inputText);
    }
  }

  async function analizar(): Promise<void> {
    if (ingredientes.length === 0) return;
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 900));

    const proxyResults: ProxyResult[] = ingredientes.map(proxyConsulta);
    const adjustedRisks: number[] = proxyResults.map((r) =>
      applyStrategy(r.riskLevel, perfil),
    );
    const chain = chainOfResponsibility(adjustedRisks);
    const rpt = buildReport({
      ingredientes,
      perfil,
      proxyResults,
      adjustedRisks,
      chain,
    });

    setReport(rpt);
    setLoading(false);
    setActiveTab("reporte");
    setTimeout(
      () => reportRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  }

  function reset(): void {
    setReport(null);
    setIngredientes([]);
    setInputText("");
    setActiveTab("analisis");
  }

  interface PerfilOption {
    id: Perfil;
    label: string;
    desc: string;
    icon: string;
  }

  const perfilOptions: PerfilOption[] = [
    {
      id: "normal",
      label: "Perfil Normal",
      desc: "Adultos sin condiciones especiales",
      icon: "◉",
    },
    {
      id: "sensible",
      label: "Perfil Sensible",
      desc: "Jóvenes 10-16 años · Mujeres gestantes · Alteraciones hormonales",
      icon: "◈",
    },
  ];

  interface TabOption {
    id: TabId;
    label: string;
    disabled: boolean;
  }

  const tabOptions: TabOption[] = [
    { id: "analisis", label: "① Consulta", disabled: false },
    { id: "reporte", label: "② Reporte", disabled: !report },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        padding: "0",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(12px)",
          background: `${COLORS.surface}cc`,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ⬡
          </div>
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.04em" }}
            >
              IngredientScan
            </div>
            <div
              style={{
                fontSize: 10,
                color: COLORS.muted,
                letterSpacing: "0.08em",
              }}
            >
              ANALIZADOR DE RIESGO · v2.4
            </div>
          </div>
        </div>
        <div
          style={{ fontSize: 11, color: COLORS.muted, letterSpacing: "0.08em" }}
        >
          Análisis de ingredientes · Base científica
        </div>
      </header>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "0 32px",
          background: COLORS.surface,
        }}
      >
        {tabOptions.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            style={{
              padding: "12px 20px",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === tab.id
                  ? `2px solid ${COLORS.accent}`
                  : "2px solid transparent",
              color: tab.disabled
                ? COLORS.border
                : activeTab === tab.id
                  ? COLORS.accent
                  : COLORS.muted,
              cursor: tab.disabled ? "not-allowed" : "pointer",
              fontSize: 12,
              fontFamily: "monospace",
              fontWeight: 600,
              letterSpacing: "0.05em",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        {/* ── TAB: Consulta ── */}
        {activeTab === "analisis" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            {/* Selección de perfil */}
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                ¿Cuál es tu perfil?
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {perfilOptions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setPerfil(p.id)}
                    style={{
                      flex: 1,
                      padding: "16px 20px",
                      borderRadius: 10,
                      border: `2px solid ${perfil === p.id ? COLORS.accent : COLORS.border}`,
                      background:
                        perfil === p.id ? `${COLORS.accent}11` : COLORS.surface,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ marginBottom: 6, fontSize: 20 }}>
                      {p.icon}
                    </div>
                    <div
                      style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}
                    >
                      {p.label}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>
                      {p.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input ingredientes */}
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                Ingredientes del producto
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ej: parabenos, mercurio..."
                  style={{
                    flex: 1,
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: COLORS.text,
                    fontSize: 13,
                    fontFamily: "monospace",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => addIngrediente(inputText)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: "none",
                    background: COLORS.accent,
                    color: "#000",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>

              {/* Chips */}
              <div style={{ minHeight: 40, marginBottom: 12 }}>
                {ingredientes.length === 0 ? (
                  <div
                    style={{ color: COLORS.muted, fontSize: 12, paddingTop: 8 }}
                  >
                    Ningún ingrediente agregado aún...
                  </div>
                ) : (
                  ingredientes.map((ing) => (
                    <span
                      key={ing}
                      onClick={() => removeIngrediente(ing)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        background: `${COLORS.accent}22`,
                        border: `1px solid ${COLORS.accent}44`,
                        color: COLORS.accent,
                        margin: "3px",
                        cursor: "pointer",
                        fontFamily: "monospace",
                        fontWeight: 600,
                      }}
                    >
                      {ing}{" "}
                      <span style={{ opacity: 0.6, fontSize: 10 }}>✕</span>
                    </span>
                  ))
                )}
              </div>

              <div
                style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}
              >
                Sugerencias:
              </div>
              <div>
                {SUGERENCIAS.map((s) => (
                  <Tag key={s} onClick={() => addIngrediente(s)}>
                    {s}
                  </Tag>
                ))}
              </div>
            </div>

            {/* Botón analizar */}
            <button
              onClick={analizar}
              disabled={loading || ingredientes.length === 0}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 10,
                border: "none",
                background:
                  ingredientes.length === 0
                    ? COLORS.border
                    : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
                color: ingredientes.length === 0 ? COLORS.muted : "#000",
                fontWeight: 700,
                fontSize: 14,
                cursor: ingredientes.length === 0 ? "not-allowed" : "pointer",
                letterSpacing: "0.1em",
                fontFamily: "monospace",
                transition: "all 0.2s",
                boxShadow:
                  ingredientes.length > 0
                    ? `0 0 24px ${COLORS.accent}44`
                    : "none",
              }}
            >
              {loading ? "⟳ Analizando..." : "▶  Analizar producto"}
            </button>
          </div>
        )}

        {/* ── TAB: Reporte ── */}
        {activeTab === "reporte" && report && (
          <div
            ref={reportRef}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Header reporte */}
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 24,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 24,
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.muted,
                    letterSpacing: "0.1em",
                    marginBottom: 8,
                  }}
                >
                  REPORTE GENERADO · {report.fecha}
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: COLORS.muted,
                    marginBottom: 4,
                  }}
                >
                  ID: <span style={{ color: COLORS.accent }}>{report.id}</span>
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: COLORS.muted,
                    marginBottom: 12,
                  }}
                >
                  Perfil:{" "}
                  <Badge
                    color={perfil === "sensible" ? COLORS.red : COLORS.green}
                  >
                    {report.perfil}
                  </Badge>
                  &nbsp;·&nbsp;Ingredientes analizados:{" "}
                  <span style={{ color: COLORS.text }}>
                    {report.ingredientes.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {report.chain.alerts.length === 0 ? (
                    <div
                      style={{
                        fontSize: 11,
                        background: `${COLORS.green}22`,
                        border: `1px solid ${COLORS.green}44`,
                        color: COLORS.green,
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontFamily: "monospace",
                      }}
                    >
                      ✓ Sin alertas críticas detectadas
                    </div>
                  ) : (
                    report.chain.alerts.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: 11,
                          background: `${COLORS.yellow}22`,
                          border: `1px solid ${COLORS.yellow}44`,
                          color: COLORS.yellow,
                          borderRadius: 6,
                          padding: "4px 10px",
                          fontFamily: "monospace",
                        }}
                      >
                        {a}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <ScoreGauge score={report.puntajeFinal} />
            </div>

            {/* Tabla ingredientes */}
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${COLORS.border}`,
                  fontSize: 11,
                  color: COLORS.muted,
                  letterSpacing: "0.1em",
                }}
              >
                DETALLE POR INGREDIENTE
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    {(
                      [
                        "Ingrediente",
                        "Categoría",
                        "Nivel de Riesgo",
                        "Fuentes científicas",
                      ] as const
                    ).map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 16px",
                          textAlign: "left",
                          fontSize: 10,
                          color: COLORS.muted,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.detalles.map((d, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: `1px solid ${COLORS.border}`,
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e: MouseEvent<HTMLTableRowElement>) =>
                        (e.currentTarget.style.background = COLORS.surface)
                      }
                      onMouseLeave={(e: MouseEvent<HTMLTableRowElement>) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {d.nombre}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Badge color={COLORS.purple}>{d.categoria}</Badge>
                      </td>
                      <td style={{ padding: "12px 16px", minWidth: 160 }}>
                        <RiskBar value={d.riskAjustado} />
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{ display: "flex", gap: 4, flexWrap: "wrap" }}
                        >
                          {d.fuentes.length > 0 ? (
                            d.fuentes.map((f) => (
                              <Badge key={f} color={COLORS.muted}>
                                {f}
                              </Badge>
                            ))
                          ) : (
                            <span style={{ color: COLORS.muted, fontSize: 11 }}>
                              —
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={reset}
              style={{
                padding: "12px",
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
                background: "transparent",
                color: COLORS.muted,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "monospace",
              }}
            >
              ← Nuevo análisis
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
