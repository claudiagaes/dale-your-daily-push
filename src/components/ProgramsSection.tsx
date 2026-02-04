import { motion } from "framer-motion";
import ProgramCard from "./ProgramCard";

const ProgramsSection = () => {
  const programs = [
    {
      title: "Abdomen en 28 días",
      tagline: "Hazlo fuerte. Hazlo claro. Desde casa. Rutinas enfocadas en fortalecer tu core y definir tu abdomen.",
      duration: "28 días",
      intensity: "Medio" as const,
      color: "blue" as const,
    },
    {
      title: "Sube pompa en casa",
      tagline: "Tú + 28 días = resultado visible. Ejercicios específicos para glúteos con progresión gradual.",
      duration: "28 días",
      intensity: "Alto" as const,
      color: "green" as const,
    },
    {
      title: "Hazte fuerte desde el core",
      tagline: "Sé más fuerte. Empieza hoy. Fortalece todo tu cuerpo partiendo desde tu centro.",
      duration: "21 días",
      intensity: "Medio" as const,
      color: "mixed" as const,
    },
  ];

  return (
    <section id="programas" className="section-spacing bg-background">
      <div className="container-dale">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            Programas estructurados
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6">
            Elige tu objetivo.{" "}
            <span className="text-motivational">Nosotros te guiamos.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Sin menús infinitos ni decisiones paralizantes. Un programa, un objetivo, resultados reales.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {programs.map((program, index) => (
            <ProgramCard key={program.title} {...program} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
