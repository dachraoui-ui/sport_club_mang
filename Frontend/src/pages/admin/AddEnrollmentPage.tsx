import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enrollmentsAPI, membersAPI, activitiesAPI } from "@/lib/api";
import { Member, Activity } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, ClipboardList, Users, Calendar } from "lucide-react";
import { toast } from "sonner";

const AddEnrollmentPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [formData, setFormData] = useState({
    membre_id: "",
    activite_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, activitiesData] = await Promise.all([
          membersAPI.getAll(),
          activitiesAPI.getAll(),
        ]);
        setMembers(membersData);
        setActivities(activitiesData);
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.membre_id || !formData.activite_id) {
      toast.error("Veuillez sélectionner un membre et une activité");
      return;
    }

    try {
      setIsSubmitting(true);
      await enrollmentsAPI.create({
        membre_id: parseInt(formData.membre_id),
        activite_id: parseInt(formData.activite_id),
      });
      toast.success("Inscription créée avec succès !");
      navigate("/dashboard/registrations");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMember = members.find((m) => m.id.toString() === formData.membre_id);
  const selectedActivity = activities.find((a) => a.id.toString() === formData.activite_id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/registrations")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nouvelle Inscription</h1>
          <p className="text-muted-foreground mt-1">
            Inscrire un membre à une activité
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-2xl border border-border/50 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
            <ClipboardList className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Détails de l'Inscription</h2>
            <p className="text-sm text-muted-foreground">Sélectionnez un membre et une activité</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Membre
            </Label>
            <Select
              value={formData.membre_id}
              onValueChange={(value) => setFormData({ ...formData, membre_id: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Sélectionnez un membre" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.prenom} {member.nom} - Tél: {member.telephone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {members.length === 0 && (
              <p className="text-xs text-amber-500">
                Aucun membre disponible. Créez d'abord un membre.
              </p>
            )}
          </div>

          {/* Activity Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Activité
            </Label>
            <Select
              value={formData.activite_id}
              onValueChange={(value) => setFormData({ ...formData, activite_id: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Sélectionnez une activité" />
              </SelectTrigger>
              <SelectContent>
                {activities.map((activity) => (
                  <SelectItem key={activity.id} value={activity.id.toString()}>
                    {activity.nom_act} ({activity.code_act}) - {activity.tarif_mensuel} DT/mois
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activities.length === 0 && (
              <p className="text-xs text-amber-500">
                Aucune activité disponible. Créez d'abord une activité.
              </p>
            )}
          </div>

          {/* Preview Card */}
          {(selectedMember || selectedActivity) && (
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">Aperçu de l'inscription</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {selectedMember && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {selectedMember.prenom[0]}{selectedMember.nom[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{selectedMember.prenom} {selectedMember.nom}</p>
                      <p className="text-xs text-muted-foreground">{selectedMember.telephone}</p>
                    </div>
                  </div>
                )}
                {selectedActivity && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedActivity.nom_act}</p>
                      <p className="text-xs text-muted-foreground">{selectedActivity.tarif_mensuel} DT/mois</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/registrations")}
              className="flex-1 h-12"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.membre_id || !formData.activite_id}
              className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                <>
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Créer l'Inscription
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default AddEnrollmentPage;
