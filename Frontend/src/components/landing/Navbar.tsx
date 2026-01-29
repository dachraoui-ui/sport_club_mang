import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell, Menu, X, ArrowRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Detect active section for highlighting
      const sections = ["about", "features", "contact"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Accueil", href: "/" },
    { label: "À Propos", href: "#about" },
    { label: "Fonctionnalités", href: "#features" },
    { label: "Contact", href: "#contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/" && !activeSection;
    return activeSection === href.replace("#", "");
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.getElementById(href.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] py-3 glass-strong shadow-soft backdrop-blur-xl border-b border-border/30 sticky"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-vibrant flex items-center justify-center transition-all duration-300 shadow-glow-sm group-hover:scale-110 group-hover:rotate-3">
              <Dumbbell className="h-5 w-5 text-white transition-transform group-hover:rotate-12" />
            </div>
            <span className="text-xl font-bold gradient-text">SportHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("#")) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className={cn(
                  "relative px-4 py-2 rounded-lg font-medium transition-all duration-300",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
                {/* Active Indicator */}
                <span className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full gradient-primary transition-all duration-300",
                  isActive(link.href) ? "w-6 opacity-100" : "w-0 opacity-0"
                )} />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Connexion
              </Button>
            </Link>
            <Link to="/calendar">
              <Button className="gradient-vibrant hover:opacity-90 transition-all duration-300 shadow-glow-sm hover:shadow-glow group">
                Voir Calendrier
                <CalendarDays className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "md:hidden p-2.5 rounded-xl transition-all duration-300",
              isMobileMenuOpen
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <X className={cn(
                "absolute inset-0 h-6 w-6 transition-all duration-300",
                isMobileMenuOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
              )} />
              <Menu className={cn(
                "absolute inset-0 h-6 w-6 transition-all duration-300",
                isMobileMenuOpen ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"
              )} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-500 ease-out",
          isMobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        )}>
          <div className="p-4 rounded-2xl glass border border-border/50">
            <div className="flex justify-end mb-2">
              <ModeToggle />
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={(e) => {
                    if (link.href.startsWith("#")) {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }
                  }}
                >
                  {isActive(link.href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                  {link.label}
                </a>
              ))}
            </div>
            <div className="h-px bg-border/50 my-3" />
            <Link to="/calendar" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full gradient-vibrant shadow-glow-sm group">
                Voir Calendrier
                <CalendarDays className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
