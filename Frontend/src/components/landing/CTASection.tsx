import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2, Trophy, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: 500, suffix: "+", label: "Membres Actifs", icon: Users },
  { value: 50, suffix: "+", label: "Cours par Semaine", icon: Calendar },
  { value: 98, suffix: "%", label: "Taux de Satisfaction", icon: Trophy },
];

const trustIndicators = [
  { icon: CheckCircle2, text: "Essai gratuit de 14 jours" },
  { icon: CheckCircle2, text: "Aucune carte de crédit requise" },
  { icon: CheckCircle2, text: "Support 24/7" },
];

function AnimatedStatBadge({
  value,
  suffix,
  label,
  icon: Icon,
  delay,
  isVisible
}: {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Users;
  delay: number;
  isVisible: boolean;
}) {
  const count = useAnimatedCounter({
    end: isVisible ? value : 0,
    duration: 2000,
    delay
  });

  return (
    <div className="flex flex-col items-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
      <Icon className="w-6 h-6 text-white/80 mb-2" />
      <div className="text-2xl md:text-3xl font-bold text-white">
        {count}{suffix}
      </div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  );
}

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 gradient-mesh opacity-20" />

      <div ref={ref} className="container mx-auto px-4">
        <div
          className={`relative rounded-3xl overflow-hidden ${isVisible ? "animate-scale-in" : "opacity-0"
            }`}
        >
          {/* Multi-layer Background */}
          <div className="absolute inset-0 gradient-vibrant animate-gradient" style={{ backgroundSize: '200% 200%' }} />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=600&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />

          {/* Animated Floating Shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-morph-blob" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-morph-blob" style={{ animationDelay: '4s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-2xl animate-rotate-slow" />

          {/* Decorative Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 py-16 md:py-24 px-8 md:px-16 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 animate-bounce-gentle">
                <Sparkles className="h-4 w-4 text-white animate-pulse" />
                <span className="text-sm font-medium text-white">
                  Commencez Votre Parcours Aujourd'hui
                </span>
              </div>

              {/* Heading with Text Shadow */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
                Prêt à Transformer Votre{" "}
                <span className="relative">
                  Gestion de Club
                  <span className="absolute -inset-1 bg-white/10 blur-lg rounded-lg" />
                </span>
                ?
              </h2>

              {/* Description */}
              <p className="text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
                Rejoignez des centaines de clubs sportifs qui ont optimisé leurs opérations
                et amélioré l'expérience de leurs membres avec notre plateforme.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-4">
                {stats.map((stat, index) => (
                  <AnimatedStatBadge
                    key={index}
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    icon={stat.icon}
                    delay={index * 200}
                    isVisible={isVisible}
                  />
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90 transition-all duration-300 shadow-elevated group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center font-semibold">
                      Accéder au Portail Admin
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg bg-transparent text-white border-white/40 hover:bg-white/15 hover:border-white/60 transition-all duration-300 backdrop-blur-sm"
                >
                  Contactez-Nous
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                {trustIndicators.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
                  >
                    <item.icon className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Glow Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 gradient-vibrant opacity-50" />
        </div>
      </div>
    </section>
  );
}
