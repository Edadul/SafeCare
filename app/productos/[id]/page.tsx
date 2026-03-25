import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { RiskBadge } from "@/components/risk-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Beaker,
  Info,
} from "lucide-react";

interface ProductoIngrediente {
  id: string;
  concentracion: string | null;
  ingredientes: {
    id: string;
    nombre: string;
    nombre_cientifico: string | null;
    nivel_riesgo: number;
    descripcion_riesgo: string;
    efectos_salud: string;
    fuente_cientifica: string | null;
    es_disruptor_endocrino: boolean;
  };
}

interface Producto {
  id: string;
  nombre: string;
  marca: string;
  descripcion: string | null;
  indice_riesgo: number;
  categorias: {
    nombre: string;
  } | null;
  producto_ingredientes: ProductoIngrediente[];
}

export default async function ProductoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: producto, error } = await supabase
    .from("productos")
    .select(
      `
      *,
      categorias (nombre),
      producto_ingredientes (
        id,
        concentracion,
        ingredientes (
          id,
          nombre,
          nombre_cientifico,
          nivel_riesgo,
          descripcion_riesgo,
          efectos_salud,
          fuente_cientifica,
          es_disruptor_endocrino
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !producto) {
    notFound();
  }

  const prod = producto as Producto;
  const disruptores = prod.producto_ingredientes.filter(
    (pi) => pi.ingredientes.es_disruptor_endocrino
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
          {/* Información del producto */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {prod.marca}
                    </p>
                    <CardTitle className="text-2xl">{prod.nombre}</CardTitle>
                    {prod.categorias && (
                      <Badge variant="secondary" className="mt-2">
                        {prod.categorias.nombre}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-white font-bold text-xl ${getRiskColor(prod.indice_riesgo)}`}
                    >
                      {prod.indice_riesgo}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Riesgo {getRiskText(prod.indice_riesgo)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {prod.descripcion && (
                  <p className="text-muted-foreground">{prod.descripcion}</p>
                )}
              </CardContent>
            </Card>

            {/* Alerta de disruptores endocrinos */}
            {disruptores.length > 0 && (
              <Card className="border-destructive bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <ShieldAlert className="h-5 w-5" />
                    Alerta: Disruptores Endocrinos Detectados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Este producto contiene {disruptores.length} ingrediente(s)
                    que pueden interferir con el sistema hormonal y
                    potencialmente causar pubertad precoz en jovenes.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {disruptores.map((d) => (
                      <Badge
                        key={d.id}
                        variant="destructive"
                        className="gap-1"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        {d.ingredientes.nombre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de ingredientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Ingredientes Identificados (
                  {prod.producto_ingredientes.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prod.producto_ingredientes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No se han identificado ingredientes de riesgo en este
                    producto.
                  </p>
                ) : (
                  prod.producto_ingredientes.map((pi) => (
                    <div
                      key={pi.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">
                              {pi.ingredientes.nombre}
                            </h4>
                            {pi.ingredientes.es_disruptor_endocrino && (
                              <Badge
                                variant="destructive"
                                className="text-xs gap-1"
                              >
                                <AlertTriangle className="h-3 w-3" />
                                Disruptor Endocrino
                              </Badge>
                            )}
                          </div>
                          {pi.ingredientes.nombre_cientifico && (
                            <p className="text-xs text-muted-foreground italic">
                              {pi.ingredientes.nombre_cientifico}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {pi.concentracion && (
                            <Badge variant="outline">{pi.concentracion}</Badge>
                          )}
                          <RiskBadge level={pi.ingredientes.nivel_riesgo} />
                        </div>
                      </div>

                      <div className="grid gap-2 text-sm">
                        <div className="flex gap-2">
                          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-muted-foreground">
                            {pi.ingredientes.descripcion_riesgo}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                          <p>{pi.ingredientes.efectos_salud}</p>
                        </div>
                        {pi.ingredientes.fuente_cientifica && (
                          <p className="text-xs text-muted-foreground pl-6">
                            Fuente: {pi.ingredientes.fuente_cientifica}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Riesgo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Indice de Riesgo</span>
                    <span className="font-medium">{prod.indice_riesgo}/100</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${getRiskColor(prod.indice_riesgo)}`}
                      style={{ width: `${prod.indice_riesgo}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Ingredientes de riesgo
                    </span>
                    <span className="font-medium">
                      {prod.producto_ingredientes.length}
                    </span>
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
                prod.indice_riesgo <= 30
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-orange-500 bg-orange-50"
              }
            >
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  {prod.indice_riesgo <= 30 ? (
                    <>
                      <ShieldCheck className="h-8 w-8 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-emerald-800">
                          Producto Recomendado
                        </h4>
                        <p className="text-sm text-emerald-700">
                          Este producto tiene un bajo indice de riesgo y es una
                          opcion mas segura.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-8 w-8 text-orange-600 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-orange-800">
                          Precaucion Recomendada
                        </h4>
                        <p className="text-sm text-orange-700">
                          Considere buscar alternativas con menor indice de
                          riesgo, especialmente para ninos y adolescentes.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Poblaciones Vulnerables</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>- Ninos de 10-16 años</li>
                  <li>- Mujeres embarazadas</li>
                  <li>- Mujeres en periodo de lactancia</li>
                  <li>- Personas con condiciones hormonales</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
