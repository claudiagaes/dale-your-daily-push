import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 py-12 border-t border-border">
      <div className="container-dale">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.a
            href="/"
            className="text-2xl font-extrabold text-motivational"
            whileHover={{ scale: 1.02 }}
          >
            Dale
          </motion.a>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#programas" className="text-muted-foreground hover:text-foreground transition-colors">
              Programas
            </a>
            <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
              Cómo funciona
            </a>
            <a href="#testimonios" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonios
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Términos
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacidad
            </a>
          </nav>

          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Hecho con <Heart className="w-4 h-4 text-destructive fill-destructive" /> en México
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Dale. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
