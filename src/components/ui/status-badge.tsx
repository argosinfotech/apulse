import { cn } from "@/lib/utils";

export type HealthStatus = "green" | "yellow" | "red";
export type Priority = "P0" | "P1" | "P2" | "P3";

interface StatusBadgeProps {
  status: HealthStatus;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const statusConfig = {
    green: { bg: "bg-success/10", text: "text-success", border: "border-success/20", dot: "bg-success" },
    yellow: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20", dot: "bg-warning" },
    red: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", dot: "bg-destructive" },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const priorityConfig = {
    P0: "bg-destructive text-destructive-foreground",
    P1: "bg-warning text-warning-foreground",
    P2: "bg-primary text-primary-foreground",
    P3: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
        priorityConfig[priority],
        className
      )}
    >
      {priority}
    </span>
  );
}

interface SizeBadgeProps {
  size: "S" | "M" | "L" | "XL";
  className?: string;
}

export function SizeBadge({ size, className }: SizeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border",
        className
      )}
    >
      {size}
    </span>
  );
}
