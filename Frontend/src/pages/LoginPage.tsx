import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, Eye, EyeOff, ArrowRight, Phone, Lock } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ phoneOrId: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=1600&fit=crop"
            alt="Gym"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-vibrant opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Dumbbell className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">SportHub</span>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Bienvenue,<br />Champion
            </h1>
            <p className="text-xl text-white/80 max-w-md">
              Accédez à votre console d'administration pour gérer les membres, les activités et développer votre communauté sportive.
            </p>
            <div className="flex items-center gap-6 text-white/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span>500+ Membres Actifs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span>50+ Activités</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-white/60">© 2024 SportHub. Tous droits réservés.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-vibrant flex items-center justify-center shadow-glow">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">SportHub</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold">Connexion</h2>
            <p className="text-muted-foreground mt-2">
              Entrez vos identifiants pour accéder à la console d'administration
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phoneOrId" className="text-sm font-medium">
                Numéro de Téléphone ou ID
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phoneOrId"
                  type="text"
                  placeholder="Entrez votre téléphone ou ID"
                  value={formData.phoneOrId}
                  onChange={(e) => setFormData({ ...formData, phoneOrId: e.target.value })}
                  className="h-14 pl-12 rounded-xl border-border/50 focus:border-primary focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de Passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-14 pl-12 pr-12 rounded-xl border-border/50 focus:border-primary focus:ring-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-primary hover:underline font-medium">
                Mot de passe oublié ?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg gradient-vibrant hover:opacity-90 transition-all duration-300 shadow-glow group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se Connecter
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground">
            Vous n'avez pas de compte ?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Contacter l'Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
