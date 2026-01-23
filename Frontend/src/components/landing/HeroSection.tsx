import { useParallax } from "@/hooks/useParallax";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Animated stat card component
function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  const numericValue = parseInt(value.replace(/\D/g, ''));
  const suffix = value.replace(/\d/g, '');
  const count = useAnimatedCounter({ end: numericValue, duration: 2500, delay });
  
  return (
    <div className="text-center group">
      <div className="text-3xl md:text-4xl font-bold gradient-text text-glow-sm">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1 group-hover:text-foreground transition-colors">
        {label}
      </div>
    </div>
  );
}

// Floating decorative shape
function FloatingShape({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div 
      className={`absolute rounded-full animate-morph-blob opacity-30 blur-3xl ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

export function HeroSection() {
  const { ref, offset } = useParallax({ speed: 0.3 });
  const { ref: contentRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for subtle parallax on floating elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        ref={ref}
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${offset}px)` }}
      >
        <img
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&h=1080&fit=crop"
          alt="Athletes running on track"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 gradient-mesh opacity-60" />
      </div>

      {/* Animated Floating Shapes */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
      >
        <FloatingShape 
          className="w-96 h-96 gradient-primary -top-20 -left-20" 
          delay={0} 
        />
        <FloatingShape 
          className="w-80 h-80 gradient-secondary top-1/3 -right-10" 
          delay={2} 
        />
        <FloatingShape 
          className="w-64 h-64 bg-accent/50 bottom-20 left-1/4" 
          delay={4} 
        />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 z-[2] opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 container mx-auto px-4 text-center"
      >
        <div className={`max-w-4xl mx-auto space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass animate-fade-in gradient-border-animated">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground/90">
              Rejoignez 500+ Membres Actifs Aujourd'hui
            </span>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>

          {/* Main Heading with Enhanced Typography */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight animate-fade-in-up opacity-0 delay-100">
            <span className="block text-foreground text-glow-sm">Élevez Votre</span>
            <span className="block animate-text-shine mt-2">Parcours Sportif</span>
          </h1>

          {/* Enhanced Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up opacity-0 delay-300 leading-relaxed">
            Découvrez des installations de classe mondiale, un coaching expert et une communauté dynamique 
            dédiée à vous aider à atteindre vos <span className="text-primary font-medium">objectifs fitness</span>.
          </p>

          {/* CTA Buttons with Enhanced Styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0 delay-500">
            <Link to="/login">
              <Button
                size="lg"
                className="h-14 px-8 text-lg gradient-vibrant hover:opacity-90 transition-all duration-300 shadow-glow animate-glow-ring group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Commencer
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg glass border-foreground/20 hover:bg-foreground/10 transition-all duration-300 group hover-lift"
            >
              <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Voir la Visite
            </Button>
          </div>

          {/* Stats Row with Animated Counters */}
          <div className="grid grid-cols-3 gap-8 pt-12 animate-fade-in-up opacity-0 delay-700">
            <StatCard value="500+" label="Membres Actifs" delay={800} />
            <StatCard value="50+" label="Cours Hebdomadaires" delay={1000} />
            <StatCard value="15+" label="Coachs Experts" delay={1200} />
          </div>

          {/* Floating 3D Cards Preview */}
          <div className="hidden lg:flex justify-center gap-6 pt-8 animate-fade-in-up opacity-0 delay-800">
            {[
              { label: "Entraînement Premium", icon: "🏋️" },
              { label: "Coaching Pro", icon: "🎯" },
              { label: "Communauté", icon: "🤝" },
            ].map((item, index) => (
              <div
                key={index}
                className="card-3d"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="card-3d-inner glass px-6 py-4 rounded-2xl hover-lift cursor-pointer">
                  <span className="text-2xl mr-2">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
}
