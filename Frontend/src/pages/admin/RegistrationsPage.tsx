import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enrollmentsAPI } from "@/lib/api";
import { Enrollment } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Trash2, Loader2, Calendar, ClipboardList } from "lucide-react";
import { toast } from "sonner";

const RegistrationsPage = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const enrollmentsData = await enrollmentsAPI.getAll();
      setEnrollments(enrollmentsData);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const memberName = `${enrollment.membre_prenom} ${enrollment.membre_nom}`.toLowerCase();
    const activityName = enrollment.activite_nom.toLowerCase();
    const query = searchQuery.toLowerCase();
    return memberName.includes(query) || activityName.includes(query);
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette inscription ?")) return;
    try {
      await enrollmentsAPI.delete(id);
      toast.success("Inscription supprimée avec succès !");
      fetchData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-600 rounded-3xl p-8 text-white animate-fade-in shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <ClipboardList className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Gestion des Inscriptions</h1>
                <p className="text-purple-100">Gérez les inscriptions aux activités</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/dashboard/registrations/add")}
              size="lg"
              className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle Inscription
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par membre ou activité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "Aucune inscription trouvée" : "Aucune inscription pour le moment"}
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => navigate("/dashboard/registrations/add")}
                className="mt-4 gradient-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer votre première inscription
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Membre</TableHead>
                <TableHead>Activité</TableHead>
                <TableHead>Date d'Inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {enrollment.membre_prenom[0]}{enrollment.membre_nom[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{enrollment.membre_prenom} {enrollment.membre_nom}</p>
                        <p className="text-sm text-muted-foreground">ID: {enrollment.membre_id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {enrollment.activite_nom}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(enrollment.date_inscription).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(enrollment.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default RegistrationsPage;
