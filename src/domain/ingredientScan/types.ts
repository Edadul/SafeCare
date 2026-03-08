// Domain types for IngredientScan

export type Perfil = "normal" | "sensible";
export type TabId = "analisis" | "reporte";
export type NivelRiesgo = "ALTO" | "MODERADO" | "BAJO";

export const Profile = {
  NORMAL: "NORMAL",
  SENSITIVE: "SENSITIVE",
} as const;
export type Profile = (typeof Profile)[keyof typeof Profile];

export interface IIngredient {
  name: string;
  concentration?: number;
}

export interface ReportDto {
  profile: Profile;
  ingredients: IIngredient[];
}

export interface IIngredientRecord {
  name: string;
  riskLevelDB: number;
  foundInDb: boolean;
  isEndocrineDisruptor: boolean;
  scientificSource: string;
}

export interface ProxyResult extends IIngredientRecord {
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

export interface IReport {
  ingredients: IIngredientRecord[];
  profile: Profile;
  result: {
    finalScore: number;
    riskLevel: "HIGH" | "MODERATE" | "LOW";
    warnings: string[];
    unknownIngredients: string[];
  };
  createdAt: Date;
}

export interface BuildReportParams {
  ingredientes: IIngredientRecord[];
  perfil: Perfil;
  proxyResults: ProxyResult[];
  adjustedRisks: number[];
  chain: ChainResult;
}
