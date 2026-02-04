import { motion } from "framer-motion";
import DaleButton from "./DaleButton";

const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <div className="container-dale flex items-center justify-between h-16 md:h-20">
        <motion.a
          href="/"
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl md:text-3xl font-extrabold text-motivational">
            Dale
          </span>
        </motion.a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#programas" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Programas
          </a>
          <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Cómo funciona
          </a>
          <a href="#testimonios" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Testimonios
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <DaleButton variant="ghost" size="sm" className="hidden sm:inline-flex">
            Ingresar
          </DaleButton>
          <DaleButton variant="hero" size="sm">
            Empezar
          </DaleButton>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
