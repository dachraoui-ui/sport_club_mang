import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Users, Calendar, ClipboardList, BarChart3, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Users,
    title: "Gestion des Membres",
    description: "Profils membres complets, niveaux d'adhésion et expérience d'intégration fluide.",
    gradient: "from-blue-500 to-indigo-600",
    stats: "500+ Membres",
    highlight: "Le Plus Populaire",
  },
  {
    icon: Calendar,
    title: "Planification d'Activités",
    description: "Horaires de cours dynamiques, gestion des instructeurs et suivi de capacité en temps réel.",
    gradient: "from-violet-500 to-purple-600",
    stats: "50+ Cours",
  },
  {
    icon: ClipboardList,
    title: "Système d'Inscription",
    description: "Processus d'inscription simplifié avec confirmations instantanées et gestion de liste d'attente.",
    gradient: "from-rose-500 to-pink-600",
    stats: "1000+ Inscriptions",
  },
  {
    icon: BarChart3,
    title: "Tableau de Bord Analytique",
    description: "Insights puissants sur les tendances d'adhésion, métriques de revenus et performance des activités.",
    gradient: "from-amber-500 to-orange-600",
    stats: "Données en Temps Réel",
  },
];

const additionalFeatures = [
  { icon: Shield, label: "Sécurisé & Privé" },
  { icon: Zap, label: "Ultra Rapide" },
  { icon: Sparkles, label: "Interface Moderne" },
];

interface FeatureCardProps {
  feature: typeof features[0];
  index: number;
  isVisible: boolean;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}

function FeatureCard({ feature, index, isVisible, isHovered, onHover }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative p-8 rounded-3xl bg-card border border-border/50 cursor-pointer",
        "transition-all duration-500 ease-out",
        isVisible ? "animate-fade-in-up" : "opacity-0",
        isHovered ? "scale-105 shadow-2xl z-10" : "hover:scale-[1.02]"
      )}
      style={{
        animationDelay: `${index * 150}ms`,
        transform: isHovered ? 'translateY(-8px)' : undefined,
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Animated Gradient Border */}
      <div className={cn(
        "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500",
        isHovered ? "opacity-100" : "group-hover:opacity-60"
      )}>
        <div className="absolute inset-0 rounded-3xl gradient-border-animated" />
      </div>

      {/* Glow Effect */}
      <div className={cn(
        "absolute -inset-1 rounded-3xl blur-xl transition-opacity duration-500",
        `bg-gradient-to-br ${feature.gradient}`,
        isHovered ? "opacity-20" : "opacity-0"
      )} />

      {/* Highlight Badge */}
      {feature.highlight && (
        <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-semibold gradient-vibrant text-white shadow-glow-sm">
          {feature.highlight}
        </div>
      )}

      {/* Icon Container */}
      <div className="relative">
        <div className={cn(
          "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg",
          `${feature.gradient}`,
          "transition-all duration-500",
          isHovered ? "scale-110 shadow-glow" : "group-hover:scale-105"
        )}>
          <feature.icon className="h-8 w-8 text-white" />
        </div>

        {/* Floating Particles */}
        <div className={cn(
          "absolute -top-2 -right-2 w-4 h-4 rounded-full animate-bounce-gentle",
          `bg-gradient-to-br ${feature.gradient}`,
          "opacity-0 transition-opacity duration-300",
          isHovered ? "opacity-60" : ""
        )} style={{ animationDelay: '0.2s' }} />
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className={cn(
          "text-xl font-semibold mb-3 transition-all duration-300",
          isHovered ? "gradient-text" : ""
        )}>
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {feature.description}
        </p>

        {/* Stats Badge */}
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
          "bg-muted/50 text-muted-foreground",
          "transition-all duration-300",
          isHovered ? "bg-primary/10 text-primary" : ""
        )}>
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          {feature.stats}
        </div>
      </div>

      {/* Arrow CTA */}
      <div className={cn(
        "mt-6 flex items-center text-primary font-medium",
        "transition-all duration-300 transform",
        isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}>
        En savoir plus
        <ArrowRight className={cn(
          "ml-2 h-4 w-4 transition-transform",
          isHovered ? "translate-x-1" : ""
        )} />
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Enhanced Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl -translate-x-1/2 -translate-y-1/2 animate-morph-blob" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl translate-x-1/2 translate-y-1/2 animate-morph-blob" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-3xl animate-rotate-slow opacity-30" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium gradient-secondary text-secondary-foreground mb-4 shadow-glow-sm">
            <Sparkles className="w-4 h-4" />
            Fonctionnalités de la Plateforme
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Tout ce dont vous avez besoin pour{" "}
            <span className="gradient-text text-glow-sm">Gérer Votre Club</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Notre plateforme d'administration complète fournit tous les outils nécessaires pour gérer
            efficacement un club sportif prospère.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isVisible={isVisible}
              isHovered={hoveredIndex === index}
              onHover={setHoveredIndex}
            />
          ))}
        </div>

        {/* Additional Features Row */}
        <div className={cn(
          "flex flex-wrap justify-center gap-6 mt-12",
          isVisible ? "animate-fade-in-up delay-600" : "opacity-0"
        )}>
          {additionalFeatures.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full glass hover-lift cursor-pointer transition-all duration-300 hover:shadow-glow-sm"
            >
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-16 ${isVisible ? "animate-fade-in-up delay-700" : "opacity-0"}`}>
          <Link to="/login">
            <Button
              size="lg"
              className="h-14 px-8 text-lg gradient-vibrant hover:opacity-90 transition-all duration-300 shadow-glow animate-glow-ring group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Explorer la Console Admin
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
