import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { activitiesAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Calendar, Save, Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = 'http://127.0.0.1:8000';

const EditActivityPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code_act: "",
    nom_act: "",
    tarif_mensuel: "",
    capacite: "",
  });

  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) return;
      try {
        const activity = await activitiesAPI.getById(parseInt(id));
        setFormData({
          code_act: activity.code_act,
          nom_act: activity.nom_act,
          tarif_mensuel: activity.tarif_mensuel.toString(),
          capacite: activity.capacite.toString(),
        });
        if (activity.photo) {
          setExistingPhoto(activity.photo.startsWith('http') ? activity.photo : `${API_BASE_URL}${activity.photo}`);
        }
      } catch (error) {
        toast.error("Erreur lors du chargement de l'activité");
        navigate("/dashboard/activities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [id, navigate]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La photo ne doit pas dépasser 5 Mo");
        return;
      }
      setPhotoFile(file);
      setExistingPhoto(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setExistingPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsSubmitting(true);
      const submitData = {
        code_act: formData.code_act,
        nom_act: formData.nom_act,
        tarif_mensuel: parseFloat(formData.tarif_mensuel) || 0,
        capacite: parseInt(formData.capacite) || 1,
      };
      await activitiesAPI.update(parseInt(id), submitData, photoFile || undefined);
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

  const displayPhoto = photoPreview || existingPhoto;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          {/* Photo Upload */}
          <div className="space-y-3">
            <Label>Photo de l'activité</Label>
            <div className="flex items-start gap-4">
              {displayPhoto ? (
                <div className="relative group">
                  <img
                    src={displayPhoto}
                    alt="Aperçu"
                    className="w-32 h-32 object-cover rounded-xl border border-border"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Ajouter</span>
                </div>
              )}
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {displayPhoto ? "Changer la photo" : "Télécharger une photo"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Formats acceptés: JPG, PNG, GIF. Max 5 Mo.
                </p>
              </div>
            </div>
          </div>

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
                onChange={(e) => setFormData({ ...formData, tarif_mensuel: e.target.value })}
                placeholder="0"
                className="h-12"
                required
              />
              <p className="text-xs text-muted-foreground">
                Prix mensuel en Dinar Tunisien
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacite">Capacité Maximum</Label>
              <Input
                id="capacite"
                type="number"
                min={1}
                value={formData.capacite}
                onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
                placeholder="1"
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
