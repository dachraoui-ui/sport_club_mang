import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { activitiesAPI, statsAPI, ActivityStats } from "@/lib/api";
import { Activity } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Grid3X3, List, Users, Loader2, DollarSign, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const ActivitiesPage = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch activities
  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      const [activitiesData, statsData] = await Promise.all([
        activitiesAPI.getAll({ search: searchQuery || undefined }),
        statsAPI.getActivities()
      ]);
      setActivities(activitiesData);
      setActivityStats(statsData);
    } catch (error) {
      toast.error("Erreur lors du chargement des activités");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActivities();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchActivities]);

  // Get stats for an activity
  const getActivityStats = (codeAct: string): ActivityStats | undefined => {
    return activityStats.find(s => s.code_act === codeAct);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) return;
    try {
      await activitiesAPI.delete(id);
      toast.success("Activité supprimée avec succès !");
      fetchActivities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-pink-500 to-fuchsia-600 rounded-3xl p-8 text-white animate-fade-in shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Calendar className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Gestion des Activités</h1>
                <p className="text-rose-100">Gérez les activités de votre club</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/dashboard/activities/add")}
              size="lg"
              className="bg-white text-rose-600 hover:bg-rose-50 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle Activité
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des activités..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "gradient-primary" : ""}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "gradient-primary" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? "Aucune activité trouvée" : "Aucune activité pour le moment"}
          </p>
          {!searchQuery && (
            <Button 
              onClick={() => navigate("/dashboard/activities/add")}
              className="mt-4 gradient-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer votre première activité
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => {
            const stats = getActivityStats(activity.code_act);
            const enrolledCount = stats?.nb_inscriptions || 0;
            const fillRate = (enrolledCount / activity.capacite) * 100;

            return (
              <div
                key={activity.id}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                {/* Activity Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{activity.nom_act}</h3>
                        <Badge variant="outline" className="text-xs">
                          {activity.code_act}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => navigate(`/dashboard/activities/edit/${activity.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">Tarif mensuel</span>
                      </div>
                      <span className="font-semibold text-primary">
                        {activity.tarif_mensuel} DT
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Participants
                        </span>
                        <span className="font-medium">
                          {enrolledCount}/{activity.capacite}
                        </span>
                      </div>
                      <Progress 
                        value={fillRate} 
                        className={cn(
                          "h-2",
                          fillRate >= 90 ? "bg-destructive/20" : "bg-primary/20"
                        )}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {fillRate >= 90 ? "Presque complet" : `${Math.round(fillRate)}% rempli`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Activité</th>
                <th className="text-left p-4 font-medium">Code</th>
                <th className="text-left p-4 font-medium">Tarif</th>
                <th className="text-left p-4 font-medium">Capacité</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => {
                const stats = getActivityStats(activity.code_act);
                const enrolledCount = stats?.nb_inscriptions || 0;

                return (
                  <tr key={activity.id} className="border-t border-border/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{activity.nom_act}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{activity.code_act}</Badge>
                    </td>
                    <td className="p-4 font-semibold text-primary">
                      {activity.tarif_mensuel} DT/mois
                    </td>
                    <td className="p-4">
                      <span className="text-muted-foreground">
                        {enrolledCount}/{activity.capacite}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => navigate(`/dashboard/activities/edit/${activity.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(activity.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
