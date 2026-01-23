import { Dumbbell, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowUpRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const footerLinks = {
  product: [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Tarifs", href: "#pricing" },
    { label: "Démo", href: "#demo" },
    { label: "Mises à jour", href: "#updates" },
  ],
  company: [
    { label: "À Propos", href: "#about" },
    { label: "Carrières", href: "#careers" },
    { label: "Blog", href: "#blog" },
    { label: "Presse", href: "#press" },
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "Centre d'Aide", href: "#help" },
    { label: "Communauté", href: "#community" },
    { label: "Partenaires", href: "#partners" },
  ],
  legal: [
    { label: "Confidentialité", href: "#privacy" },
    { label: "Conditions", href: "#terms" },
    { label: "Cookies", href: "#cookies" },
    { label: "Licences", href: "#licenses" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#facebook", label: "Facebook", color: "hover:bg-blue-600" },
  { icon: Twitter, href: "#twitter", label: "Twitter", color: "hover:bg-sky-500" },
  { icon: Instagram, href: "#instagram", label: "Instagram", color: "hover:bg-pink-600" },
  { icon: Youtube, href: "#youtube", label: "YouTube", color: "hover:bg-red-600" },
];

interface FooterLinkColumnProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-sidebar-foreground">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="group text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors inline-flex items-center gap-1"
            >
              {link.label}
              <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative bg-sidebar text-sidebar-foreground overflow-hidden">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-vibrant" />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl gradient-vibrant flex items-center justify-center shadow-glow-sm group-hover:scale-110 transition-transform duration-300">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">SportHub</span>
            </Link>
            <p className="text-sidebar-foreground/70 mb-6 max-w-xs leading-relaxed">
              La plateforme ultime de gestion de club sportif. Optimisez vos opérations,
              engagez vos membres et développez votre communauté.
            </p>

            {/* Contact Info with Hover Effects */}
            <div className="space-y-3 text-sm">
              <a
                href="mailto:contact@sporthub.com"
                className="flex items-center gap-3 text-sidebar-foreground/70 hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span>contact@sporthub.com</span>
              </a>
              <a
                href="tel:+15551234567"
                className="flex items-center gap-3 text-sidebar-foreground/70 hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+1 (555) 123-4567</span>
              </a>
              <div className="flex items-center gap-3 text-sidebar-foreground/70">
                <div className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>123 Fitness Ave, Sports City</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <FooterLinkColumn title="Produit" links={footerLinks.product} />
          <FooterLinkColumn title="Entreprise" links={footerLinks.company} />
          <FooterLinkColumn title="Ressources" links={footerLinks.resources} />
          <FooterLinkColumn title="Légal" links={footerLinks.legal} />
        </div>

        {/* Divider with Gradient */}
        <div className="relative h-px mb-8">
          <div className="absolute inset-0 bg-sidebar-border" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-sidebar-foreground/60">
            <span>© 2024 SportHub. Tous droits réservés.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Fait avec <Heart className="h-3 w-3 text-red-500 animate-pulse" /> pour les athlètes
            </span>
          </div>

          {/* Social Links with Enhanced Effects */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className={cn(
                  "w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center",
                  "text-sidebar-foreground/70 hover:text-white",
                  "transition-all duration-300 hover:scale-110 hover:shadow-glow-sm",
                  social.color
                )}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 w-12 h-12 rounded-full gradient-vibrant text-white shadow-glow-sm hover:shadow-glow hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Scroll to top"
      >
        <ArrowUpRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
      </button>
    </footer>
  );
}
