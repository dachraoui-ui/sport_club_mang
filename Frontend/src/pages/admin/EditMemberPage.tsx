import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { membersAPI } from "@/lib/api";
import { Member } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, UserCog } from "lucide-react";
import { toast } from "sonner";

const EditMemberPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    age: 18,
    telephone: "",
  });

  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      try {
        const member = await membersAPI.getById(parseInt(id));
        setFormData({
          nom: member.nom,
          prenom: member.prenom,
          age: member.age,
          telephone: member.telephone,
        });
      } catch (error) {
        toast.error("Membre introuvable");
        navigate("/dashboard/members");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMember();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.telephone.length !== 8) {
      toast.error("Le numéro de téléphone doit contenir 8 chiffres");
      return;
    }

    try {
      setIsSubmitting(true);
      await membersAPI.update(parseInt(id!), formData);
      toast.success("Membre mis à jour avec succès !");
      navigate("/dashboard/members");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
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
          onClick={() => navigate("/dashboard/members")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Modifier le Membre</h1>
          <p className="text-muted-foreground mt-1">
            Modifiez les informations du membre
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-2xl border border-border/50 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
            <UserCog className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Informations du Membre</h2>
            <p className="text-sm text-muted-foreground">Modifiez les champs nécessaires</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                placeholder="Entrez le prénom"
                className="h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Entrez le nom"
                className="h-12"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="age">Âge</Label>
              <Input
                id="age"
                type="number"
                min={1}
                max={120}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone (8 chiffres)</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value.replace(/\D/g, '').slice(0, 8) })}
                placeholder="12345678"
                maxLength={8}
                className="h-12"
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.telephone.length}/8 chiffres
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/members")}
              className="flex-1 h-12"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.nom || !formData.prenom || formData.telephone.length !== 8}
              className="flex-1 h-12 gradient-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <UserCog className="h-4 w-4 mr-2" />
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

export default EditMemberPage;
