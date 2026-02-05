 import { useState, useEffect } from "react";
 import { motion } from "framer-motion";
 import { useNavigate } from "react-router-dom";
 import { Progress } from "@/components/ui/progress";
 import DaleButton from "@/components/DaleButton";
 import { Play, CheckCircle2, Clock, Calendar, Trophy, Home } from "lucide-react";
 
 const workoutData = {
   title: "Core de fuego",
   duration: 25,
   exercises: ["Plancha", "Crunches", "Mountain climbers", "Bicycle"],
   coachIntro: "Día de trabajo intenso. Hoy fortalecemos tu abdomen con 4 ejercicios clave. ¡Dale con todo!",
   coachOutro: "¡Increíble! Hoy cumpliste. Eso vale más de lo que crees. Mañana seguimos.",
 };
 
 const Workout = () => {
   const navigate = useNavigate();
   const [currentDay, setCurrentDay] = useState(1);
   const [totalDays] = useState(28);
   const [isCompleted, setIsCompleted] = useState(false);
   const [isPlaying, setIsPlaying] = useState(false);
   const [programName, setProgramName] = useState("Abdomen en 28 días");
 
   useEffect(() => {
     const savedDay = localStorage.getItem("dale_current_day");
     const savedOnboarding = localStorage.getItem("dale_onboarding");
     
     if (savedDay) {
       setCurrentDay(parseInt(savedDay));
     }
     
     if (savedOnboarding) {
       const answers = JSON.parse(savedOnboarding);
       const programs: Record<string, string> = {
         abdomen: "Abdomen en 28 días",
         gluteos: "Sube pompa en 28 días",
         fuerza: "Fuerza total en 30 días",
         cardio: "Cardio en casa 21 días",
       };
       setProgramName(programs[answers.objetivo] || "Abdomen en 28 días");
     }
   }, []);
 
   const progress = (currentDay / totalDays) * 100;
 
   const handleStartWorkout = () => {
     setIsPlaying(true);
   };
 
   const handleCompleteWorkout = () => {
     setIsPlaying(false);
     setIsCompleted(true);
     const nextDay = currentDay + 1;
     localStorage.setItem("dale_current_day", nextDay.toString());
   };
 
   const handleNextDay = () => {
     setCurrentDay((prev) => prev + 1);
     setIsCompleted(false);
   };
 
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
                       <DaleButton variant="hero" size="lg" onClick={handleStartWorkout} className="w-full">
                         <Play className="w-5 h-5 mr-2" />
                         Empezar
                       </DaleButton>
                     ) : (
                       <DaleButton variant="hero" size="lg" onClick={handleCompleteWorkout} className="w-full">
                         <CheckCircle2 className="w-5 h-5 mr-2" />
                         Marcar como completado
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
                 <DaleButton variant="hero" size="lg" onClick={handleNextDay} className="w-full">
                   Ver día {currentDay + 1}
                 </DaleButton>
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