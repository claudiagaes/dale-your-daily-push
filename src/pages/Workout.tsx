import { useState, useEffect, useCallback } from "react";
 import { motion } from "framer-motion";
 import { useNavigate } from "react-router-dom";
 import { Progress } from "@/components/ui/progress";
 import DaleButton from "@/components/DaleButton";
 import { Play, CheckCircle2, Clock, Calendar, Trophy, Home } from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
 
 const workoutData = {
   title: "Core de fuego",
   duration: 25,
   exercises: ["Plancha", "Crunches", "Mountain climbers", "Bicycle"],
   coachIntro: "Día de trabajo intenso. Hoy fortalecemos tu abdomen con 4 ejercicios clave. ¡Dale con todo!",
   coachOutro: "¡Increíble! Hoy cumpliste. Eso vale más de lo que crees. Mañana seguimos.",
 };
 
interface UserProgress {
  id: string;
  programa: string;
  dia_actual: number;
  total_dias: number;
  dias_completados: number[];
}

 const Workout = () => {
   const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
   const [isCompleted, setIsCompleted] = useState(false);
   const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
 
  const fetchProgress = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("id, programa, dia_actual, total_dias, dias_completados")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUserProgress({
          id: data.id,
          programa: data.programa,
          dia_actual: data.dia_actual,
          total_dias: data.total_dias,
          dias_completados: data.dias_completados || [],
        });
      } else {
        // No progress found, redirect to onboarding
        toast.info("Primero elige tu programa de entrenamiento");
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Error al cargar tu progreso");
    } finally {
      setIsLoading(false);
     }
  }, [user, navigate]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.info("Inicia sesión para ver tu entrenamiento");
      navigate("/login");
      return;
     }

    fetchProgress();
  }, [user, authLoading, fetchProgress, navigate]);
 
  const currentDay = userProgress?.dia_actual || 1;
  const totalDays = userProgress?.total_dias || 28;
  const programName = userProgress?.programa || "Tu programa";
  const progress = (currentDay / totalDays) * 100;
 
   const handleStartWorkout = () => {
     setIsPlaying(true);
   };
 
  const handleCompleteWorkout = async () => {
    if (!user || !userProgress) return;

     setIsPlaying(false);
    setIsSaving(true);

    try {
      const nextDay = currentDay + 1;
      const updatedDaysCompleted = [...(userProgress.dias_completados || []), currentDay];
      const isFinished = nextDay > totalDays;

      const { error } = await supabase
        .from("user_progress")
        .update({
          dia_actual: isFinished ? totalDays : nextDay,
          dias_completados: updatedDaysCompleted,
          fecha_ultimo_entrenamiento: new Date().toISOString(),
          completado: isFinished,
        })
        .eq("id", userProgress.id);

      if (error) throw error;

      setUserProgress({
        ...userProgress,
        dia_actual: nextDay,
        dias_completados: updatedDaysCompleted,
      });

      setIsCompleted(true);

      // Trigger confetti celebration
      triggerConfetti();

      toast.success("¡Día completado!");
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Error al guardar tu progreso");
    } finally {
      setIsSaving(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ["#3E9FFF", "#59D68D", "#F6AD55", "#38B2AC"];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
   };
 
   const handleNextDay = () => {
     setIsCompleted(false);
    fetchProgress();
   };
 
  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="p-4 md:p-6 border-b border-border/50">
          <div className="container-dale flex items-center justify-between">
            <span className="text-2xl font-extrabold text-motivational">Dale</span>
          </div>
        </header>
        <main className="flex-1 flex flex-col px-4 py-6 md:py-10">
          <div className="container-dale max-w-lg mx-auto w-full space-y-6">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

   return (
     <div className="min-h-screen bg-background flex flex-col">
       {/* Header */}
       <header className="p-4 md:p-6 border-b border-border/50">
         <div className="container-dale flex items-center justify-between">
           <a href="/" className="text-2xl font-extrabold text-motivational">
             Dale
           </a>
           <DaleButton variant="ghost" size="sm" onClick={() => navigate("/")}>
             <Home className="w-4 h-4 mr-1" />
             Inicio
           </DaleButton>
         </div>
       </header>
 
       {/* Main Content */}
       <main className="flex-1 flex flex-col px-4 py-6 md:py-10">
         <div className="container-dale max-w-lg mx-auto w-full flex-1 flex flex-col">
           {!isCompleted ? (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex-1 flex flex-col"
             >
               {/* Program Info */}
               <div className="text-center mb-6">
                 <p className="text-sm text-muted-foreground mb-1">{programName}</p>
                 <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
                   Día {currentDay} de {totalDays}
                 </h1>
               </div>
 
               {/* Progress Bar */}
               <div className="mb-8">
                 <div className="flex justify-between text-sm text-muted-foreground mb-2">
                   <span>Tu progreso</span>
                   <span>{Math.round(progress)}%</span>
                 </div>
                 <Progress value={progress} className="h-3" />
               </div>
 
               {/* Video/Workout Card */}
               <motion.div
                 whileHover={{ scale: 1.01 }}
                 className="bg-card rounded-2xl border border-border overflow-hidden flex-1 flex flex-col"
               >
                 {/* Video Placeholder */}
                 <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                   {!isPlaying ? (
                     <motion.button
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={handleStartWorkout}
                       className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
                     >
                       <Play className="w-8 h-8 ml-1" fill="currentColor" />
                     </motion.button>
                   ) : (
                     <div className="text-center p-6">
                       <motion.div
                         animate={{ scale: [1, 1.05, 1] }}
                         transition={{ repeat: Infinity, duration: 2 }}
                         className="text-4xl mb-2"
                       >
                         💪
                       </motion.div>
                       <p className="text-lg font-semibold text-foreground">Entrenamiento en curso...</p>
                       <p className="text-sm text-muted-foreground mt-1">¡Tú puedes!</p>
                     </div>
                   )}
                 </div>
 
                 {/* Workout Details */}
                 <div className="p-6 flex-1 flex flex-col">
                   <h2 className="text-xl font-bold text-foreground mb-2">
                     {workoutData.title}
                   </h2>
 
                   {/* Meta Info */}
                   <div className="flex gap-4 mb-4">
                     <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                       <Clock className="w-4 h-4" />
                       <span>{workoutData.duration} min</span>
                     </div>
                     <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                       <Calendar className="w-4 h-4" />
                       <span>Día {currentDay}</span>
                     </div>
                   </div>
 
                   {/* Coach Message */}
                   <div className="bg-primary/5 rounded-xl p-4 mb-6">
                     <p className="text-sm text-foreground italic">
                       "{workoutData.coachIntro}"
                     </p>
                   </div>
 
                   {/* Exercises Preview */}
                   <div className="space-y-2 mb-6">
                     <p className="text-sm font-medium text-muted-foreground">Hoy trabajamos:</p>
                     <div className="flex flex-wrap gap-2">
                       {workoutData.exercises.map((exercise, index) => (
                         <span
                           key={index}
                           className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground"
                         >
                           {exercise}
                         </span>
                       ))}
                     </div>
                   </div>
 
                   {/* Action Button */}
                   <div className="mt-auto">
                     {!isPlaying ? (
                        <DaleButton 
                          variant="hero" 
                          size="lg" 
                          onClick={handleStartWorkout} 
                          className="w-full"
                        >
                         <Play className="w-5 h-5 mr-2" />
                         Empezar
                       </DaleButton>
                     ) : (
                        <DaleButton 
                          variant="hero" 
                          size="lg" 
                          onClick={handleCompleteWorkout} 
                          className="w-full"
                          disabled={isSaving}
                        >
                         <CheckCircle2 className="w-5 h-5 mr-2" />
                          {isSaving ? "Guardando..." : "Marcar como completado"}
                       </DaleButton>
                     )}
                   </div>
                 </div>
               </motion.div>
             </motion.div>
           ) : (
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex-1 flex flex-col items-center justify-center text-center"
             >
               {/* Celebration */}
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                 className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-6"
               >
                 <Trophy className="w-12 h-12 text-accent" />
               </motion.div>
 
               <motion.h1
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2"
               >
                 ¡Bien hecho!
               </motion.h1>
 
               <motion.p
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="text-lg text-muted-foreground mb-8 max-w-sm"
               >
                 {workoutData.coachOutro}
               </motion.p>
 
               {/* Stats */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm mb-8"
               >
                 <div className="grid grid-cols-2 gap-4">
                   <div className="text-center">
                     <p className="text-3xl font-bold text-primary">{currentDay}</p>
                     <p className="text-sm text-muted-foreground">Días completados</p>
                   </div>
                   <div className="text-center">
                     <p className="text-3xl font-bold text-accent">{totalDays - currentDay}</p>
                     <p className="text-sm text-muted-foreground">Días restantes</p>
                   </div>
                 </div>
                 <div className="mt-4">
                   <Progress value={((currentDay) / totalDays) * 100} className="h-3" />
                 </div>
               </motion.div>
 
               {/* Actions */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                 className="space-y-3 w-full max-w-sm"
               >
                  {currentDay < totalDays ? (
                    <DaleButton variant="hero" size="lg" onClick={handleNextDay} className="w-full">
                      Ver día {currentDay + 1}
                    </DaleButton>
                  ) : (
                    <DaleButton variant="hero" size="lg" onClick={() => navigate("/")} className="w-full">
                      ¡Programa completado! 🎉
                    </DaleButton>
                  )}
                 <DaleButton variant="outline" onClick={() => navigate("/")} className="w-full">
                   Volver al inicio
                 </DaleButton>
               </motion.div>
             </motion.div>
           )}
         </div>
       </main>
     </div>
   );
 };
 
 export default Workout;