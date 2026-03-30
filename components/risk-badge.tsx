import { cn } from "@/lib/utils";
import { getRiskLevel } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

interface RiskBadgeProps {
  level: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RiskBadge({
  level,
  showIcon = false,
  size = "md",
  className,
}: RiskBadgeProps) {
  const { label, color, bgColor } = getRiskLevel(level);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        bgColor,
        color,
        sizeClasses[size],
        className,
      )}
    >
      {showIcon && level >= 4 && <AlertTriangle className="h-3 w-3" />}
      {label}
    </span>
  );
}
