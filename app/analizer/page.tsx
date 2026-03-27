"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type IRiskReport, type IIngredientData, Profile } from "@/lib/types";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FlaskConical,
  Shield,
  ArrowLeft,
  Loader2,
  FileText,
  Info,
  User,
  Baby,
  AlertCircle,
} from "lucide-react";

export default function AnalizadorPage() {
  const [ingredientesInput, setIngredientesInput] = useState("");
  const [profile, setProfile] = useState<Profile>(Profile.NORMAL);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<IRiskReport | null>(null);
  const [foundIngredients, setFoundIngredients] = useState<IIngredientData[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!ingredientesInput.trim()) {
      setError("Por favor ingresa al menos un ingrediente para analizar.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setReport(null);
    setFoundIngredients([]);

    const ingredientsNames = ingredientesInput
      .split(/[\n,]+/)
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const ingredients = ingredientsNames.map((name) => ({ name }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analysis`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile, ingredients }),
        },
      );

      if (!response.ok) {
        throw new Error("Error al analizar los ingredientes");
      }

      const data = await response.json();
      data.ingredients.forEach((ingredient: IIngredientData) => {
        if (ingredient.foundInDb) {
          setFoundIngredients((prev) => [...prev, ingredient]);
        }
      });
      setReport(data);
    } catch (err) {
      setError(
        "Ocurrio un error al analizar los ingredientes. Intenta de nuevo.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  function getRiskColor(level: "LOW" | "MODERATE" | "HIGH") {
    switch (level) {
      case "LOW":
        return "text-green-600";
      case "MODERATE":
        return "text-yellow-600";
      case "HIGH":
        return "text-red-600";
    }
  }

  function getRiskLabel(level: "LOW" | "MODERATE" | "HIGH") {
    switch (level) {
      case "LOW":
        return "Bajo Riesgo";
      case "MODERATE":
        return "Riesgo Moderado";
      case "HIGH":
        return "Alto Riesgo";
    }
  }

  function getRiskBgColor(level: "LOW" | "MODERATE" | "HIGH") {
    switch (level) {
      case "LOW":
        return "bg-green-500";
      case "MODERATE":
        return "bg-yellow-500";
      case "HIGH":
        return "bg-red-500";
    }
  }

  function getProgressColor(score: number) {
    if (score <= 3.5) return "bg-green-500";
    if (score <= 6.5) return "bg-yellow-500";
    return "bg-red-500";
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Inicio
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Analizador de Ingredientes
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Ingresa la lista de ingredientes de cualquier producto de cuidado
            personal y obtendras un reporte detallado sobre los posibles riesgos
            para tu salud.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Profile Selection */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Perfil de Sensibilidad
                </CardTitle>
                <CardDescription>
                  Selecciona el perfil adecuado para ajustar los umbrales de
                  riesgo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={profile}
                  onValueChange={(value) => setProfile(value as Profile)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="NORMAL"
                      id="normal"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="normal"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <User className="mb-3 h-6 w-6" />
                      <span className="font-semibold">Normal</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">
                        Adultos sin condiciones especiales
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="SENSITIVE"
                      id="sensitive"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="sensitive"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Baby className="mb-3 h-6 w-6" />
                      <span className="font-semibold">Sensible</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">
                        Ninos, embarazadas, adolescentes
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
                {profile === "SENSITIVE" && (
                  <div className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <div className="flex gap-2 text-sm text-orange-800">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        El perfil sensible aplica umbrales mas estrictos y
                        alerta sobre ingredientes que podrian afectar el
                        desarrollo hormonal.
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Lista de Ingredientes
                </CardTitle>
                <CardDescription>
                  Copia y pega la lista de ingredientes que aparece en la
                  etiqueta del producto. Puedes separarlos por comas, saltos de
                  linea, o como aparezcan en el empaque.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Ejemplo: Aqua, Sodium Lauryl Sulfate, Methylparaben, Propylparaben, Parfum, Triclosan, BHT..."
                  value={ingredientesInput}
                  onChange={(e) => setIngredientesInput(e.target.value)}
                  className="min-h-[180px] resize-none"
                />
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Analizar Ingredientes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      Consejos para el analisis
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>
                        - Busca la lista de ingredientes en el empaque del
                        producto
                      </li>
                      <li>
                        - Los ingredientes suelen estar en orden de
                        concentracion (mayor a menor)
                      </li>
                      <li>
                        - Presta atencion a nombres cientificos como
                        &quot;Methylparaben&quot; o &quot;Benzophenone&quot;
                      </li>
                      <li>
                        - &quot;Parfum&quot; o &quot;Fragrance&quot; puede
                        ocultar multiples quimicos
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {report ? (
              <>
                {/* Overall Score */}
                <Card className="overflow-hidden">
                  <div
                    className={`p-1 ${getRiskBgColor(report.result.riskLevel)}`}
                  />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Resultado del Analisis</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Perfil:{" "}
                        {report.profile === "SENSITIVE" ? "Sensible" : "Normal"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className={`text-lg px-3 py-1 ${getRiskColor(report.result.riskLevel)}`}
                      >
                        {getRiskLabel(report.result.riskLevel)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Risk Score */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Indice de Riesgo
                        </span>
                        <span
                          className={`font-bold ${getRiskColor(report.result.riskLevel)}`}
                        >
                          {report.result.finalScore.toFixed(2)}/10
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(report.result.finalScore)}`}
                          style={{ width: `${report.result.finalScore * 10}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-red-50 border border-red-100">
                        <div className="flex justify-center mb-1">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="text-2xl font-bold text-red-700">
                          {
                            report.ingredients.filter((i) => i.riskLevelDB >= 4)
                              .length
                          }
                        </div>
                        <div className="text-xs text-red-600">Peligrosos</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-orange-50 border border-orange-100">
                        <div className="flex justify-center mb-1">
                          <FlaskConical className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="text-2xl font-bold text-orange-700">
                          {
                            report.ingredients.filter(
                              (i) => i.isEndocrineDisruptor,
                            ).length
                          }
                        </div>
                        <div className="text-xs text-orange-600">
                          Disruptores
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex justify-center mb-1">
                          <Search className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-700">
                          {report.result.unknownIngredients.length}
                        </div>
                        <div className="text-xs text-gray-600">
                          No Reconocidos
                        </div>
                      </div>
                    </div>

                    {/* Warnings */}
                    {report.result.warnings.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          Advertencias
                        </h4>
                        <div className="space-y-2">
                          {report.result.warnings.map((warning, index) => (
                            <div
                              key={index}
                              className="p-2 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-800"
                            >
                              {warning}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Detailed Analysis - Found Ingredients */}
                {report.ingredients.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Ingredientes Identificados
                      </CardTitle>
                      <CardDescription>
                        {foundIngredients.length} ingrediente(s) encontrado(s)
                        en nuestra base de datos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {foundIngredients.map((ingredient, index) => (
                          <IngredientResultCard
                            key={index}
                            ingredient={ingredient}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Unknown Ingredients */}
                {report.result.unknownIngredients.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Ingredientes No Reconocidos
                      </CardTitle>
                      <CardDescription>
                        Estos ingredientes no estan en nuestra base de datos de
                        riesgos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {report.result.unknownIngredients.map((name, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {name}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Nota: Que un ingrediente no este en nuestra base de
                        datos no garantiza que sea completamente seguro. Te
                        recomendamos investigar mas si tienes dudas.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Consultation Date */}
                <p className="text-xs text-muted-foreground text-center">
                  Consulta realizada el{" "}
                  {new Date(report.consultedAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </>
            ) : (
              <Card className="h-full min-h-[400px] flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Shield className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Esperando Ingredientes
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Selecciona tu perfil de sensibilidad e ingresa la lista de
                    ingredientes de tu producto para obtener un reporte de
                    seguridad personalizado.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function IngredientResultCard({ ingredient }: { ingredient: IIngredientData }) {
  function getRiskLevelInfo(level: number) {
    switch (true) {
      case level < 4:
        return {
          label: "Muy Bajo",
          color: "text-green-700",
          bgColor: "bg-green-100",
        };
      case level >= 4 && level < 5:
        return {
          label: "Bajo",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
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

  const riskInfo = getRiskLevelInfo(ingredient.riskLevelDB);
  const bgClass = ingredient.isEndocrineDisruptor
    ? "bg-red-50 border-red-200"
    : ingredient.riskLevelDB >= 4
      ? "bg-orange-50 border-orange-200"
      : ingredient.riskLevelDB >= 3
        ? "bg-yellow-50 border-yellow-200"
        : "bg-green-50 border-green-200";

  return (
    <div className={`p-3 rounded-lg border ${bgClass}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {ingredient.isEndocrineDisruptor ? (
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
            ) : ingredient.riskLevelDB >= 4 ? (
              <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            )}
            <span className="font-medium text-foreground">
              {ingredient.name}
            </span>
          </div>
          <div className="ml-6 mt-2 flex flex-wrap gap-1">
            {ingredient.isEndocrineDisruptor && (
              <Badge variant="destructive" className="text-xs">
                Disruptor Endocrino
              </Badge>
            )}
            {ingredient.scientificSource && (
              <Badge variant="outline" className="text-xs">
                Fuente: {ingredient.scientificSource}
              </Badge>
            )}
          </div>
        </div>
        <Badge
          variant="outline"
          className={`${riskInfo.color} ${riskInfo.bgColor} shrink-0`}
        >
          {riskInfo.label}
        </Badge>
      </div>
    </div>
  );
}
