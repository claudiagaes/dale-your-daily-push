import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import DaleButton from "@/components/DaleButton";
import { Target, Activity, Clock, ChevronRight, ChevronLeft, Check, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Question {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  options: { value: string; label: string; description: string }[];
}

const questions: Question[] = [
  {
    id: "objetivo",
    title: "¿Cuál es tu objetivo principal?",
    subtitle: "Elige el área donde quieres ver resultados",
    icon: <Target className="w-8 h-8" />,
    options: [
      { value: "abdomen", label: "Abdomen definido", description: "Fortalece y tonifica tu core" },
      { value: "gluteos", label: "Glúteos firmes", description: "Levanta y tonifica tu pompa" },
      { value: "fuerza", label: "Fuerza general", description: "Hazte más fuerte desde casa" },
      { value: "cardio", label: "Resistencia y cardio", description: "Mejora tu energía y aguante" },
    ],
  },
  {
    id: "nivel",
    title: "¿Cómo describes tu nivel actual?",
    subtitle: "Sé honesto, esto nos ayuda a personalizar tu plan",
    icon: <Activity className="w-8 h-8" />,
    options: [
      { value: "principiante", label: "Empezando de cero", description: "Hace meses que no entreno" },
      { value: "intermedio", label: "Algo de experiencia", description: "Entreno de vez en cuando" },
      { value: "avanzado", label: "Entrenado pero inconstante", description: "Sé cómo hacerlo, pero me cuesta mantenerlo" },
    ],
  },
  {
    id: "tiempo",
    title: "¿Cuánto tiempo puedes dedicar al día?",
    subtitle: "Cada minuto cuenta, elige lo que puedas mantener",
    icon: <Clock className="w-8 h-8" />,
    options: [
      { value: "15min", label: "15 minutos", description: "Perfecto para días ocupados" },
      { value: "25min", label: "25 minutos", description: "El punto ideal" },
      { value: "40min", label: "40 minutos", description: "Para sesiones más completas" },
    ],
  },
];

const programAssignment: Record<string, { name: string; duration: number; description: string }> = {
  abdomen: { name: "Abdomen en 28 días", duration: 28, description: "Fortalece tu core desde casa" },
  gluteos: { name: "Sube pompa en 28 días", duration: 28, description: "Glúteos firmes y definidos" },
  fuerza: { name: "Fuerza total en 30 días", duration: 30, description: "Hazte fuerte sin gimnasio" },
  cardio: { name: "Cardio en casa 21 días", duration: 21, description: "Mejora tu resistencia" },
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];
  const canProceed = answers[currentQuestion?.id];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubscribe = async () => {
    // If not logged in, save answers and redirect to register
    if (!user) {
      localStorage.setItem("dale_onboarding", JSON.stringify(answers));
      toast.info("Crea tu cuenta para continuar");
      navigate("/registro");
      return;
    }

    setIsProcessing(true);

    try {
      // Save onboarding data to profile first
      const program = programAssignment[answers.objetivo] || programAssignment.abdomen;

      await supabase
        .from("profiles")
        .update({
          objetivo: answers.objetivo,
          nivel: answers.nivel,
          tiempo_disponible: answers.tiempo,
          programa_asignado: program.name,
        })
        .eq("user_id", user.id);

      // Create checkout session
      const { data, error } = await supabase.functions.invoke("create-checkout");

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Hubo un error al procesar el pago. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const assignedProgram = programAssignment[answers.objetivo] || programAssignment.abdomen;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6">
        <div className="container-dale">
          <a href="/" className="text-2xl font-extrabold text-motivational">
            Dale
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-4 pb-8">
        <div className="container-dale max-w-lg mx-auto w-full">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Paso {currentStep + 1} de {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Question */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary">
                    {currentQuestion.icon}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                      {currentQuestion.title}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      {currentQuestion.subtitle}
                    </p>
                  </div>
                </div>

                {/* Options */}
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, [currentQuestion.id]: value })
                  }
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Label
                        htmlFor={option.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          answers[currentQuestion.id] === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>

                {/* Navigation */}
                <div className="flex gap-3 pt-4">
                  {currentStep > 0 && (
                    <DaleButton variant="outline" onClick={handleBack} className="flex-1">
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Atrás
                    </DaleButton>
                  )}
                  <DaleButton
                    variant="hero"
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={`flex-1 ${!canProceed ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {currentStep < questions.length - 1 ? (
                      <>
                        Siguiente
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      "Ver mi plan"
                    )}
                  </DaleButton>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-8"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 text-accent"
                >
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>

                {/* Program Assignment */}
                <div className="space-y-2">
                  <p className="text-muted-foreground">Tu plan personalizado:</p>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-motivational">
                    {assignedProgram.name}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {assignedProgram.description}
                  </p>
                </div>

                {/* Program Details */}
                <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Duración</span>
                    <span className="font-semibold">{assignedProgram.duration} días</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tiempo por sesión</span>
                    <span className="font-semibold">
                      {answers.tiempo === "15min" ? "15" : answers.tiempo === "25min" ? "25" : "40"} min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nivel</span>
                    <span className="font-semibold capitalize">
                      {answers.nivel === "principiante" ? "Principiante" : answers.nivel === "intermedio" ? "Intermedio" : "Avanzado"}
                    </span>
                  </div>
                </div>

                {/* Pricing card */}
                <div className="bg-card rounded-2xl p-6 border-2 border-primary space-y-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-extrabold text-foreground">$75</span>
                    <span className="text-lg text-muted-foreground">MXN/mes</span>
                  </div>
                  <div className="space-y-2 text-left">
                    {[
                      "Acceso a todos los programas",
                      "Nuevas rutinas cada mes",
                      "Coach motivacional diario",
                      "Progreso visible",
                    ].map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-4 pt-2">
                  <DaleButton
                    variant="hero"
                    size="lg"
                    onClick={handleSubscribe}
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Procesando..."
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        {user ? "Suscribirme por $75/mes" : "Crear cuenta y suscribirme"}
                      </>
                    )}
                  </DaleButton>

                  <DaleButton variant="ghost" onClick={handleBack} className="w-full">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Volver a editar mis respuestas
                  </DaleButton>

                  <p className="text-xs text-muted-foreground">
                    7 días de prueba gratis. Cancela cuando quieras. Sin compromiso.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
