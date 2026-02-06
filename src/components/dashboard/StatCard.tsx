import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  variant?: "default" | "success" | "warning" | "destructive" | "accent";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const variantStyles = {
    default: "bg-card",
    success: "bg-success/5 border-success/20",
    warning: "bg-warning/5 border-warning/20",
    destructive: "bg-destructive/5 border-destructive/20",
    accent: "bg-accent/5 border-accent/20",
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <div
      className={cn(
        "p-3 rounded-lg border shadow-card transition-all hover:shadow-soft",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn("p-1.5 rounded", iconStyles[variant])}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-foreground leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{title}</p>
          </div>
        </div>
        {trend && (
          <span
            className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap",
              trend.positive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
    </div>
  );
}
