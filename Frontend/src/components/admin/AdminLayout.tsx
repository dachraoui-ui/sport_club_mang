import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  BarChart3,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Settings,
  Search,
  Sun,
  Moon,
  Monitor,
  User,
  Mail,
  Shield,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de Bord", path: "/dashboard" },
  { icon: Users, label: "Membres", path: "/dashboard/members" },
  { icon: Calendar, label: "Activités", path: "/dashboard/activities" },
  { icon: ClipboardList, label: "Inscriptions", path: "/dashboard/registrations" },
  { icon: BarChart3, label: "Statistiques", path: "/dashboard/statistics" },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    localStorage.setItem("sidebar-collapsed", String(value));
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const themeOptions = [
    { value: "light", label: "Clair", icon: Sun },
    { value: "dark", label: "Sombre", icon: Moon },
    { value: "system", label: "Système", icon: Monitor },
  ] as const;

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground z-40 flex flex-col transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-vibrant flex items-center justify-center shadow-glow-sm flex-shrink-0">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold">SportHub</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl group",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon
                  className="h-5 w-5 flex-shrink-0"
                />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-sidebar-border space-y-2 mt-auto">
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">Paramètres</span>}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Paramètres</DialogTitle>
              </DialogHeader>
              
              {/* Profile Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Profil Administrateur</h3>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                      <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || 'AD'}</AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Camera className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold">{user?.username || 'Admin'}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{user?.email || 'admin@sporthub.com'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      <span>{user?.is_staff ? 'Administrateur' : 'Utilisateur'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" defaultValue="Utilisateur Admin" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="admin@sporthub.com" />
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Theme Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Apparence</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
                        theme === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <option.icon className={cn(
                        "h-6 w-6",
                        theme === option.value ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className={cn(
                        "text-sm font-medium",
                        theme === option.value ? "text-primary" : "text-muted-foreground"
                      )}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setSettingsOpen(false)}>
                  Enregistrer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => handleCollapse(!collapsed)}
          className="absolute -right-4 top-20 w-8 h-8 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-50"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 h-screen overflow-y-auto transition-[margin] duration-300 ease-in-out",
          collapsed ? "ml-20" : "ml-64"
        )}
      >
        {/* Header */}
        <header className="h-16 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher membres, activités..."
              className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </Button>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || 'AD'}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user?.username || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">{user?.is_staff ? 'Administrateur' : 'Utilisateur'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
