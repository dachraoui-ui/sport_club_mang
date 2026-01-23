import { useState } from "react";
import { mockMembers } from "@/data/mockData";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membershipType: "Standard" as Member["membershipType"],
    status: "Active" as Member["status"],
  });

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    const newMember: Member = {
      id: String(Date.now()),
      ...formData,
      joinDate: new Date().toISOString().split("T")[0],
    };
    setMembers([newMember, ...members]);
    setIsAddOpen(false);
    resetForm();
    toast.success("Membre ajouté avec succès !");
  };

  const handleEdit = () => {
    if (!editingMember) return;
    setMembers(
      members.map((m) =>
        m.id === editingMember.id ? { ...editingMember, ...formData } : m
      )
    );
    setEditingMember(null);
    resetForm();
    toast.success("Membre mis à jour avec succès !");
  };

  const handleDelete = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    toast.success("Membre supprimé avec succès !");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      membershipType: "Standard",
      status: "Active",
    });
  };

  const openEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      membershipType: member.membershipType,
      status: member.status,
    });
  };

  const statusColors = {
    Active: "bg-success/10 text-success border-success/20",
    Inactive: "bg-muted text-muted-foreground border-muted",
    Pending: "bg-warning/10 text-warning border-warning/20",
  };

  const membershipColors = {
    Premium: "bg-primary/10 text-primary border-primary/20",
    Standard: "bg-accent/10 text-accent border-accent/20",
    Basic: "bg-secondary/10 text-secondary border-secondary/20",
  };

  const MemberForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nom Complet</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Entrez le nom complet"
        />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Entrez l'adresse email"
        />
      </div>
      <div className="space-y-2">
        <Label>Téléphone</Label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Entrez le numéro de téléphone"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type d'Adhésion</Label>
          <Select
            value={formData.membershipType}
            onValueChange={(value: Member["membershipType"]) =>
              setFormData({ ...formData, membershipType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value: Member["status"]) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Actif</SelectItem>
              <SelectItem value="Inactive">Inactif</SelectItem>
              <SelectItem value="Pending">En Attente</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
          <h1 className="text-3xl font-bold">Membres</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les membres de votre club et leurs adhésions
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary shadow-glow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Membre
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Membre</DialogTitle>
            </DialogHeader>
            <MemberForm onSubmit={handleAdd} submitLabel="Ajouter le Membre" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des membres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les Statuts</SelectItem>
            <SelectItem value="Active">Actif</SelectItem>
            <SelectItem value="Inactive">Inactif</SelectItem>
            <SelectItem value="Pending">En Attente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Membre</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Adhésion</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date d'Inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member, index) => (
              <TableRow
                key={member.id}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{member.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(membershipColors[member.membershipType])}>
                    {member.membershipType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(statusColors[member.status])}>
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{member.joinDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Dialog
                      open={editingMember?.id === member.id}
                      onOpenChange={(open) => !open && setEditingMember(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(member)}
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Modifier le Membre</DialogTitle>
                        </DialogHeader>
                        <MemberForm onSubmit={handleEdit} submitLabel="Enregistrer les Modifications" />
                      </DialogContent>
                    </Dialog>
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
      </div>
    </div>
  );
};

export default MembersPage;
