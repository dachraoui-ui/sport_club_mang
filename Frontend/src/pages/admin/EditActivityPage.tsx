import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { activitiesAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Calendar, Save } from "lucide-react";
import { toast } from "sonner";

const EditActivityPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code_act: "",
    nom_act: "",
    tarif_mensuel: 0,
    capacite: 20,
  });

  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) return;
      try {
        const activity = await activitiesAPI.getById(parseInt(id));
        setFormData({
          code_act: activity.code_act,
          nom_act: activity.nom_act,
          tarif_mensuel: parseFloat(activity.tarif_mensuel.toString()),
          capacite: activity.capacite,
        });
      } catch (error) {
        toast.error("Erreur lors du chargement de l'activité");
        navigate("/dashboard/activities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsSubmitting(true);
      await activitiesAPI.update(parseInt(id), formData);
      toast.success("Activité mise à jour avec succès !");
      navigate("/dashboard/activities");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/activities")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Modifier l'Activité</h1>
          <p className="text-muted-foreground">Mettez à jour les informations de l'activité</p>
        </div>
      </div>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/activities")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Modifier l'Activité</h1>
          <p className="text-muted-foreground mt-1">
            Modifiez les informations de l'activité
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-2xl border border-border/50 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Détails de l'Activité</h2>
            <p className="text-sm text-muted-foreground">ID: {id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="code_act">Code Activité</Label>
              <Input
                id="code_act"
                value={formData.code_act}
                onChange={(e) => setFormData({ ...formData, code_act: e.target.value.toUpperCase() })}
                placeholder="ex: ACT001"
                className="h-12"
                required
              />
              <p className="text-xs text-muted-foreground">
                Code unique pour identifier l'activité
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom_act">Nom de l'Activité</Label>
              <Input
                id="nom_act"
                value={formData.nom_act}
                onChange={(e) => setFormData({ ...formData, nom_act: e.target.value })}
                placeholder="ex: Yoga, Natation, Football"
                className="h-12"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tarif_mensuel">Tarif Mensuel (DT)</Label>
              <Input
                id="tarif_mensuel"
                type="number"
                min={0}
                step={0.01}
                value={formData.tarif_mensuel}
                onChange={(e) => setFormData({ ...formData, tarif_mensuel: parseFloat(e.target.value) || 0 })}
                className="h-12"
                required
              />
              <p className="text-xs text-muted-foreground">
                Prix mensuel en euros
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacite">Capacité Maximum</Label>
              <Input
                id="capacite"
                type="number"
                min={1}
                value={formData.capacite}
                onChange={(e) => setFormData({ ...formData, capacite: parseInt(e.target.value) || 1 })}
                className="h-12"
                required
              />
              <p className="text-xs text-muted-foreground">
                Nombre maximum de participants
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/activities")}
              className="flex-1 h-12"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.code_act || !formData.nom_act}
              className="flex-1 h-12 bg-amber-500 hover:bg-amber-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer les Modifications
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActivityPage;
