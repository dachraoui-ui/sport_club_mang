import { useState } from "react";
import { mockRegistrations } from "@/data/mockData";
import { Registration } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const RegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.activityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || reg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setRegistrations(
      registrations.map((r) =>
        r.id === id ? { ...r, status: "Approved" as const } : r
      )
    );
    toast.success("Inscription approuvée !");
  };

  const handleReject = (id: string) => {
    setRegistrations(
      registrations.map((r) =>
        r.id === id ? { ...r, status: "Rejected" as const } : r
      )
    );
    toast.success("Inscription rejetée !");
  };

  const statusColors = {
    Pending: "bg-warning/10 text-warning border-warning/20",
    Approved: "bg-success/10 text-success border-success/20",
    Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const statusIcons = {
    Pending: Clock,
    Approved: CheckCircle,
    Rejected: XCircle,
  };

  const pendingCount = registrations.filter((r) => r.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inscriptions</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les inscriptions aux activités et les approbations
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 text-warning">
            <Clock className="h-5 w-5" />
            <span className="font-medium">{pendingCount} inscriptions en attente</span>
          </div>
        )}
      </div>

      {/* Filters */}
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
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les Statuts</SelectItem>
            <SelectItem value="Pending">En Attente</SelectItem>
            <SelectItem value="Approved">Approuvé</SelectItem>
            <SelectItem value="Rejected">Rejeté</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeline View for Pending */}
      {filterStatus === "Pending" && filteredRegistrations.length > 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="text-lg font-semibold mb-4">Approbations en Attente</h3>
          <div className="space-y-4">
            {filteredRegistrations
              .filter((r) => r.status === "Pending")
              .map((reg, index) => (
                <div
                  key={reg.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={reg.memberAvatar} />
                    <AvatarFallback>
                      {reg.memberName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{reg.memberName}</p>
                    <p className="text-sm text-muted-foreground">
                      Demande d'inscription à <span className="text-foreground font-medium">{reg.activityName}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Soumis le {reg.registrationDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(reg.id)}
                      className="gradient-primary"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(reg.id)}
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeter
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Membre</TableHead>
              <TableHead>Activité</TableHead>
              <TableHead>Date d'Inscription</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.map((reg, index) => {
              const StatusIcon = statusIcons[reg.status];
              return (
                <TableRow
                  key={reg.id}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={reg.memberAvatar} />
                        <AvatarFallback>
                          {reg.memberName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{reg.memberName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{reg.activityName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {reg.registrationDate}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("flex items-center gap-1 w-fit", statusColors[reg.status])}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {reg.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {reg.status === "Pending" && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleApprove(reg.id)}
                          className="text-success hover:bg-success/10"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReject(reg.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RegistrationsPage;
