import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import DaleButton from "./DaleButton";

const CTASection = () => {
  const benefits = [
    "Acceso a todos los programas",
    "Nuevas rutinas cada mes",
    "Coach motivacional diario",
    "Progreso visible",
  ];

  return (
    <section className="section-spacing relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dale-blue/5 via-background to-dale-green/5" />
      
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-dale opacity-10 blur-3xl"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="container-dale relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
            Dale.{" "}
            <span className="text-motivational">Hoy sí puedes.</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Sin excusas. Sin confusión. Por el precio de un café a la semana, 
            tu rutina te espera todos los días.
          </p>

          {/* Price card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block bg-card rounded-3xl p-8 shadow-2xl shadow-primary/10 border border-border mb-8"
          >
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-5xl font-extrabold text-foreground">$75</span>
              <span className="text-xl text-muted-foreground">MXN/mes</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <DaleButton variant="hero" size="lg" className="w-full">
              Empezar ahora
              <ArrowRight className="w-5 h-5" />
            </DaleButton>
          </motion.div>

          <p className="text-sm text-muted-foreground">
            7 días de prueba gratis. Cancela cuando quieras. Sin compromiso.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
