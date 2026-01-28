import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { membersAPI, subscriptionsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, UserPlus, CreditCard, User } from "lucide-react";
import { toast } from "sonner";

const AddMemberPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createSubscription, setCreateSubscription] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    age: 18,
    telephone: "",
    email: "",
    actif: true,
  });
  const [subscriptionData, setSubscriptionData] = useState({
    type_abonnement: 'MONTHLY',
    date_debut: new Date().toISOString().split('T')[0],
    actif: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.telephone.length !== 8) {
      toast.error("Le numéro de téléphone doit contenir 8 chiffres");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create member first
      const memberResponse = await membersAPI.create(formData);
      const memberId = memberResponse.id;
      
      // Create subscription if requested
      if (createSubscription && memberId) {
        try {
          await subscriptionsAPI.create({
            membre_id: memberId,
            ...subscriptionData,
          });
          toast.success("Membre et abonnement créés avec succès !");
        } catch (error) {
          toast.warning("Membre créé, mais erreur lors de la création de l'abonnement");
        }
      } else {
        toast.success("Membre ajouté avec succès !");
      }
      
      navigate("/dashboard/members");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'ajout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/members")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Ajouter un Membre</h1>
          <p className="text-muted-foreground">Remplissez les informations du nouveau membre</p>
        </div>
      </div>

      {/* Form Card with Tabs */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <Tabs defaultValue="membre" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b h-14 bg-muted/30">
            <TabsTrigger value="membre" className="gap-2 data-[state=active]:bg-background">
              <User className="h-4 w-4" />
              Informations du Membre
            </TabsTrigger>
            <TabsTrigger value="abonnement" className="gap-2 data-[state=active]:bg-background">
              <CreditCard className="h-4 w-4" />
              Abonnement
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            {/* Tab 1: Informations du Membre */}
            <TabsContent value="membre" className="p-8 space-y-6 mt-0">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Informations Personnelles</h2>
                    <p className="text-sm text-muted-foreground">Renseignements du membre</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom *</Label>
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
                      <Label htmlFor="nom">Nom *</Label>
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
                      <Label htmlFor="age">Âge *</Label>
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
                      <Label htmlFor="telephone">Téléphone (8 chiffres) *</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="exemple@email.com"
                      className="h-12"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="actif"
                      checked={formData.actif}
                      onCheckedChange={(checked) => setFormData({ ...formData, actif: checked as boolean })}
                    />
                    <Label htmlFor="actif" className="cursor-pointer">
                      Membre actif
                    </Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Abonnement */}
            <TabsContent value="abonnement" className="p-8 space-y-6 mt-0">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">Abonnement</h2>
                    <p className="text-sm text-muted-foreground">Créer un abonnement (optionnel)</p>
                  </div>
                  <Checkbox
                    id="create_subscription"
                    checked={createSubscription}
                    onCheckedChange={(checked) => setCreateSubscription(checked as boolean)}
                  />
                </div>

                {createSubscription ? (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="type_abonnement">Type d'abonnement *</Label>
                        <Select
                          value={subscriptionData.type_abonnement}
                          onValueChange={(value) => setSubscriptionData({ ...subscriptionData, type_abonnement: value })}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MONTHLY">Mensuel (1 mois)</SelectItem>
                            <SelectItem value="3_MONTHS">Trimestriel (3 mois)</SelectItem>
                            <SelectItem value="6_MONTHS">Semestriel (6 mois)</SelectItem>
                            <SelectItem value="ANNUAL">Annuel (1 an)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date_debut">Date de début *</Label>
                        <Input
                          id="date_debut"
                          type="date"
                          value={subscriptionData.date_debut}
                          onChange={(e) => setSubscriptionData({ ...subscriptionData, date_debut: e.target.value })}
                          className="h-12"
                          required={createSubscription}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sub_actif"
                        checked={subscriptionData.actif}
                        onCheckedChange={(checked) => setSubscriptionData({ ...subscriptionData, actif: checked as boolean })}
                      />
                      <Label htmlFor="sub_actif" className="cursor-pointer">
                        Abonnement actif
                      </Label>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        💡 La date de fin sera calculée automatiquement en fonction du type d'abonnement choisi.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Cochez la case ci-dessus pour créer un abonnement
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Vous pourrez aussi ajouter un abonnement plus tard
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Submit Buttons - Always visible */}
            <div className="flex items-center gap-4 px-8 pb-8 pt-4 border-t border-border/50">
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
                    Création en cours...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {createSubscription ? "Créer Membre + Abonnement" : "Ajouter le Membre"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  );
};

export default AddMemberPage;
