import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import DaleButton from "@/components/DaleButton";
import { Dumbbell, Sparkles } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger confetti burst
    const colors = ["#3E9FFF", "#59D68D", "#F6AD55", "#38B2AC"];
    const end = Date.now() + 3000;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    // Show content after a brief delay for dramatic effect
    setTimeout(() => setShowContent(true), 400);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 md:p-6">
        <div className="container-dale">
          <span className="text-2xl font-extrabold text-motivational">Dale</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/20"
            >
              <Sparkles className="w-12 h-12 text-accent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
                ¡Estás dentro! 🎉
              </h1>
              <p className="text-lg text-muted-foreground">
                Tu suscripción está activa. Es hora de empezar a transformarte.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-card rounded-2xl border border-border p-6 space-y-3"
            >
              <p className="text-sm text-muted-foreground italic">
                "El mejor momento para empezar fue ayer. El segundo mejor momento es ahora."
              </p>
              <p className="text-xs text-muted-foreground">— Tu coach Dale</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-2"
            >
              <DaleButton
                variant="hero"
                size="lg"
                onClick={() => navigate("/entrenamiento", { replace: true })}
                className="w-full"
              >
                <Dumbbell className="w-5 h-5 mr-2" />
                Empezar mi primer día
              </DaleButton>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default PaymentSuccess;
