import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DaleButton from "./DaleButton";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-soft" />
      
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-dale-blue/10 blur-3xl"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-dale-green/10 blur-3xl"
        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-dale relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Más de 5,000 personas ya entrenan con Dale</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-6"
          >
            Hoy también es un{" "}
            <span className="text-motivational">buen día</span>{" "}
            para moverte.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Entrena en casa sin pensar. Rutinas estructuradas de 25 minutos 
            que te llevan de la mano. Sin excusas, sin confusión.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <DaleButton variant="hero" size="lg" onClick={() => navigate("/onboarding")}>
              <Play className="w-5 h-5" />
              Empezar por $75/mes
            </DaleButton>
            <DaleButton variant="outline" onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}>
              Ver cómo funciona
            </DaleButton>
          </motion.div>

          {/* Price anchor */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            Por el precio de un café a la semana. Cancela cuando quieras.
          </motion.p>
        </div>

        {/* Workout preview card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 max-w-md mx-auto"
        >
          <div className="card-workout">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Tu entrenamiento de hoy</span>
              <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                25 min
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Día 9 de 28</h3>
            <p className="text-muted-foreground mb-4">Abdomen intenso — Quema y define</p>
            <div className="progress-dale mb-4">
              <div className="progress-dale-fill" style={{ width: "32%" }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">32% completado</span>
              <span className="text-primary font-semibold">¡Sigue así!</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
