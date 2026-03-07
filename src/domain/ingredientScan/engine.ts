import { type BuildReportParams, type ChainResult, type IngredientRecord, type Perfil, type ProxyResult, type Report } from "./types";

// Mock DB
export const INGREDIENT_DB: Record<string, IngredientRecord> = {
  parabenos: { riskLevel: 0.72, category: "conservante", sources: ["FDA", "EFSA"] },
  "bisfenol-a": { riskLevel: 0.91, category: "plástico", sources: ["WHO"] },
  cafeína: { riskLevel: 0.35, category: "estimulante", sources: ["EFSA"] },
  retinol: { riskLevel: 0.55, category: "vitamina", sources: ["EMA"] },
  ácido_ascórbico: { riskLevel: 0.08, category: "vitamina", sources: ["EFSA"] },
  ftalatos: { riskLevel: 0.83, category: "plastificante", sources: ["EPA"] },
  glutamato: { riskLevel: 0.28, category: "potenciador", sources: ["FDA"] },
  mercurio: { riskLevel: 0.97, category: "metales pesados", sources: ["WHO", "EPA"] },
  alcohol_etílico: { riskLevel: 0.42, category: "solvente", sources: ["FDA"] },
  colorante_rojo40: { riskLevel: 0.61, category: "colorante", sources: ["EFSA"] },
  aspartamo: { riskLevel: 0.44, category: "edulcorante", sources: ["EFSA", "FDA"] },
  plomo: { riskLevel: 0.95, category: "metales pesados", sources: ["WHO"] },
};

// Proxy
const proxyCache = new Map<string, IngredientRecord>();

export function proxyConsulta(ingrediente: string): ProxyResult {
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

// Strategy
const strategies: Record<Perfil, (rawRisk: number) => number> = {
  sensible: (rawRisk) => Math.min(1, rawRisk * 1.45),
  normal: (rawRisk) => rawRisk,
};

export function applyStrategy(rawRisk: number, perfil: Perfil): number {
  return strategies[perfil](rawRisk);
}

// Chain of Responsibility
export function chainOfResponsibility(adjustedRisks: number[]): ChainResult {
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

// Report builder
export function buildReport({ ingredientes, perfil, proxyResults, adjustedRisks, chain }: BuildReportParams): Report {
  const nivelRiesgo =
    chain.finalScore >= 70 ? "ALTO" : chain.finalScore >= 40 ? "MODERADO" : "BAJO";

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
