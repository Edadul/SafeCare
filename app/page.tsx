import Link from "next/link";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { IngredientCard } from "@/components/ingredient-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product, Ingredient, Category } from "@/lib/types";
import {
  Shield,
  AlertTriangle,
  FlaskConical,
  Package,
  ArrowRight,
  Users,
  Baby,
  Heart,
  Activity,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getHomeData() {
  try {
    const [productsRes, ingredientsRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/ingredients/products`, { cache: "no-store" }),
      fetch(`${API_URL}/ingredients`, { cache: "no-store" }),
      fetch(`${API_URL}/categories`, { cache: "no-store" }),
    ]);

    if (!productsRes.ok || !ingredientsRes.ok || !categoriesRes.ok) {
      throw new Error("No fue posible cargar los datos iniciales.");
    }

    const [products, ingredients, categories] = await Promise.all([
      productsRes.json(),
      ingredientsRes.json(),
      categoriesRes.json(),
    ]);

    return {
      products,
      ingredients,
      categories,
    };
  } catch {
    return {
      products: [],
      ingredients: [],
      categories: [],
    };
  }
}

export default async function HomePage() {
  const { products, ingredients, categories } = await getHomeData();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Sistema de Informacion de Productos
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Protege tu salud de los{" "}
              <span className="text-primary">disruptores endocrinos</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
              Identifica ingredientes quimicos peligrosos en tus productos de
              cuidado personal. Aprende como estos compuestos pueden afectar tu
              sistema hormonal y causar pubertad precoz.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/productos">
                  <Package className="mr-2 h-5 w-5" />
                  Explorar Productos
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/ingredientes">
                  <FlaskConical className="mr-2 h-5 w-5" />
                  Ver Ingredientes Peligrosos
                </Link>
              </Button>
            </div>
            <div className="mt-6">
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="shadow-md"
                >
                  <Link href="/analizer">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Analizar Ingredientes de un Producto
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-background/80"
                >
                  <Link href="/resilience">
                    <Activity className="mr-2 h-5 w-5" />
                    Ver Apartado de Resiliencia
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground">
              Poblacion en Riesgo
            </h2>
            <p className="mt-2 text-muted-foreground">
              Grupos especialmente vulnerables a los disruptores endocrinos
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="text-center border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Baby className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Jovenes (10-16 años)
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  En etapa de desarrollo hormonal, muy susceptibles a
                  alteraciones endocrinas que pueden causar pubertad precoz.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Padres y Tutores
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Responsables de seleccionar productos seguros para sus hijos y
                  familia.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Mujeres Embarazadas
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  La exposicion durante el embarazo puede afectar el desarrollo
                  hormonal del bebe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-foreground">
                Categorias de Productos
              </h2>
              <p className="mt-2 text-muted-foreground">
                Explora productos por categoria
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category: Category) => (
                <Link
                  key={category.id}
                  href={`/productos?categoria=${category.id}`}
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dangerous Ingredients */}
      {ingredients.length > 0 && (
        <section className="py-16 bg-red-50/50 border-y border-red-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h2 className="text-2xl font-bold text-foreground">
                    Disruptores Endocrinos
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  Ingredientes que interfieren con tu sistema hormonal
                </p>
              </div>
              <Button
                variant="outline"
                asChild
                className="hidden sm:flex bg-transparent"
              >
                <Link href="/ingredientes">
                  Ver Todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ingredients.map((ingredient: Ingredient) => (
                <IngredientCard key={ingredient.id} ingredient={ingredient} />
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/ingredientes">
                  Ver Todos los Ingredientes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {products.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Productos Evaluados
                </h2>
                <p className="text-muted-foreground">
                  Productos con mayor indice de riesgo identificado
                </p>
              </div>
              <Button
                variant="outline"
                asChild
                className="hidden sm:flex bg-transparent"
              >
                <Link href="/productos">
                  Ver Todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product: Product) => (
                <ProductCard key={product.id} producto={product} />
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/productos">
                  Ver Todos los Productos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">SafeCare</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Sistema de Informacion para la evaluacion de productos de cuidado
              personal. Basado en investigacion cientifica sobre disruptores
              endocrinos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
