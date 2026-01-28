import { useState, useEffect } from "react";
import { Calendar, Clock, Filter, Plus, Edit, Trash2, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { classSessionsAPI, activitiesAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ClassSession {
  id: number;
  activite: {
    id: number;
    nom_act: string;
    code_act: string;
  };
  date: string;
  heure_debut: string;
  heure_fin: string;
}

interface Activity {
  id: number;
  code_act: string;
  nom_act: string;
  tarif_mensuel: number;
  capacite: number;
  photo?: string;
}

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const SchedulePage = () => {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    activite_id: "",
    date: "",
    heure_debut: "",
    heure_fin: "",
  });

  useEffect(() => {
    loadSessions();
    loadActivities();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await classSessionsAPI.getAll();
      setSessions(data);
      console.log('Sessions chargées:', data);
    } catch (error) {
      console.error('Erreur lors du chargement des séances:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de charger les séances",
        variant: "destructive",
      });
    }
  };

  const loadActivities = async () => {
    try {
      const data = await activitiesAPI.getAll();
      setActivities(data);
      console.log('Activités chargées:', data);
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de charger les activités",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      activite_id: "",
      date: "",
      heure_debut: "",
      heure_fin: "",
    });
    setEditingSession(null);
  };

  const handleAddSession = async () => {
    if (!formData.activite_id || !formData.date || !formData.heure_debut || !formData.heure_fin) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Tentative d\'ajout de séance:', formData);
      await classSessionsAPI.create(formData);
      loadSessions();
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Séance ajoutée",
        description: "La séance a été ajoutée avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la séance:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter la séance",
        variant: "destructive",
      });
    }
  };

  const handleEditSession = async () => {
    if (!editingSession) return;

    try {
      await classSessionsAPI.update(editingSession.id, formData);
      loadSessions();
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Séance modifiée",
        description: "La séance a été mise à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la séance",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette séance ?")) return;

    try {
      await classSessionsAPI.delete(sessionId);
      loadSessions();
      toast({
        title: "Séance supprimée",
        description: "La séance a été supprimée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la séance",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (session: ClassSession) => {
    setEditingSession(session);
    setFormData({
      activite_id: session.activite.id.toString(),
      date: session.date,
      heure_debut: session.heure_debut,
      heure_fin: session.heure_fin,
    });
    setIsEditDialogOpen(true);
  };

  const filteredSessions = sessions.filter(session => {
    const matchesActivity = selectedActivity === "all" || session.activite.id.toString() === selectedActivity;
    return matchesActivity;
  });

  const totalSessions = filteredSessions.length;
  const uniqueActivities = new Set(filteredSessions.map(s => s.activite.id)).size;

  // Get dates for current week
  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + (currentWeek * 7));
    
    return daysOfWeek.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  };

  const weekDates = getWeekDates();

  // Get sessions for a specific day and time
  const getSessionsForSlot = (dayIndex: number, timeSlot: string) => {
    const targetDate = weekDates[dayIndex];
    const dateStr = targetDate.toISOString().split('T')[0];
    
    return filteredSessions.filter(session => {
      return session.date === dateStr && session.heure_debut === timeSlot;
    });
  };

  // Get activity color
  const getActivityColor = (activityId: number) => {
    const colors = [
      'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300',
      'bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300',
      'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300',
      'bg-orange-500/20 border-orange-500 text-orange-700 dark:text-orange-300',
      'bg-pink-500/20 border-pink-500 text-pink-700 dark:text-pink-300',
      'bg-cyan-500/20 border-cyan-500 text-cyan-700 dark:text-cyan-300',
    ];
    return colors[activityId % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-3xl p-8 text-white animate-fade-in shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <CalendarDays className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Emploi du Temps</h1>
                <p className="text-indigo-100">Gérez les séances d'activités</p>
              </div>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle Séance
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Séances</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Séances planifiées
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activités Programmées</CardTitle>
            <div className="p-2 bg-accent/10 rounded-lg">
              <Clock className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{uniqueActivities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Activités différentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & View Toggle */}
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filtrer par activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les activités</SelectItem>
                  {activities.map((activity) => (
                    <SelectItem key={activity.id} value={activity.id.toString()}>
                      {activity.nom_act}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendrier
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Liste
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Navigation for Calendar View */}
      {viewMode === 'calendar' && (
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentWeek(currentWeek - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <p className="font-semibold">
                  Semaine du {weekDates[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} 
                  {' au '}
                  {weekDates[5].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentWeek(currentWeek + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Grid View */}
      {viewMode === 'calendar' ? (
        <Card className="shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="p-3 text-left font-semibold bg-muted/50 sticky left-0 z-10 min-w-[100px]">
                    Heure
                  </th>
                  {daysOfWeek.map((day, index) => {
                    const date = weekDates[index];
                    const isToday = date.toDateString() === new Date().toDateString();
                    return (
                      <th
                        key={day}
                        className={cn(
                          "p-3 text-center font-semibold bg-muted/50 min-w-[150px]",
                          isToday && "bg-primary/10"
                        )}
                      >
                        <div>{day}</div>
                        <div className={cn(
                          "text-xs font-normal",
                          isToday && "text-primary font-semibold"
                        )}>
                          {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot} className="border-b border-border hover:bg-muted/30">
                    <td className="p-2 text-sm font-medium text-muted-foreground bg-muted/30 sticky left-0 z-10">
                      {timeSlot}
                    </td>
                    {daysOfWeek.map((_, dayIndex) => {
                      const sessionsInSlot = getSessionsForSlot(dayIndex, timeSlot);
                      const date = weekDates[dayIndex];
                      const dateStr = date.toISOString().split('T')[0];
                      
                      return (
                        <td
                          key={dayIndex}
                          className="p-1 align-top min-h-[80px] relative group"
                        >
                          {sessionsInSlot.length > 0 ? (
                            <div className="space-y-1">
                              {sessionsInSlot.map((session) => (
                                <div
                                  key={session.id}
                                  className={cn(
                                    "p-2 rounded-lg border-l-4 text-xs cursor-pointer hover:shadow-md transition-all",
                                    getActivityColor(session.activite.id)
                                  )}
                                  onClick={() => openEditDialog(session)}
                                >
                                  <div className="font-semibold">{session.activite.nom_act}</div>
                                  <div className="text-xs opacity-80">
                                    {session.heure_debut} - {session.heure_fin}
                                  </div>
                                  <div className="text-xs opacity-70">{session.activite.code_act}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                const endTime = timeSlots[timeSlots.indexOf(timeSlot) + 1] || '21:00';
                                setFormData({
                                  activite_id: "",
                                  date: dateStr,
                                  heure_debut: timeSlot,
                                  heure_fin: endTime,
                                });
                                setIsAddDialogOpen(true);
                              }}
                              className="w-full h-full min-h-[60px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-muted-foreground hover:bg-primary/5 rounded"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* List View - Sessions Table */
        <Card className="shadow-md overflow-hidden">
          <CardHeader>
            <CardTitle>Liste des Séances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-semibold">Activité</th>
                    <th className="p-3 text-left font-semibold">Code</th>
                    <th className="p-3 text-left font-semibold">Date</th>
                    <th className="p-3 text-left font-semibold">Heure Début</th>
                    <th className="p-3 text-left font-semibold">Heure Fin</th>
                    <th className="p-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Aucune séance trouvée</p>
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map((session) => (
                      <tr key={session.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-3 font-medium">{session.activite.nom_act}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                            {session.activite.code_act}
                          </span>
                        </td>
                        <td className="p-3">
                          {new Date(session.date).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="p-3">{session.heure_debut}</td>
                        <td className="p-3">{session.heure_fin}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(session)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSession(session.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Session Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Ajouter une Séance</DialogTitle>
            <DialogDescription>
              Planifiez une nouvelle séance d'activité.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="activity">Activité</Label>
              <Select
                value={formData.activite_id}
                onValueChange={(value) => setFormData({ ...formData, activite_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une activité" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map((activity) => (
                    <SelectItem key={activity.id} value={activity.id.toString()}>
                      {activity.nom_act} ({activity.code_act})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heure_debut">Heure Début</Label>
                <Input
                  id="heure_debut"
                  type="time"
                  value={formData.heure_debut}
                  onChange={(e) => setFormData({ ...formData, heure_debut: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heure_fin">Heure Fin</Label>
                <Input
                  id="heure_fin"
                  type="time"
                  value={formData.heure_fin}
                  onChange={(e) => setFormData({ ...formData, heure_fin: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleAddSession} className="bg-primary">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Session Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Modifier la Séance</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la séance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-activity">Activité</Label>
              <Select
                value={formData.activite_id}
                onValueChange={(value) => setFormData({ ...formData, activite_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une activité" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map((activity) => (
                    <SelectItem key={activity.id} value={activity.id.toString()}>
                      {activity.nom_act} ({activity.code_act})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-heure_debut">Heure Début</Label>
                <Input
                  id="edit-heure_debut"
                  type="time"
                  value={formData.heure_debut}
                  onChange={(e) => setFormData({ ...formData, heure_debut: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-heure_fin">Heure Fin</Label>
                <Input
                  id="edit-heure_fin"
                  type="time"
                  value={formData.heure_fin}
                  onChange={(e) => setFormData({ ...formData, heure_fin: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleEditSession} className="bg-primary">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulePage;
