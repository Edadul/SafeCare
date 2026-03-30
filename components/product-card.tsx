import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getProductRiskLevel } from "@/lib/types"
import type { Product } from "@/lib/types"
import { AlertTriangle, CheckCircle, Package } from "lucide-react"

interface ProductCardProps {
  producto: Product
}

export function ProductCard({ producto }: ProductCardProps) {
  const riskIndex = producto.risk_index ?? 0
  const risk = getProductRiskLevel(riskIndex)

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
              {riskIndex > 60 ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <CheckCircle className="h-3 w-3" />
              )}
              {risk.label}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-foreground line-clamp-1">{producto.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{producto.brand}</p>
          {producto.category && (
            <Badge variant="secondary" className="mt-3">
              {producto.category.name}
            </Badge>
          )}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Indice de Riesgo</span>
              <span className={cn("font-semibold", risk.color)}>{riskIndex}/100</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  riskIndex <= 20 ? "bg-green-500" :
                  riskIndex <= 40 ? "bg-green-400" :
                  riskIndex <= 60 ? "bg-yellow-500" :
                  riskIndex <= 80 ? "bg-orange-500" : "bg-red-500"
                )}
                style={{ width: `${riskIndex}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
