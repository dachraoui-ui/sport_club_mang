import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { mockChartData, mockDashboardStats } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, TrendingDown, Users, DollarSign, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const StatisticsPage = () => {
  const [dateRange, setDateRange] = useState("6months");

  const kpiCards = [
    {
      title: "Revenus Totaux",
      value: "€245 680",
      change: 22.1,
      icon: DollarSign,
      gradient: "from-success to-primary",
    },
    {
      title: "Membres Actifs",
      value: "524",
      change: 12.5,
      icon: Users,
      gradient: "from-primary to-accent",
    },
    {
      title: "Activités Réalisées",
      value: "1 248",
      change: 8.3,
      icon: Activity,
      gradient: "from-accent to-secondary",
    },
    {
      title: "Durée Moy. de Session",
      value: "52 min",
      change: -2.4,
      icon: Calendar,
      gradient: "from-secondary to-primary",
    },
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Statistiques & Analytiques</h1>
          <p className="text-muted-foreground mt-1">
            Insights complètes sur les performances de votre club
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["30days", "6months", "1year"].map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(range)}
              className={dateRange === range ? "gradient-primary" : ""}
            >
              {range === "30days" ? "30 Jours" : range === "6months" ? "6 Mois" : "1 An"}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const isPositive = kpi.change >= 0;
          return (
            <div
              key={kpi.title}
              className="relative p-6 rounded-2xl bg-card border border-border/50 overflow-hidden hover-lift"
            >
              <div
                className={cn(
                  "absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20",
                  `bg-gradient-to-br ${kpi.gradient}`
                )}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                      kpi.gradient
                    )}
                  >
                    <kpi.icon className="h-6 w-6 text-white" />
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      isPositive ? "text-success" : "text-destructive"
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(kpi.change)}%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="text-3xl font-bold mt-1">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Membership Trend */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Évolution des Adhésions</h3>
              <p className="text-sm text-muted-foreground">Nombre de membres au fil du temps</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData.membershipTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="members"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Membership Distribution */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Répartition des Adhésions</h3>
              <p className="text-sm text-muted-foreground">Par type d'adhésion</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockChartData.membershipTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockChartData.membershipTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Popularity Full Width */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Popularité des Activités</h3>
            <p className="text-sm text-muted-foreground">Total des inscriptions par activité</p>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartData.activityPopularity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
                cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
              />
              <Bar
                dataKey="registrations"
                fill="hsl(var(--accent))"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
