import { motion } from "framer-motion";
import { ArrowRight, Clock, Flame } from "lucide-react";

interface ProgramCardProps {
  title: string;
  tagline: string;
  duration: string;
  intensity: "Bajo" | "Medio" | "Alto";
  color: "blue" | "green" | "mixed";
  delay?: number;
}

const ProgramCard = ({ title, tagline, duration, intensity, color, delay = 0 }: ProgramCardProps) => {
  const colorStyles = {
    blue: "from-dale-blue/20 to-dale-blue/5 border-dale-blue/30 hover:border-dale-blue/50",
    green: "from-dale-green/20 to-dale-green/5 border-dale-green/30 hover:border-dale-green/50",
    mixed: "from-dale-blue/15 via-dale-green/10 to-dale-green/5 border-primary/30 hover:border-primary/50",
  };

  const intensityColors = {
    Bajo: "bg-success/20 text-success",
    Medio: "bg-warning/20 text-warning",
    Alto: "bg-destructive/20 text-destructive",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={`relative group cursor-pointer rounded-3xl p-8 bg-gradient-to-br ${colorStyles[color]} border-2 transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            {duration}
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${intensityColors[intensity]}`}>
            <Flame className="w-3.5 h-3.5" />
            {intensity}
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-6">{tagline}</p>

      <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
        <span>Comenzar programa</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
};

export default ProgramCard;
