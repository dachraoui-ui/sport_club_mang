import { LucideIcon } from "lucide-react";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  gradient: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  prefix = "",
  suffix = "",
  gradient,
  delay = 0,
}: StatCardProps) {
  const animatedValue = useAnimatedCounter({ end: value, duration: 2000, delay });
  const isPositive = change >= 0;

  return (
    <div
      className="relative p-6 rounded-2xl bg-card border border-border/50 hover-lift overflow-hidden group"
    >
      {/* Background Gradient */}
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity",
          gradient
        )}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              gradient
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
              isPositive
                ? "text-success bg-success/10"
                : "text-destructive bg-destructive/10"
            )}
          >
            <span>{isPositive ? "+" : ""}{change}%</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">
            {prefix}
            {animatedValue.toLocaleString()}
            {suffix}
          </p>
        </div>
      </div>
    </div>
  );
}
