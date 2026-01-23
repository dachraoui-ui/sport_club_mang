import { mockChartData } from "@/data/mockData";
import { Users, Calendar, TrendingUp, Plus, CheckCircle } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "Nouveau membre inscrit": Users,
  "Inscription à une activité": Calendar,
  "Adhésion améliorée": TrendingUp,
  "Nouvelle activité créée": Plus,
  "Inscription approuvée": CheckCircle,
  "New member registered": Users,
  "Activity registration": Calendar,
  "Membership upgraded": TrendingUp,
  "New activity created": Plus,
  "Registration approved": CheckCircle,
};

export function RecentActivityFeed() {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 animate-fade-in-up opacity-0 delay-500" style={{ animationFillMode: "forwards" }}>
      <h3 className="text-lg font-semibold mb-4">Activité Récente</h3>
      <div className="space-y-4">
        {mockChartData.recentActivity.map((activity, index) => {
          const Icon = iconMap[activity.action] || Users;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors animate-fade-in opacity-0"
              style={{ animationDelay: `${600 + index * 100}ms`, animationFillMode: "forwards" }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.member && <span>{activity.member}</span>}
                  {activity.activity && <span> • {activity.activity}</span>}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
