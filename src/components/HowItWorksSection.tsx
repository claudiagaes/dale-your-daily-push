import { motion } from "framer-motion";
import { Target, Play, Trophy } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Target,
      number: "01",
      title: "Elige tu objetivo",
      description: "Responde 3 preguntas simples y te asignamos el programa perfecto para ti. Sin complicaciones.",
    },
    {
      icon: Play,
      number: "02",
      title: "Entrena cada día",
      description: "Tu rutina de 25 minutos te espera lista. Solo presiona play y déjate guiar. Nada más que pensar.",
    },
    {
      icon: Trophy,
      number: "03",
      title: "Ve tu progreso",
      description: "Cada día completado suma. Ve cómo avanzas y recibe mensajes que te mantienen motivado.",
    },
  ];

  return (
    <section id="como-funciona" className="section-spacing bg-muted/30">
      <div className="container-dale">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Así de simple
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6">
            Haz ejercicio{" "}
            <span className="text-motivational">sin pensar</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Nosotros nos encargamos de todo. Tú solo tienes que aparecer.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-dale text-primary-foreground mb-6 shadow-lg shadow-primary/20">
                <step.icon className="w-8 h-8" />
              </div>

              <div className="text-sm font-bold text-primary mb-2">{step.number}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
