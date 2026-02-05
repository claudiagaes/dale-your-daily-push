import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import DaleButton from "./DaleButton";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
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
            <Link to="/login" className="hidden sm:block">
              <DaleButton variant="ghost" size="sm">
                Ingresar
              </DaleButton>
            </Link>
            <Link to="/onboarding" className="hidden sm:block">
              <DaleButton variant="hero" size="sm">
                Empezar
              </DaleButton>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-16 right-0 bottom-0 z-50 w-72 bg-background border-l border-border shadow-xl md:hidden"
          >
            <div className="flex flex-col p-6 gap-2">
              <a
                href="#programas"
                onClick={closeMenu}
                className="py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
              >
                Programas
              </a>
              <a
                href="#como-funciona"
                onClick={closeMenu}
                className="py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
              >
                Cómo funciona
              </a>
              <a
                href="#testimonios"
                onClick={closeMenu}
                className="py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
              >
                Testimonios
              </a>

              <div className="h-px bg-border my-4" />

              <Link to="/login" onClick={closeMenu}>
                <DaleButton variant="ghost" className="w-full justify-center">
                  Ingresar
                </DaleButton>
              </Link>
              <Link to="/onboarding" onClick={closeMenu}>
                <DaleButton variant="hero" className="w-full justify-center">
                  Empezar
                </DaleButton>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
