import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import type { Product, Category } from "@/lib/types";
import { Package } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Props {
  searchParams: Promise<{ categoria?: string; search?: string }>;
}

async function getProductos(categoriaId?: string) {
  try {
    const url = new URL(`${API_URL}/products`);

    if (categoriaId) {
      url.searchParams.set("categoryId", categoriaId);
    }

    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) {
      throw new Error("No fue posible cargar productos.");
    }

    return (await response.json()) as Product[];
  } catch {
    return [];
  }
}

async function getCategorias() {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("No fue posible cargar categorias.");
    }

    return (await response.json()) as Category[];
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
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Package className="h-5 w-5" />
            <span className="text-sm font-medium">Catalogo de Productos</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {categoriaActual
              ? `Productos: ${categoriaActual.name}`
              : "Todos los Productos"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explora el catalogo de SafeCare y consulta el indice de riesgo de
            cada producto segun sus ingredientes.
          </p>
        </div>

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
                  {categoria.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

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

        {productos.length > 0 && (
          <div className="mt-12 rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
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
                  {productos.filter((p) => (p.risk_index ?? 0) <= 40).length}
                </div>
                <div className="text-sm text-muted-foreground">Bajo Riesgo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    productos.filter((p) => {
                      const risk = p.risk_index ?? 0;
                      return risk > 40 && risk <= 60;
                    }).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Riesgo Moderado
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {productos.filter((p) => (p.risk_index ?? 0) > 60).length}
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
