import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { Trophy, Target, Heart, Zap, Award, Users } from "lucide-react";

const values = [
  {
    icon: Trophy,
    title: "Excellence",
    description: "Nous visons l'excellence dans tout ce que nous faisons, de nos installations à nos programmes de coaching.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Target,
    title: "Orienté Objectifs",
    description: "Chaque membre a des objectifs uniques. Nous offrons des parcours personnalisés pour vous aider à les atteindre.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Heart,
    title: "Communauté",
    description: "Plus qu'une salle de sport, nous sommes une famille. Rejoignez une communauté solidaire qui célèbre chaque victoire.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Restez à la pointe avec des équipements de dernière génération et les méthodes d'entraînement les plus récentes.",
    gradient: "from-accent to-secondary",
  },
];

const stats = [
  { value: 14, suffix: "+", label: "Ans d'Expérience", icon: Award },
  { value: 500, suffix: "+", label: "Membres Actifs", icon: Users },
  { value: 50, suffix: "+", label: "Cours par Semaine", icon: Trophy },
];

function AnimatedStat({ value, suffix, label, icon: Icon, delay }: {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Award;
  delay: number;
}) {
  const count = useAnimatedCounter({ end: value, duration: 2000, delay });

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl glass hover-lift transition-all duration-300">
      <div className="w-12 h-12 rounded-xl gradient-vibrant flex items-center justify-center shadow-glow-sm">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold gradient-text">{count}{suffix}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

export function AboutSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-morph-blob" />
      <div className="absolute bottom-1/4 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl animate-morph-blob" style={{ animationDelay: '4s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium gradient-primary text-primary-foreground shadow-glow-sm">
                <Trophy className="w-4 h-4" />
                À Propos de Notre Club
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Là où les <span className="gradient-text text-glow-sm">Champions</span> Sont Façonnés
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fondé en 2010, notre club sportif est passé d'un petit centre de fitness à
                une installation athlétique complète servant plus de <span className="text-foreground font-medium">500 membres actifs</span>. Nous croyons
                au pouvoir transformateur du sport et du fitness pour changer des vies.
              </p>
            </div>

            {/* Values Grid with Enhanced Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`group p-5 rounded-2xl glass hover-lift cursor-pointer border border-transparent hover:border-primary/20 transition-all duration-300 ${isVisible ? "animate-fade-in-up" : "opacity-0"
                    }`}
                  style={{ animationDelay: `${(index + 2) * 150}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Grid */}
          <div className={`relative transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            {/* Decorative Ring */}
            <div className="absolute -inset-4 rounded-3xl border border-primary/10 animate-glow-ring opacity-50" />

            <div className="grid grid-cols-2 gap-4 relative">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-elevated hover-lift group">
                  <img
                    src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=500&fit=crop"
                    alt="Gym equipment"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-elevated hover-lift group">
                  <img
                    src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop"
                    alt="Swimming pool"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-elevated hover-lift group">
                  <img
                    src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=300&fit=crop"
                    alt="Training session"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-elevated hover-lift relative group">
                  <img
                    src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=500&fit=crop"
                    alt="Running track"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  {/* Overlay Stats Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl glass-strong backdrop-blur-xl">
                    <div className="text-2xl font-bold gradient-text">14+ Ans</div>
                    <div className="text-sm text-muted-foreground">D'Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          ref={statsRef}
          className={`grid md:grid-cols-3 gap-6 mt-16 transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {stats.map((stat, index) => (
            <AnimatedStat
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              delay={statsVisible ? index * 200 : 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
