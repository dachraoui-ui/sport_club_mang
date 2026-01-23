import { useState, useEffect } from "react";
import { Users, Calendar, ClipboardList, TrendingUp, Loader2 } from "lucide-react";
import { statsAPI, membersAPI, activitiesAPI, enrollmentsAPI, ActivityStats } from "@/lib/api";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardData {
  totalMembers: number;
  totalActivities: number;
  totalEnrollments: number;
  mostPopular: { nom: string; inscriptions: number } | null;
  leastPopular: { nom: string; inscriptions: number } | null;
  activityStats: ActivityStats[];
}

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsOverview, activityStats, members, activities, enrollments] = await Promise.all([
          statsAPI.getOverview(),
          statsAPI.getActivities(),
          membersAPI.getAll(),
          activitiesAPI.getAll(),
          enrollmentsAPI.getAll(),
        ]);

        setData({
          totalMembers: members.length,
          totalActivities: activities.length,
          totalEnrollments: enrollments.length,
          mostPopular: statsOverview.most_popular_activity,
          leastPopular: statsOverview.least_popular_activity,
          activityStats,
        });
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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
        Erreur lors du chargement des données
      </div>
    );
  }

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(142, 76%, 36%)", "hsl(var(--secondary))"];

  // Prepare chart data
  const activityChartData = data.activityStats.map((stat) => ({
    name: stat.nom_act.length > 15 ? stat.nom_act.substring(0, 15) + "..." : stat.nom_act,
    inscriptions: stat.nb_inscriptions,
    places: stat.places_disponibles,
  }));

  const pieData = data.activityStats.map((stat) => ({
    name: stat.nom_act,
    value: stat.nb_inscriptions,
  })).filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue ! Voici ce qui se passe dans votre club aujourd'hui.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Membres"
          value={data.totalMembers}
          icon={Users}
          gradient="bg-gradient-to-br from-primary to-accent"
        />
        <StatCard
          title="Activités"
          value={data.totalActivities}
          icon={Calendar}
          gradient="bg-gradient-to-br from-accent to-secondary"
        />
        <StatCard
          title="Inscriptions"
          value={data.totalEnrollments}
          icon={ClipboardList}
          gradient="bg-gradient-to-br from-secondary to-primary"
        />
        <StatCard
          title="Plus Populaire"
          value={data.mostPopular?.inscriptions || 0}
          subtitle={data.mostPopular?.nom || "N/A"}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-green-500 to-primary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart - Inscriptions par Activité */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Inscriptions par Activité</h3>
            <p className="text-sm text-muted-foreground">Nombre d'inscrits par activité</p>
          </div>
          <div className="h-[300px]">
            {activityChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityChartData}>
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
                  <Bar
                    dataKey="inscriptions"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name="Inscriptions"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart - Répartition des Inscriptions */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Répartition des Inscriptions</h3>
            <p className="text-sm text-muted-foreground">Distribution par activité</p>
          </div>
          <div className="h-[300px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name.substring(0, 10)}... (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieData.map((_, index) => (
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

      {/* Activity Details Table */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Détails des Activités</h3>
          <p className="text-sm text-muted-foreground">Vue d'ensemble de la capacité et des tarifs</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Activité</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Code</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Inscriptions</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Capacité</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Places Dispo.</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Tarif/Mois</th>
              </tr>
            </thead>
            <tbody>
              {data.activityStats.map((stat, index) => (
                <tr key={stat.code_act} className="border-b border-border/30 hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{stat.nom_act}</td>
                  <td className="py-3 px-4 text-muted-foreground">{stat.code_act}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                      {stat.nb_inscriptions}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">{stat.capacite}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={stat.places_disponibles === 0 ? "text-destructive" : "text-success"}>
                      {stat.places_disponibles}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">{stat.tarif_mensuel}€</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.activityStats.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune activité pour le moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <div className="relative p-6 rounded-2xl bg-card border border-border/50 overflow-hidden hover-lift">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 ${gradient}`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export default DashboardPage;
