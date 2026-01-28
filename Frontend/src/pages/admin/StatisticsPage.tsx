import { useState, useEffect } from "react";
import {
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
import { statsAPI, membersAPI, activitiesAPI, enrollmentsAPI, ActivityStats } from "@/lib/api";
import { Users, DollarSign, Activity, TrendingUp, Loader2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StatsData {
  totalMembers: number;
  totalActivities: number;
  totalEnrollments: number;
  totalRevenue: number;
  activityStats: ActivityStats[];
  membersPerActivity: Record<string, { nom: string; prenom: string }[]>;
}

const StatisticsPage = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const [activityStats, membersPerActivity, members, activities, enrollments] = await Promise.all([
          statsAPI.getActivities(),
          statsAPI.getMembersPerActivity(),
          membersAPI.getAll(),
          activitiesAPI.getAll(),
          enrollmentsAPI.getAll(),
        ]);

        // Calculate total revenue (sum of tarif * inscriptions for each activity)
        const totalRevenue = activityStats.reduce((sum, stat) => {
          return sum + (stat.tarif_mensuel * stat.nb_inscriptions);
        }, 0);

        setData({
          totalMembers: members.length,
          totalActivities: activities.length,
          totalEnrollments: enrollments.length,
          totalRevenue,
          activityStats,
          membersPerActivity,
        });
      } catch (error) {
        toast.error("Erreur lors du chargement des statistiques");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Erreur lors du chargement des statistiques
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Revenus Totaux",
      value: `${data.totalRevenue.toFixed(2)} DT`,
      icon: DollarSign,
      gradient: "from-green-500 to-primary",
    },
    {
      title: "Membres Actifs",
      value: data.totalMembers.toString(),
      icon: Users,
      gradient: "from-primary to-accent",
    },
    {
      title: "Activités",
      value: data.totalActivities.toString(),
      icon: Activity,
      gradient: "from-accent to-secondary",
    },
    {
      title: "Inscriptions",
      value: data.totalEnrollments.toString(),
      icon: TrendingUp,
      gradient: "from-secondary to-primary",
    },
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(142, 76%, 36%)", "hsl(var(--secondary))", "#8884d8"];

  // Prepare chart data
  const barChartData = data.activityStats.map((stat) => ({
    name: stat.nom_act.length > 12 ? stat.nom_act.substring(0, 12) + "..." : stat.nom_act,
    inscriptions: stat.nb_inscriptions,
    capacite: stat.capacite,
  }));

  const pieChartData = data.activityStats
    .filter((stat) => stat.nb_inscriptions > 0)
    .map((stat) => ({
      name: stat.nom_act,
      value: stat.nb_inscriptions,
    }));

  const revenueByActivity = data.activityStats.map((stat) => ({
    name: stat.nom_act.length > 12 ? stat.nom_act.substring(0, 12) + "..." : stat.nom_act,
    revenue: stat.tarif_mensuel * stat.nb_inscriptions,
  }));

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-teal-500 to-sky-600 rounded-3xl p-8 text-white animate-fade-in shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Statistiques</h1>
              <p className="text-cyan-100">Analysez les performances de votre club</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => (
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
              </div>
              <p className="text-sm text-muted-foreground">{kpi.title}</p>
              <p className="text-3xl font-bold mt-1">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart - Inscriptions par Activité */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Inscriptions vs Capacité</h3>
            <p className="text-sm text-muted-foreground">Comparaison par activité</p>
          </div>
          <div className="h-[300px]">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
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
                  />
                  <Legend />
                  <Bar dataKey="inscriptions" fill="hsl(var(--primary))" name="Inscriptions" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="capacite" fill="hsl(var(--muted-foreground))" name="Capacité" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart - Distribution */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Répartition des Adhésions</h3>
            <p className="text-sm text-muted-foreground">Par activité</p>
          </div>
          <div className="h-[300px]">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Aucune inscription pour le moment
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Revenus par Activité</h3>
          <p className="text-sm text-muted-foreground">Revenus mensuels générés</p>
        </div>
        <div className="h-[300px]">
          {revenueByActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByActivity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} DT`, "Revenus"]}
                />
                <Bar dataKey="revenue" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} name="Revenus (DT)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Aucune donnée de revenus
            </div>
          )}
        </div>
      </div>

      {/* Members per Activity */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Membres par Activité</h3>
          <p className="text-sm text-muted-foreground">Liste des membres inscrits à chaque activité</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(data.membersPerActivity).map(([activityName, members]) => (
            <div key={activityName} className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-semibold mb-3 text-primary">{activityName}</h4>
              {members.length > 0 ? (
                <ul className="space-y-2">
                  {members.map((member, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {member.prenom} {member.nom}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">Aucun membre inscrit</p>
              )}
            </div>
          ))}
          {Object.keys(data.membersPerActivity).length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Aucune activité avec des membres inscrits
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
