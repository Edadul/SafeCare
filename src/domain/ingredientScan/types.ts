// Domain types for IngredientScan

export type Perfil = "normal" | "sensible";
export type TabId = "analisis" | "reporte";
export type NivelRiesgo = "ALTO" | "MODERADO" | "BAJO";

export interface IngredientRecord {
  riskLevel: number;
  category: string;
  sources: string[];
}

export interface ProxyResult extends IngredientRecord {
  fromCache: boolean;
}

export interface ChainResult {
  finalScore: number;
  alerts: string[];
}

export interface IngredienteDetalle {
  nombre: string;
  riskBruto: number;
  riskAjustado: number;
  categoria: string;
  fuentes: string[];
  fromCache: boolean;
}

export interface Report {
  id: string;
  fecha: string;
  perfil: Perfil;
  ingredientes: string[];
  detalles: IngredienteDetalle[];
  chain: ChainResult;
  puntajeFinal: number;
  nivelRiesgo: NivelRiesgo;
}

export interface BuildReportParams {
  ingredientes: string[];
  perfil: Perfil;
  proxyResults: ProxyResult[];
  adjustedRisks: number[];
  chain: ChainResult;
}
