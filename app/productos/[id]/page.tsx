import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { RiskBadge } from "@/components/risk-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product, ProductIngredient } from "@/lib/types";
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  FlaskConical,
  Info,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as Product;
  } catch {
    return null;
  }
}

export default async function ProductoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const riskIndex = product.risk_index ?? 0;
  const productIngredients = product.ingredients ?? [];
  const disruptores = productIngredients.filter(
    (item) => item.ingredient?.is_endocrine_disruptor,
  );

  const getRiskColor = (risk: number) => {
    if (risk <= 25) return "bg-emerald-500";
    if (risk <= 50) return "bg-yellow-500";
    if (risk <= 75) return "bg-orange-500";
    return "bg-red-500";
  };

  const getRiskText = (risk: number) => {
    if (risk <= 25) return "Bajo";
    if (risk <= 50) return "Moderado";
    if (risk <= 75) return "Alto";
    return "Muy Alto";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Link href="/productos">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      {product.brand}
                    </p>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    {product.category && (
                      <Badge variant="secondary" className="mt-2">
                        {product.category.name}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white ${getRiskColor(riskIndex)}`}
                    >
                      {riskIndex}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Riesgo {getRiskText(riskIndex)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {product.description && (
                  <p className="text-muted-foreground">{product.description}</p>
                )}
              </CardContent>
            </Card>

            {disruptores.length > 0 && (
              <Card className="border-destructive bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <ShieldAlert className="h-5 w-5" />
                    Alerta: Disruptores Endocrinos Detectados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Este producto contiene {disruptores.length} ingrediente(s)
                    con potencial de afectar el sistema hormonal.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {disruptores.map((item) => (
                      <Badge
                        key={item.id}
                        variant="destructive"
                        className="gap-1"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        {item.ingredient?.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  Ingredientes Identificados ({productIngredients.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {productIngredients.length === 0 ? (
                  <p className="py-4 text-center text-muted-foreground">
                    No se identificaron ingredientes asociados a este producto.
                  </p>
                ) : (
                  productIngredients.map((item) => (
                    <IngredientDetailCard key={item.id} item={item} />
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Riesgo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Indice de Riesgo</span>
                    <span className="font-medium">{riskIndex}/100</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all ${getRiskColor(riskIndex)}`}
                      style={{ width: `${riskIndex}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Ingredientes asociados
                    </span>
                    <span className="font-medium">{productIngredients.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Disruptores endocrinos
                    </span>
                    <span className="font-medium text-destructive">
                      {disruptores.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={
                riskIndex <= 30
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-orange-500 bg-orange-50"
              }
            >
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  {riskIndex <= 30 ? (
                    <>
                      <ShieldCheck className="h-8 w-8 shrink-0 text-emerald-600" />
                      <div>
                        <h4 className="font-semibold text-emerald-800">
                          Producto Recomendado
                        </h4>
                        <p className="text-sm text-emerald-700">
                          Tiene un indice de riesgo bajo frente al resto del
                          catalogo evaluado.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-8 w-8 shrink-0 text-orange-600" />
                      <div>
                        <h4 className="font-semibold text-orange-800">
                          Precaucion Recomendada
                        </h4>
                        <p className="text-sm text-orange-700">
                          Considera buscar alternativas con menor indice de
                          riesgo, especialmente para poblaciones sensibles.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function IngredientDetailCard({ item }: { item: ProductIngredient }) {
  const ingredient = item.ingredient;

  if (!ingredient) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{ingredient.name}</h4>
            {ingredient.is_endocrine_disruptor && (
              <Badge variant="destructive" className="gap-1 text-xs">
                <AlertTriangle className="h-3 w-3" />
                Disruptor Endocrino
              </Badge>
            )}
          </div>
          {ingredient.scientific_name && (
            <p className="mt-0.5 text-xs italic text-muted-foreground">
              {ingredient.scientific_name}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {item.concentration && (
            <Badge variant="outline">{item.concentration}</Badge>
          )}
          <RiskBadge level={ingredient.risk_level} />
        </div>
      </div>

      <div className="grid gap-2 text-sm">
        <div className="flex gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-muted-foreground">{ingredient.risk_description}</p>
        </div>
        <div className="flex gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
          <p>{ingredient.health_effects}</p>
        </div>
        {ingredient.scientific_source && (
          <p className="pl-6 text-xs text-muted-foreground">
            Fuente: {ingredient.scientific_source}
          </p>
        )}
      </div>
    </div>
  );
}
