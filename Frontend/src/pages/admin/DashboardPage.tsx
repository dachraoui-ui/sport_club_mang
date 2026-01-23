import { Users, Calendar, ClipboardList, DollarSign } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { MembershipChart } from "@/components/admin/MembershipChart";
import { ActivityPopularityChart } from "@/components/admin/ActivityPopularityChart";
import { RecentActivityFeed } from "@/components/admin/RecentActivityFeed";
import { mockDashboardStats } from "@/data/mockData";

const DashboardPage = () => {
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
          value={mockDashboardStats.totalMembers}
          change={mockDashboardStats.memberGrowth}
          icon={Users}
          gradient="bg-gradient-to-br from-primary to-accent"
          delay={0}
        />
        <StatCard
          title="Activités Actives"
          value={mockDashboardStats.activeActivities}
          change={mockDashboardStats.activityGrowth}
          icon={Calendar}
          gradient="bg-gradient-to-br from-accent to-secondary"
          delay={100}
        />
        <StatCard
          title="Inscriptions en Attente"
          value={mockDashboardStats.pendingRegistrations}
          change={mockDashboardStats.registrationGrowth}
          icon={ClipboardList}
          gradient="bg-gradient-to-br from-secondary to-primary"
          delay={200}
        />
        <StatCard
          title="Revenus Mensuels"
          value={mockDashboardStats.monthlyRevenue}
          change={mockDashboardStats.revenueGrowth}
          icon={DollarSign}
          prefix="€"
          gradient="bg-gradient-to-br from-success to-primary"
          delay={300}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <MembershipChart />
        <ActivityPopularityChart />
      </div>

      {/* Recent Activity */}
      <RecentActivityFeed />
    </div>
  );
};

export default DashboardPage;
