export enum Profile {
  NORMAL = "NORMAL",
  SENSITIVE = "SENSITIVE",
}

export interface Category {
  id: string;
  name: string;
  created_at: Date;
  description: string | null;
}

export interface Ingredient {
  id: string;
  name: string;
  scientific_name: string | null;
  risk_level: number;
  risk_description: string;
  health_effects: string;
  scientific_source: string | null;
  is_endocrine_disruptor: boolean;
  created_at: Date;
}

export interface Product {
  id: string;
  name: string;
  created_at: Date;
  description: string | null;
  brand: string;
  category_id: string | null;
  image_url: string | null;
  risk_index: number | null;
  updated_at: Date | null;
  category?: Category;
  ingredients?: ProductIngredient[];
}

export interface ProductIngredient {
  id: string;
  product_id: string;
  ingredient_id: string;
  concentration: string | null;
  created_at: Date;
  ingredient?: Ingredient;
}

export interface IIngredientData {
  name: string;
  riskLevelDB: number;
  foundInDb: boolean;
  isEndocrineDisruptor: boolean;
  scientificSource: string | null;
}

export interface IProductResult {
  finalScore: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH";
  warnings: string[];
  unknownIngredients: string[];
}

export interface IRiskReport {
  profile: Profile;
  ingredients: IIngredientData[];
  result: IProductResult;
  consultedAt: Date;
}

export type ResilienceScenarioId = "healthy" | "slow" | "flaky" | "down";
export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerStatus {
  name: string;
  state: CircuitState;
  failureCount: number;
  successCount: number;
  totalSuccesses: number;
  totalFailures: number;
  failureThreshold: number;
  resetTimeoutMs: number;
  nextAttemptAt: string | null;
  lastFailureAt: string | null;
  lastSuccessAt: string | null;
}

export interface BulkheadStatus {
  name: string;
  maxConcurrent: number;
  maxQueueSize: number;
  timeout: number;
  activeRequests: number;
  queuedRequests: number;
}

export interface ResilienceOverview {
  title: string;
  focus: string;
  patterns: Array<{
    name: string;
    description: string;
    config: string;
  }>;
  scenarios: Array<{
    id: ResilienceScenarioId;
    label: string;
    summary: string;
  }>;
  currentState: CircuitBreakerStatus | null;
  registeredCircuitBreakers: CircuitBreakerStatus[];
  registeredBulkheads: BulkheadStatus[];
}

export interface ResilienceSimulationResult {
  patternFlow: string[];
  scenario: ResilienceScenarioId;
  success: boolean;
  finalMessage: string;
  simulatedDependency: string;
  fallbackMessage: string | null;
  retry: {
    attempts: number;
    maxRetries: number;
    delaysMs: number[];
  };
  timeout: {
    limitMs: number;
    triggered: boolean;
    durationMs: number;
  };
  circuitBreaker: CircuitBreakerStatus | null;
  responsePayload: {
    source: string;
    riskScore: number | null;
    recommendation: string;
  } | null;
  registry: {
    circuitBreakers: CircuitBreakerStatus[];
    bulkheads: BulkheadStatus[];
  };
}

export interface Evaluacion {
  id: string;
  producto_id: string;
  indice_riesgo_calculado: number;
  detalles_evaluacion: Record<string, unknown> | null;
  evaluado_por: string;
  created_at: string;
}

export function getRiskLevel(level: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (true) {
    case level < 4:
      return {
        label: "Muy Bajo",
        color: "text-green-700",
        bgColor: "bg-green-100",
      };
    case level >= 4 && level < 5:
      return { label: "Bajo", color: "text-green-600", bgColor: "bg-green-50" };
    case level >= 5 && level < 6.5:
      return {
        label: "Moderado",
        color: "text-yellow-700",
        bgColor: "bg-yellow-100",
      };
    case level >= 6.5 && level < 8.5:
      return {
        label: "Alto",
        color: "text-orange-700",
        bgColor: "bg-orange-100",
      };
    case level >= 8.5:
      return {
        label: "Muy Alto",
        color: "text-red-700",
        bgColor: "bg-red-100",
      };
    default:
      return {
        label: "Desconocido",
        color: "text-gray-600",
        bgColor: "bg-gray-100",
      };
  }
}

export function getProductRiskLevel(indice: number): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  if (indice <= 20) {
    return {
      label: "Seguro",
      color: "text-green-700",
      bgColor: "bg-green-100",
      borderColor: "border-green-300",
    };
  } else if (indice <= 40) {
    return {
      label: "Bajo Riesgo",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  } else if (indice <= 60) {
    return {
      label: "Riesgo Moderado",
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-300",
    };
  } else if (indice <= 80) {
    return {
      label: "Riesgo Alto",
      color: "text-orange-700",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-300",
    };
  } else {
    return {
      label: "Riesgo Muy Alto",
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
    };
  }
}
