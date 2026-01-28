import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { membersAPI } from "@/lib/api";
import { Member } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Loader2, Users } from "lucide-react";
import { toast } from "sonner";

const MembersPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch members
  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await membersAPI.getAll({ search: searchQuery || undefined });
      setMembers(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des membres");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchMembers]);

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) return;
    try {
      await membersAPI.delete(id);
      toast.success("Membre supprimé avec succès !");
      fetchMembers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600 rounded-3xl p-8 text-white animate-fade-in shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Gestion des Membres</h1>
                <p className="text-emerald-100">Gérez les membres de votre club</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/dashboard/members/add")}
              size="lg"
              className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouveau Membre
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou prénom..."
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
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "Aucun membre trouvé" : "Aucun membre pour le moment"}
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => navigate("/dashboard/members/add")}
                className="mt-4 gradient-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter votre premier membre
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Membre</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Actif</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {member.prenom[0]}{member.nom[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.prenom} {member.nom}</p>
                        <p className="text-sm text-muted-foreground">ID: {member.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.age} ans</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.email || "Non renseigné"}</TableCell>
                  <TableCell className="text-muted-foreground">{member.telephone}</TableCell>
                  <TableCell>
                    <Badge variant={member.actif ? "default" : "secondary"}>
                      {member.actif ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/dashboard/members/edit/${member.id}`)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(member.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default MembersPage;
