"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCcw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type {
  CircuitBreakerStatus,
  ResilienceOverview,
  ResilienceScenarioId,
  ResilienceSimulationResult,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const scenarioStyles: Record<
  ResilienceScenarioId,
  { accent: string; icon: typeof ShieldCheck }
> = {
  healthy: { accent: "border-emerald-200 bg-emerald-50/70", icon: ShieldCheck },
  slow: { accent: "border-amber-200 bg-amber-50/70", icon: Clock3 },
  flaky: { accent: "border-sky-200 bg-sky-50/70", icon: RefreshCcw },
  down: { accent: "border-rose-200 bg-rose-50/70", icon: ShieldAlert },
};

export default function ResiliencePage() {
  const [overview, setOverview] = useState<ResilienceOverview | null>(null);
  const [result, setResult] = useState<ResilienceSimulationResult | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [isSimulating, setIsSimulating] = useState<ResilienceScenarioId | null>(
    null,
  );
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadOverview();
  }, []);

  async function loadOverview() {
    try {
      setIsLoadingOverview(true);
      const response = await fetch(`${API_URL}/resilience-patterns`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No fue posible cargar la configuracion de resiliencia.");
      }

      const data = (await response.json()) as ResilienceOverview;
      setOverview(data);
    } catch (err) {
      setError(
        "No se pudo cargar el apartado de resiliencia. Verifica que el backend este activo.",
      );
    } finally {
      setIsLoadingOverview(false);
    }
  }

  async function simulateScenario(scenario: ResilienceScenarioId) {
    try {
      setIsSimulating(scenario);
      setError(null);

      const response = await fetch(`${API_URL}/resilience-patterns/simulate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenario }),
      });

      if (!response.ok) {
        throw new Error("No fue posible ejecutar la simulacion.");
      }

      const data = (await response.json()) as ResilienceSimulationResult;
      setResult(data);
      await loadOverview();
    } catch (err) {
      setError(
        "La simulacion fallo. Revisa el servicio del backend para continuar.",
      );
    } finally {
      setIsSimulating(null);
    }
  }

  async function resetCircuitBreaker() {
    try {
      setIsResetting(true);
      setError(null);

      const response = await fetch(`${API_URL}/resilience-patterns/reset`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("No fue posible reiniciar el circuito.");
      }

      setResult(null);
      await loadOverview();
    } catch (err) {
      setError("No se pudo reiniciar el circuit breaker.");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Inicio
        </Link>

        <section className="relative overflow-hidden rounded-3xl border border-border bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(240,253,250,0.92))] p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10">
                Entrega 1 PF - Inciso 3
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Resilience Patterns para el manejo de fallos en SafeCare
              </h1>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Este apartado demuestra como SafeCare protege el analisis de
                productos cuando una dependencia externa se pone lenta, falla de
                forma intermitente o deja de responder.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricCard
                label="Timeout"
                value={overview?.patterns[0]?.config ?? "Cargando"}
                helper="Evita bloqueos"
              />
              <MetricCard
                label="Retry"
                value={overview?.patterns[1]?.config ?? "Cargando"}
                helper="Recupera fallos transitorios"
              />
              <MetricCard
                label="Circuit Breaker"
                value={overview?.currentState.state ?? "Cargando"}
                helper="Protege disponibilidad"
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Patrones implementados</CardTitle>
                <CardDescription>
                  La combinacion de patrones responde al enfoque de manejo de
                  fallos pedido para el inciso 3.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {isLoadingOverview && !overview ? (
                  <LoadingBlock label="Cargando patrones..." />
                ) : (
                  overview?.patterns.map((pattern) => (
                    <div
                      key={pattern.name}
                      className="rounded-2xl border border-border bg-muted/40 p-4"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          {pattern.name === "Timeout" ? (
                            <Clock3 className="h-4 w-4" />
                          ) : pattern.name === "Retry" ? (
                            <RotateCcw className="h-4 w-4" />
                          ) : (
                            <Zap className="h-4 w-4" />
                          )}
                        </div>
                        <h2 className="font-semibold text-foreground">
                          {pattern.name}
                        </h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {pattern.description}
                      </p>
                      <div className="mt-4 rounded-xl bg-background px-3 py-2 text-sm font-medium text-foreground">
                        {pattern.config}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Simulador de fallos</CardTitle>
                  <CardDescription>
                    Ejecuta escenarios y observa como responde el backend con
                    timeout, retry y circuit breaker.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={resetCircuitBreaker}
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reiniciando
                    </>
                  ) : (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reiniciar circuito
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {overview?.scenarios.map((scenario) => {
                  const scenarioMeta = scenarioStyles[scenario.id];
                  const Icon = scenarioMeta.icon;
                  const isRunning = isSimulating === scenario.id;

                  return (
                    <div
                      key={scenario.id}
                      className={`rounded-2xl border p-5 ${scenarioMeta.accent}`}
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-white/80 p-2 text-foreground shadow-sm">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {scenario.label}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {scenario.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => simulateScenario(scenario.id)}
                        disabled={isRunning}
                      >
                        {isRunning ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Ejecutando simulacion
                          </>
                        ) : (
                          "Probar escenario"
                        )}
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aplicacion en SafeCare</CardTitle>
                <CardDescription>
                  Este patron protege especialmente las consultas al motor
                  externo de evaluacion de riesgo.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <ImpactCard
                  title="Disponibilidad"
                  description="Si el proveedor falla, SafeCare entrega un fallback y evita caidas totales."
                />
                <ImpactCard
                  title="Experiencia"
                  description="El timeout corta esperas excesivas y mantiene la interfaz responsiva."
                />
                <ImpactCard
                  title="Observabilidad"
                  description="El estado del circuito y el numero de reintentos quedan visibles para la entrega."
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Estado actual del circuito</CardTitle>
                <CardDescription>
                  Informacion en tiempo real traida desde el backend.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {overview ? (
                  <CircuitStatusPanel status={overview.currentState} />
                ) : (
                  <LoadingBlock label="Cargando estado del circuito..." />
                )}
              </CardContent>
            </Card>

            <Card className="min-h-[520px]">
              <CardHeader>
                <CardTitle>Resultado de la ultima simulacion</CardTitle>
                <CardDescription>
                  Resumen funcional del manejo de fallos solicitado en el
                  inciso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div
                      className={`rounded-2xl border px-4 py-4 ${
                        result.success
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-amber-200 bg-amber-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {result.success ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
                        )}
                        <div>
                          <p className="font-semibold text-foreground">
                            {result.finalMessage}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Dependencia simulada: {result.simulatedDependency}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <MetricCard
                        label="Intentos"
                        value={`${result.retry.attempts}`}
                        helper={`Maximo ${result.retry.maxRetries + 1} ejecuciones`}
                      />
                      <MetricCard
                        label="Timeout"
                        value={
                          result.timeout.triggered
                            ? "Activado"
                            : `${result.timeout.durationMs} ms`
                        }
                        helper={`Limite ${result.timeout.limitMs} ms`}
                      />
                      <MetricCard
                        label="Circuito"
                        value={result.circuitBreaker.state}
                        helper={`Fallos ${result.circuitBreaker.failureCount}/${result.circuitBreaker.failureThreshold}`}
                      />
                    </div>

                    {result.responsePayload && (
                      <div className="rounded-2xl border border-border bg-muted/30 p-4">
                        <h3 className="font-semibold text-foreground">
                          Respuesta entregada por el backend
                        </h3>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <InfoPill
                            label="Origen"
                            value={result.responsePayload.source}
                          />
                          <InfoPill
                            label="Risk score"
                            value={
                              result.responsePayload.riskScore === null
                                ? "No disponible"
                                : `${result.responsePayload.riskScore}`
                            }
                          />
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {result.responsePayload.recommendation}
                        </p>
                      </div>
                    )}

                    {result.fallbackMessage && (
                      <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {result.fallbackMessage}
                      </div>
                    )}

                    <div>
                      <h3 className="mb-3 font-semibold text-foreground">
                        Flujo del patron
                      </h3>
                      <div className="space-y-3">
                        {result.patternFlow.map((step, index) => (
                          <div
                            key={`${step}-${index}`}
                            className="flex gap-3 rounded-2xl border border-border bg-background px-4 py-3"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                              {index + 1}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
                    <div className="max-w-sm">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Zap className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Sin simulacion aun
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Ejecuta un escenario para ver como SafeCare responde a
                        fallos con timeout, retry y circuit breaker.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function CircuitStatusPanel({ status }: { status: CircuitBreakerStatus }) {
  const stateTone =
    status.state === "CLOSED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status.state === "HALF_OPEN"
        ? "border-sky-200 bg-sky-50 text-sky-700"
        : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border px-4 py-3 ${stateTone}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">Estado</span>
          <span className="text-lg font-semibold">{status.state}</span>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoPill
          label="Fallos acumulados"
          value={`${status.failureCount}/${status.failureThreshold}`}
        />
        <InfoPill
          label="Exitos en HALF_OPEN"
          value={`${status.successCountInHalfOpen}`}
        />
      </div>
      <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        {status.nextAttemptAt
          ? `Proxima prueba permitida: ${new Date(status.nextAttemptAt).toLocaleString("es-CO")}`
          : "No hay ventana de reintento pendiente; el circuito puede operar normalmente."}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/90 px-4 py-3 shadow-sm">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{helper}</div>
    </div>
  );
}

function ImpactCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-4">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background px-4 py-3">
      <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {label}
      </div>
    </div>
  );
}
