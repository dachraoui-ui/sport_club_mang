import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockChartData } from "@/data/mockData";

export function ActivityPopularityChart() {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 animate-fade-in-up opacity-0 delay-400" style={{ animationFillMode: "forwards" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Popularité des Activités</h3>
          <p className="text-sm text-muted-foreground">Total des inscriptions par activité</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Inscriptions</span>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockChartData.activityPopularity} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 10px 40px -10px hsl(var(--foreground) / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
            />
            <Bar
              dataKey="registrations"
              fill="hsl(var(--accent))"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
