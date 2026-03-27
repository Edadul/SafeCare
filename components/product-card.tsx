import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getProductRiskLevel } from "@/lib/types"
import type { Producto } from "@/lib/types"
import { AlertTriangle, CheckCircle, Package } from "lucide-react"

interface ProductCardProps {
  producto: Producto
}

export function ProductCard({ producto }: ProductCardProps) {
  const risk = getProductRiskLevel(producto.indice_riesgo)

  return (
    <Link href={`/productos/${producto.id}`}>
      <Card className={cn(
        "h-full transition-all hover:shadow-lg hover:-translate-y-1 border-2",
        risk.borderColor
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
              risk.bgColor,
              risk.color
            )}>
              {producto.indice_riesgo > 60 ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <CheckCircle className="h-3 w-3" />
              )}
              {risk.label}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-foreground line-clamp-1">{producto.nombre}</h3>
          <p className="text-sm text-muted-foreground mt-1">{producto.marca}</p>
          {producto.categoria && (
            <Badge variant="secondary" className="mt-3">
              {producto.categoria.nombre}
            </Badge>
          )}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Indice de Riesgo</span>
              <span className={cn("font-semibold", risk.color)}>{producto.indice_riesgo}/100</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  producto.indice_riesgo <= 20 ? "bg-green-500" :
                  producto.indice_riesgo <= 40 ? "bg-green-400" :
                  producto.indice_riesgo <= 60 ? "bg-yellow-500" :
                  producto.indice_riesgo <= 80 ? "bg-orange-500" : "bg-red-500"
                )}
                style={{ width: `${producto.indice_riesgo}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
