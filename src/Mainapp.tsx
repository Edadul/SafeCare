import { useState, useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import "./components/ingredientScan/ingredientScan.css";
import {
  RiskBar,
  Badge,
  ScoreGauge,
  Tag,
  COLORS,
} from "./components/ingredientScan/UI";
import {
  type TabId,
  type IReport,
  type ReportDto,
  Profile,
} from "./domain/ingredientScan/types";
import { INGREDIENT_DB } from "./domain/ingredientScan/engine";

// ─── Main App ─────────────────────────────────────────────────────
export default function MainApp() {
  const [perfil, setPerfil] = useState<Profile>(Profile.NORMAL);
  const [inputText, setInputText] = useState<string>("");
  const [ingredientes, setIngredientes] = useState<string[]>([]);
  const [report, setReport] = useState<IReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>("analisis");
  const reportRef = useRef<HTMLDivElement>(null);

  const SUGERENCIAS = Object.keys(INGREDIENT_DB);

  async function handleSend() {
    setLoading(true);
    await getReport({
      profile: perfil,
      ingredients: ingredientes.map((i) => ({ name: i })),
    });
    setLoading(false);
    setActiveTab("reporte");
  }

  async function getReport(ReportDto: ReportDto) {
    const response = await fetch("http://localhost:3000/risk-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ReportDto),
    });
    const data: IReport = await response.json();
    console.log(data);

    setReport(data);
    return data;
  }

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

  function reset(): void {
    setReport(null);
    setIngredientes([]);
    setInputText("");
    setActiveTab("analisis");
  }

  interface PerfilOption {
    id: Profile;
    label: string;
    desc: string;
    icon: string;
  }

  const perfilOptions: PerfilOption[] = [
    {
      id: Profile.NORMAL,
      label: "Perfil Normal",
      desc: "Adultos sin condiciones especiales",
      icon: "◉",
    },
    {
      id: Profile.SENSITIVE,
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
    <div className="ingredient-scan-root">
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
              onClick={handleSend}
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
                  REPORTE GENERADO ·{" "}
                  {new Date(report.consultedAt).toLocaleString("es-ES", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: COLORS.muted,
                    marginBottom: 4,
                  }}
                >
                  {/* {Here can be something interesting} */}
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
                    color={
                      perfil === Profile.SENSITIVE ? COLORS.red : COLORS.green
                    }
                  >
                    {report.profile}
                  </Badge>
                  &nbsp;·&nbsp;Ingredientes analizados:{" "}
                  <span style={{ color: COLORS.text }}>
                    {report.ingredients.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {report.result.warnings.length === 0 ? (
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
                    report.result.warnings.map((a, i) => (
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
              <ScoreGauge score={report.result.finalScore} />
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
                  {report.ingredients.map((d, i) => (
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
                        {d.name}
                      </td>
                      <td style={{ padding: "12px 16px", minWidth: 160 }}>
                        <RiskBar value={d.riskLevelDB / 10} />
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{ display: "flex", gap: 4, flexWrap: "wrap" }}
                        >
                          {d.scientificSource.length > 0 ? (
                            d.scientificSource.split(",").map((f) => (
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
