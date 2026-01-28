import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { membersAPI, subscriptionsAPI, Subscription } from "@/lib/api";
import { Member } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, UserCog, Calendar, CreditCard, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const EditMemberPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [isEditingSubscription, setIsEditingSubscription] = useState(false);
  const [subscriptionForm, setSubscriptionForm] = useState({
    type_abonnement: 'MONTHLY',
    date_debut: new Date().toISOString().split('T')[0],
    actif: true,
  });
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    age: 18,
    telephone: "",
    email: "",
    actif: true,
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
          email: member.email || "",
          actif: member.actif !== undefined ? member.actif : true,
        });
        
        // Fetch subscription
        try {
          const subs = await subscriptionsAPI.getAll({ member_id: parseInt(id) });
          if (subs.length > 0) {
            setSubscription(subs[0]);
          }
        } catch (error) {
          // No subscription found
        }
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

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const result = await subscriptionsAPI.create({
        membre_id: parseInt(id!),
        ...subscriptionForm,
      });
      toast.success("Abonnement créé avec succès !");
      
      // Refresh subscription data
      const subs = await subscriptionsAPI.getAll({ member_id: parseInt(id!) });
      if (subs.length > 0) {
        setSubscription(subs[0]);
      }
      setShowSubscriptionForm(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création de l'abonnement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscription) return;
    
    try {
      setIsSubmitting(true);
      await subscriptionsAPI.update(subscription.id, subscriptionForm);
      toast.success("Abonnement mis à jour avec succès !");
      
      // Refresh subscription data
      const subs = await subscriptionsAPI.getAll({ member_id: parseInt(id!) });
      if (subs.length > 0) {
        setSubscription(subs[0]);
      }
      setIsEditingSubscription(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la mise à jour de l'abonnement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubscription = async () => {
    if (!subscription) return;
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet abonnement ?")) return;
    
    try {
      setIsSubmitting(true);
      await subscriptionsAPI.delete(subscription.id);
      toast.success("Abonnement supprimé avec succès !");
      setSubscription(null);
      setIsEditingSubscription(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression de l'abonnement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubscription = () => {
    if (subscription) {
      setSubscriptionForm({
        type_abonnement: subscription.type_abonnement,
        date_debut: subscription.date_debut,
        actif: subscription.actif,
      });
      setIsEditingSubscription(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingSubscription(false);
    setShowSubscriptionForm(false);
    setSubscriptionForm({
      type_abonnement: 'MONTHLY',
      date_debut: new Date().toISOString().split('T')[0],
      actif: true,
    });
  };

  const getSubscriptionStatus = (sub: Subscription) => {
    const today = new Date();
    const endDate = new Date(sub.date_fin);
    
    if (!sub.actif) {
      return { label: "Inactif", variant: "secondary" as const };
    }
    
    if (endDate < today) {
      return { label: "Expiré", variant: "destructive" as const };
    }
    
    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 7) {
      return { label: `Expire bientôt (${daysLeft}j)`, variant: "outline" as const };
    }
    
    return { label: "Actif", variant: "default" as const };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/members")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Modifier le Membre</h1>
          <p className="text-muted-foreground">Mettez à jour les informations du membre</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Member Form */}
        <div className="lg:col-span-2">
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
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right column - Subscription Card */}
        <div className="lg:col-span-1">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle>Abonnement</CardTitle>
                </div>
                {!subscription && !showSubscriptionForm && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSubscriptionForm(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardDescription>Gérer l'abonnement du membre</CardDescription>
            </CardHeader>
            <CardContent>
              {subscription && !isEditingSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <Badge variant="secondary">
                      {subscription.type_abonnement_display}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Début</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(subscription.date_debut).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fin</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(subscription.date_fin).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Statut</span>
                    <Badge variant={getSubscriptionStatus(subscription).variant}>
                      {getSubscriptionStatus(subscription).label}
                    </Badge>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleEditSubscription}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteSubscription}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (showSubscriptionForm || isEditingSubscription) ? (
                <form onSubmit={isEditingSubscription ? handleUpdateSubscription : handleCreateSubscription} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type_abonnement">Type d'abonnement</Label>
                    <Select
                      value={subscriptionForm.type_abonnement}
                      onValueChange={(value) => setSubscriptionForm({ ...subscriptionForm, type_abonnement: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Mensuel</SelectItem>
                        <SelectItem value="3_MONTHS">3 Mois</SelectItem>
                        <SelectItem value="6_MONTHS">6 Mois</SelectItem>
                        <SelectItem value="ANNUAL">Annuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_debut">Date de début</Label>
                    <Input
                      id="date_debut"
                      type="date"
                      value={subscriptionForm.date_debut}
                      onChange={(e) => setSubscriptionForm({ ...subscriptionForm, date_debut: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sub_actif"
                      checked={subscriptionForm.actif}
                      onCheckedChange={(checked) => setSubscriptionForm({ ...subscriptionForm, actif: checked as boolean })}
                    />
                    <Label htmlFor="sub_actif" className="cursor-pointer text-sm">
                      Actif
                    </Label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="sm"
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : isEditingSubscription ? (
                        "Mettre à jour"
                      ) : (
                        "Créer"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Aucun abonnement actif
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowSubscriptionForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un abonnement
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditMemberPage;
