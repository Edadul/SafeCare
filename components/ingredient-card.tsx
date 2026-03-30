import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/risk-badge";
import { cn } from "@/lib/utils";
import type { Ingredient } from "@/lib/types";
import { AlertTriangle, FlaskConical, BookOpen } from "lucide-react";

interface IngredientCardProps {
  ingredient: Ingredient;
  compact?: boolean;
}

export function IngredientCard({
  ingredient,
  compact = false,
}: IngredientCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            ingredient.is_endocrine_disruptor ? "bg-red-100" : "bg-secondary",
          )}
        >
          <FlaskConical
            className={cn(
              "h-4 w-4",
              ingredient.is_endocrine_disruptor
                ? "text-red-600"
                : "text-muted-foreground",
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">
            {ingredient.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {ingredient.scientific_name}
          </p>
        </div>
        <RiskBadge level={ingredient.risk_level} size="sm" />
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "h-full",
        ingredient.is_endocrine_disruptor && "border-red-200 bg-red-50/50",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              ingredient.is_endocrine_disruptor ? "bg-red-100" : "bg-secondary",
            )}
          >
            <FlaskConical
              className={cn(
                "h-5 w-5",
                ingredient.is_endocrine_disruptor
                  ? "text-red-600"
                  : "text-muted-foreground",
              )}
            />
          </div>
          <RiskBadge level={ingredient.risk_level} showIcon />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="font-semibold text-foreground">{ingredient.name}</h3>
          {ingredient.scientific_name && (
            <p className="text-xs text-muted-foreground italic mt-0.5">
              {ingredient.scientific_name}
            </p>
          )}
        </div>

        {ingredient.is_endocrine_disruptor && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Disruptor Endocrino
          </Badge>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2">
          {ingredient.risk_description}
        </p>

        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-xs font-medium text-foreground mb-1">
            Efectos en la Salud:
          </p>
          <p className="text-xs text-muted-foreground line-clamp-3">
            {ingredient.health_effects}
          </p>
        </div>

        {ingredient.scientific_source && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span className="truncate">{ingredient.scientific_source}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
