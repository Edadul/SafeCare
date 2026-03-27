import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Producto, Categoria } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { Package, Search, Filter } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ categoria?: string; search?: string }>;
}

async function getProductos(categoriaId?: string) {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("productos")
      .select("*, categoria:categorias(*)")
      .order("indice_riesgo", { ascending: false });

    if (categoriaId) {
      query = query.eq("categoria_id", categoriaId);
    }

    const { data } = await query;
    return (data || []) as Producto[];
  } catch {
    return [];
  }
}

async function getCategorias() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categorias")
      .select("*")
      .order("nombre");
    return (data || []) as Categoria[];
  } catch {
    return [];
  }
}

export default async function ProductosPage({ searchParams }: Props) {
  const params = await searchParams;
  const [productos, categorias] = await Promise.all([
    getProductos(params.categoria),
    getCategorias(),
  ]);

  const categoriaActual = categorias.find((c) => c.id === params.categoria);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Package className="h-5 w-5" />
            <span className="text-sm font-medium">Catalogo de Productos</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {categoriaActual
              ? `Productos: ${categoriaActual.nombre}`
              : "Todos los Productos"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explora nuestro catalogo de productos de cuidado personal y conoce
            su indice de riesgo basado en sus ingredientes.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link href="/productos">
              <Button
                variant={!params.categoria ? "default" : "outline"}
                size="sm"
              >
                Todos
              </Button>
            </Link>
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/productos?categoria=${categoria.id}`}
              >
                <Button
                  variant={
                    params.categoria === categoria.id ? "default" : "outline"
                  }
                  size="sm"
                >
                  {categoria.nombre}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {productos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              No hay productos
            </h2>
            <p className="mt-2 text-muted-foreground">
              {params.categoria
                ? "No se encontraron productos en esta categoria."
                : "Aun no hay productos registrados en el sistema."}
            </p>
            {params.categoria && (
              <Button asChild className="mt-4">
                <Link href="/productos">Ver todos los productos</Link>
              </Button>
            )}
          </div>
        )}

        {/* Stats */}
        {productos.length > 0 && (
          <div className="mt-12 rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Resumen de Evaluacion
            </h3>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {productos.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Productos Evaluados
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {productos.filter((p) => p.indice_riesgo <= 40).length}
                </div>
                <div className="text-sm text-muted-foreground">Bajo Riesgo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    productos.filter(
                      (p) => p.indice_riesgo > 40 && p.indice_riesgo <= 60,
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Riesgo Moderado
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {productos.filter((p) => p.indice_riesgo > 60).length}
                </div>
                <div className="text-sm text-muted-foreground">Alto Riesgo</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
