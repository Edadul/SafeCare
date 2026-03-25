import { Header } from "@/components/header";
import { IngredientCard } from "@/components/ingredient-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Ingredient } from "@/lib/types";
import { FlaskConical, AlertTriangle, Filter } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ filter?: string }>;
}

async function getIngredients(filterDisruptores?: boolean) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/ingredients`,
  );
  const data: Ingredient[] = await response.json();

  console.log("Ingredientes obtenidos:", data);

  if (filterDisruptores) {
    return data.filter((i: Ingredient) => i.is_endocrine_disruptor);
  }
  return (data || []) as Ingredient[];
}

export default async function IngredientesPage({ searchParams }: Props) {
  const params = await searchParams;
  const showDisruptores = params.filter === "disruptores";
  const ingredients = await getIngredients(showDisruptores);

  const disruptoresCount = ingredients.filter(
    (i) => i.is_endocrine_disruptor,
  ).length;
  const highRiskCount = ingredients.filter((i) => i.risk_level >= 4).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <FlaskConical className="h-5 w-5" />
            <span className="text-sm font-medium">
              Base de Datos de Ingredientes
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {showDisruptores
              ? "Disruptores Endocrinos"
              : "Ingredientes Peligrosos"}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Conoce los ingredientes quimicos presentes en productos de cuidado
            personal que pueden afectar tu sistema hormonal y causar efectos
            adversos en la salud.
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 border-2 border-red-200 bg-red-50/50">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Que son los Disruptores Endocrinos?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Son sustancias quimicas que pueden interferir con el sistema
                hormonal del cuerpo. La exposicion a estos compuestos durante
                etapas criticas del desarrollo puede causar pubertad precoz,
                problemas reproductivos, y otras alteraciones hormonales. Son
                especialmente peligrosos para ninos, adolescentes y mujeres
                embarazadas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtrar:</span>
          </div>
          <div className="flex gap-2">
            <Link href="/ingredientes">
              <Button
                variant={!showDisruptores ? "default" : "outline"}
                size="sm"
              >
                Todos ({ingredients.length})
              </Button>
            </Link>
            <Link href="/ingredientes?filter=disruptores">
              <Button
                variant={showDisruptores ? "default" : "outline"}
                size="sm"
                className="gap-1"
              >
                <AlertTriangle className="h-3 w-3" />
                Solo Disruptores ({disruptoresCount})
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  {ingredients.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ingredientes Registrados
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {disruptoresCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Disruptores Endocrinos
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {highRiskCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Alto o Muy Alto Riesgo
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ingredients Grid */}
        {ingredients.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ingredients.map((ingredient) => (
              <IngredientCard key={ingredient.id} ingredient={ingredient} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <FlaskConical className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              No hay ingredientes
            </h2>
            <p className="mt-2 text-muted-foreground">
              Aun no hay ingredientes registrados en el sistema.
            </p>
          </div>
        )}

        {/* Risk Level Legend */}
        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Niveles de Riesgo
          </h3>
          <div className="grid gap-3 sm:grid-cols-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                1
              </span>
              <span className="text-sm text-muted-foreground">Muy Bajo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-xs font-bold text-green-600">
                2
              </span>
              <span className="text-sm text-muted-foreground">Bajo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700">
                3
              </span>
              <span className="text-sm text-muted-foreground">Moderado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                4
              </span>
              <span className="text-sm text-muted-foreground">Alto</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
                5
              </span>
              <span className="text-sm text-muted-foreground">Muy Alto</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
