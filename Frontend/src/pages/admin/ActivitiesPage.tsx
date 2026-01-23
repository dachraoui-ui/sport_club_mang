import { useState } from "react";
import { mockActivities } from "@/data/mockData";
import { Activity } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Grid3X3, List, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    schedule: "",
    instructor: "",
    maxParticipants: 20,
    category: "",
    status: "Active" as Activity["status"],
  });

  const filteredActivities = activities.filter(
    (activity) =>
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    const newActivity: Activity = {
      id: String(Date.now()),
      ...formData,
      currentParticipants: 0,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    };
    setActivities([newActivity, ...activities]);
    setIsAddOpen(false);
    resetForm();
    toast.success("Activité créée avec succès !");
  };

  const handleEdit = () => {
    if (!editingActivity) return;
    setActivities(
      activities.map((a) =>
        a.id === editingActivity.id
          ? { ...editingActivity, ...formData }
          : a
      )
    );
    setEditingActivity(null);
    resetForm();
    toast.success("Activité mise à jour avec succès !");
  };

  const handleDelete = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
    toast.success("Activité supprimée avec succès !");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      schedule: "",
      instructor: "",
      maxParticipants: 20,
      category: "",
      status: "Active",
    });
  };

  const openEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      schedule: activity.schedule,
      instructor: activity.instructor,
      maxParticipants: activity.maxParticipants,
      category: activity.category,
      status: activity.status,
    });
  };

  const statusColors = {
    Active: "bg-success/10 text-success border-success/20",
    Upcoming: "bg-primary/10 text-primary border-primary/20",
    Full: "bg-warning/10 text-warning border-warning/20",
    Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const ActivityForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nom de l'Activité</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Entrez le nom de l'activité"
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Entrez la description de l'activité"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Horaire</Label>
          <Input
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            placeholder="ex: Lun, Mer - 18:00"
          />
        </div>
        <div className="space-y-2">
          <Label>Instructeur</Label>
          <Input
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            placeholder="Nom de l'instructeur"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Participants Max</Label>
          <Input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) =>
              setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="ex: Fitness, Bien-être"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Statut</Label>
        <Select
          value={formData.status}
          onValueChange={(value: Activity["status"]) =>
            setFormData({ ...formData, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Actif</SelectItem>
            <SelectItem value="Upcoming">À Venir</SelectItem>
            <SelectItem value="Full">Complet</SelectItem>
            <SelectItem value="Cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onSubmit} className="w-full gradient-primary">
        {submitLabel}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Activités</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les activités et les horaires de votre club
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary shadow-glow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une Activité
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer une Nouvelle Activité</DialogTitle>
            </DialogHeader>
            <ActivityForm onSubmit={handleAdd} submitLabel="Créer l'Activité" />
          </DialogContent>
        </Dialog>
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

      {/* Activities Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover-lift"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge
                  variant="outline"
                  className={cn(
                    "absolute top-4 right-4",
                    statusColors[activity.status]
                  )}
                >
                  {activity.status}
                </Badge>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-semibold text-white">{activity.name}</h3>
                  <p className="text-sm text-white/80">{activity.category}</p>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {activity.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{activity.schedule}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {activity.currentParticipants}/{activity.maxParticipants}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {Math.round((activity.currentParticipants / activity.maxParticipants) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(activity.currentParticipants / activity.maxParticipants) * 100}
                    className="h-2"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <Dialog
                    open={editingActivity?.id === activity.id}
                    onOpenChange={(open) => !open && setEditingActivity(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(activity)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Modifier l'Activité</DialogTitle>
                      </DialogHeader>
                      <ActivityForm onSubmit={handleEdit} submitLabel="Enregistrer les Modifications" />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(activity.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50">
          {filteredActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <img
                src={activity.image}
                alt={activity.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{activity.name}</h3>
                  <Badge variant="outline" className={cn(statusColors[activity.status])}>
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.schedule}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {activity.currentParticipants}/{activity.maxParticipants} participants
              </div>
              <div className="flex items-center gap-2">
                <Dialog
                  open={editingActivity?.id === activity.id}
                  onOpenChange={(open) => !open && setEditingActivity(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(activity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Modifier l'Activité</DialogTitle>
                    </DialogHeader>
                    <ActivityForm onSubmit={handleEdit} submitLabel="Enregistrer les Modifications" />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(activity.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
