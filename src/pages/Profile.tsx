 import { useState, useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import { motion } from "framer-motion";
 import { useAuth } from "@/hooks/useAuth";
 import { supabase } from "@/integrations/supabase/client";
 import Header from "@/components/Header";
 import DaleButton from "@/components/DaleButton";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Label } from "@/components/ui/label";
 import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
 import { toast } from "@/hooks/use-toast";
 import { Mail, Target, Dumbbell, Clock, Award, ArrowLeft, Save, RefreshCw, AlertTriangle, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
 import AvatarUpload from "@/components/AvatarUpload";
 
 interface ProfileData {
   display_name: string | null;
   email: string | null;
   bio: string | null;
   objetivo: string | null;
   nivel: string | null;
   tiempo_disponible: string | null;
   programa_asignado: string | null;
   avatar_url: string | null;
 }
 
interface ProgressData {
  dia_actual: number;
  total_dias: number;
  dias_completados: number[] | null;
  fecha_inicio: string;
  fecha_ultimo_entrenamiento: string | null;
  completado: boolean;
}

 const objetivoLabels: Record<string, string> = {
   gluteos: "Glúteos firmes",
   abdomen: "Abdomen definido",
   piernas: "Piernas fuertes",
   general: "Tonificación general",
 };
 
 const nivelLabels: Record<string, string> = {
   principiante: "Principiante",
   intermedio: "Algo de experiencia",
   avanzado: "Avanzado",
 };
 
 const tiempoLabels: Record<string, string> = {
   "15min": "15 minutos",
   "25min": "25 minutos",
   "35min": "35 minutos",
 };
 
 const Profile = () => {
   const navigate = useNavigate();
   const { user, loading: authLoading } = useAuth();
   const [profile, setProfile] = useState<ProfileData | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);
   const [editedName, setEditedName] = useState("");
   const [editedBio, setEditedBio] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [progress, setProgress] = useState<ProgressData | null>(null);
 
   useEffect(() => {
     if (!authLoading && user) {
       fetchProfile();
      fetchProgress();
     }
   }, [user, authLoading, navigate]);
 
   const fetchProfile = async () => {
     if (!user) return;
 
     const { data, error } = await supabase
       .from("profiles")
       .select("display_name, email, bio, objetivo, nivel, tiempo_disponible, programa_asignado, avatar_url")
       .eq("user_id", user.id)
       .maybeSingle();
 
     if (error) {
       toast({
         title: "Error",
         description: "No pudimos cargar tu perfil",
         variant: "destructive",
       });
       return;
     }
 
     if (data) {
       setProfile(data);
       setEditedName(data.display_name || "");
       setEditedBio(data.bio || "");
     }
     setIsLoading(false);
   };
 
   const handleAvatarUpdate = (newUrl: string) => {
     setProfile(prev => prev ? { ...prev, avatar_url: newUrl } : null);
   };
 
  const fetchProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_progress")
      .select("dia_actual, total_dias, dias_completados, fecha_inicio, fecha_ultimo_entrenamiento, completado")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setProgress(data);
    }
  };

   const handleSave = async () => {
     if (!user) return;
 
     setIsSaving(true);
 
     const { error } = await supabase
       .from("profiles")
       .update({
         display_name: editedName.trim() || null,
         bio: editedBio.trim() || null,
       })
       .eq("user_id", user.id);
 
     setIsSaving(false);
 
     if (error) {
       toast({
         title: "Error",
         description: "No pudimos guardar los cambios",
         variant: "destructive",
       });
       return;
     }
 
     setProfile(prev => prev ? { ...prev, display_name: editedName.trim() || null, bio: editedBio.trim() || null } : null);
 
     toast({
       title: "¡Guardado!",
       description: "Tu perfil se actualizó correctamente",
     });
   };
 
  const handleChangeProgram = async () => {
    if (!user) return;

    setIsResetting(true);

    // Delete existing progress
    const { error: progressError } = await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", user.id);

    if (progressError) {
      toast({
        title: "Error",
        description: "No pudimos reiniciar tu progreso",
        variant: "destructive",
      });
      setIsResetting(false);
      return;
    }

    // Clear program assignment in profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        objetivo: null,
        nivel: null,
        tiempo_disponible: null,
        programa_asignado: null,
      })
      .eq("user_id", user.id);

    if (profileError) {
      toast({
        title: "Error",
        description: "No pudimos actualizar tu perfil",
        variant: "destructive",
      });
      setIsResetting(false);
      return;
    }

    toast({
      title: "¡Listo!",
      description: "Ahora puedes elegir un nuevo programa",
    });

    navigate("/onboarding");
  };

   const hasChanges = profile && (
     (editedName.trim() || null) !== profile.display_name ||
     (editedBio.trim() || null) !== profile.bio
   );
 
   if (authLoading || isLoading) {
     return (
       <div className="min-h-screen bg-background">
         <Header />
         <main className="pt-24 pb-16">
           <div className="container-dale max-w-2xl">
             <Skeleton className="h-10 w-48 mb-8" />
             <div className="space-y-6">
               <Skeleton className="h-24 w-full rounded-2xl" />
               <Skeleton className="h-40 w-full rounded-2xl" />
               <Skeleton className="h-32 w-full rounded-2xl" />
             </div>
           </div>
         </main>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-background">
       <Header />
       <main className="pt-24 pb-16">
         <div className="container-dale max-w-2xl">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
           >
             {/* Header */}
             <div className="flex items-center gap-4 mb-8">
               <button
                 onClick={() => navigate(-1)}
                 className="p-2 rounded-xl hover:bg-muted transition-colors"
               >
                 <ArrowLeft className="w-5 h-5" />
               </button>
               <h1 className="text-2xl md:text-3xl font-bold">Mi Perfil</h1>
             </div>
 
             {/* Editable Section */}
             <section className="card-elevated mb-6">
               <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                 {user && (
                   <AvatarUpload
                     userId={user.id}
                     currentAvatarUrl={profile?.avatar_url || null}
                     displayName={editedName || profile?.display_name || null}
                     onUploadComplete={handleAvatarUpdate}
                   />
                 )}
                 <div className="text-center sm:text-left">
                   <h2 className="text-xl font-semibold">
                     {editedName || profile?.display_name || "Tu nombre"}
                   </h2>
                   <p className="text-sm text-muted-foreground">
                     Toca el ícono de cámara para cambiar tu foto
                   </p>
                 </div>
               </div>
 
               <div className="space-y-4">
                 <div>
                   <Label htmlFor="email" className="text-muted-foreground text-sm">
                     Email
                   </Label>
                   <div className="flex items-center gap-2 mt-1 p-3 bg-muted/50 rounded-xl">
                     <Mail className="w-4 h-4 text-muted-foreground" />
                     <span className="text-foreground">{profile?.email || user?.email}</span>
                   </div>
                 </div>
 
                 <div>
                   <Label htmlFor="name">Nombre</Label>
                   <Input
                     id="name"
                     value={editedName}
                     onChange={(e) => setEditedName(e.target.value)}
                     placeholder="Tu nombre"
                     className="mt-1"
                   />
                 </div>
 
                 <div>
                   <Label htmlFor="bio">Bio</Label>
                   <Textarea
                     id="bio"
                     value={editedBio}
                     onChange={(e) => setEditedBio(e.target.value)}
                     placeholder="Cuéntanos sobre ti y tus metas..."
                     className="mt-1 min-h-[100px] resize-none"
                   />
                 </div>
               </div>
             </section>
 
             {/* Program Info Section */}
             <section className="card-elevated mb-6">
               <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                 <Award className="w-5 h-5 text-secondary" />
                 Mi programa
               </h2>
 
               <div className="grid gap-4">
                 {profile?.programa_asignado && (
                   <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                     <p className="text-sm text-muted-foreground mb-1">Programa actual</p>
                     <p className="text-lg font-semibold text-foreground">{profile.programa_asignado}</p>
                   </div>
                 )}
 
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                   <div className="p-3 bg-muted/50 rounded-xl">
                     <div className="flex items-center gap-2 mb-1">
                       <Target className="w-4 h-4 text-primary" />
                       <span className="text-xs text-muted-foreground">Objetivo</span>
                     </div>
                     <p className="font-medium text-sm">
                       {profile?.objetivo ? objetivoLabels[profile.objetivo] || profile.objetivo : "No definido"}
                     </p>
                   </div>
 
                   <div className="p-3 bg-muted/50 rounded-xl">
                     <div className="flex items-center gap-2 mb-1">
                       <Dumbbell className="w-4 h-4 text-secondary" />
                       <span className="text-xs text-muted-foreground">Nivel</span>
                     </div>
                     <p className="font-medium text-sm">
                       {profile?.nivel ? nivelLabels[profile.nivel] || profile.nivel : "No definido"}
                     </p>
                   </div>
 
                   <div className="p-3 bg-muted/50 rounded-xl">
                     <div className="flex items-center gap-2 mb-1">
                       <Clock className="w-4 h-4 text-primary" />
                       <span className="text-xs text-muted-foreground">Tiempo</span>
                     </div>
                     <p className="font-medium text-sm">
                       {profile?.tiempo_disponible ? tiempoLabels[profile.tiempo_disponible] || profile.tiempo_disponible : "No definido"}
                     </p>
                   </div>
                 </div>

                {/* Change Program Button */}
                <div className="pt-4 border-t border-border">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors group"
                        disabled={isResetting}
                      >
                        <div className="flex items-center gap-3">
                          <RefreshCw className="w-5 h-5 text-destructive" />
                          <div className="text-left">
                            <p className="font-medium text-foreground">Cambiar de programa</p>
                            <p className="text-sm text-muted-foreground">Tu progreso actual se reiniciará</p>
                          </div>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-warning" />
                          ¿Cambiar de programa?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left space-y-2">
                          <p>
                            Esta acción reiniciará <strong>todo tu progreso actual</strong> en "{profile?.programa_asignado}".
                          </p>
                          <p>
                            Volverás al inicio para elegir un nuevo objetivo y programa. Este cambio no se puede deshacer.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleChangeProgram}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isResetting ? "Reiniciando..." : "Sí, cambiar programa"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
               </div>
             </section>
 
            {/* Progress History Section */}
            {progress && (
              <section className="card-elevated mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Mi progreso
                </h2>

                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Días completados</span>
                      <span className="font-semibold">
                        {progress.dias_completados?.length || 0} de {progress.total_dias}
                      </span>
                    </div>
                    <Progress 
                      value={((progress.dias_completados?.length || 0) / progress.total_dias) * 100} 
                      className="h-3"
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Inicio</span>
                      </div>
                      <p className="font-medium text-sm">
                        {format(new Date(progress.fecha_inicio), "d 'de' MMMM", { locale: es })}
                      </p>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                        <span className="text-xs text-muted-foreground">Último entreno</span>
                      </div>
                      <p className="font-medium text-sm">
                        {progress.fecha_ultimo_entrenamiento 
                          ? format(new Date(progress.fecha_ultimo_entrenamiento), "d 'de' MMMM", { locale: es })
                          : "Aún no empiezas"
                        }
                      </p>
                    </div>
                  </div>

                  {/* Completed Days Grid */}
                  {progress.dias_completados && progress.dias_completados.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">Días completados</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: progress.total_dias }, (_, i) => i + 1).map((day) => {
                          const isCompleted = progress.dias_completados?.includes(day);
                          return (
                            <div
                              key={day}
                              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                                isCompleted
                                  ? "bg-secondary text-secondary-foreground"
                                  : "bg-muted/50 text-muted-foreground"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                day
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Completion Status */}
                  {progress.completado && (
                    <div className="p-4 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-xl border border-secondary/30">
                      <p className="font-semibold text-center text-lg">
                        🎉 ¡Programa completado!
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

             {/* Save Button */}
             {hasChanges && (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="sticky bottom-6"
               >
                 <DaleButton
                   variant="hero"
                   onClick={handleSave}
                   disabled={isSaving}
                   className="w-full"
                 >
                   {isSaving ? (
                     "Guardando..."
                   ) : (
                     <>
                       <Save className="w-5 h-5" />
                       Guardar cambios
                     </>
                   )}
                 </DaleButton>
               </motion.div>
             )}
           </motion.div>
         </div>
       </main>
     </div>
   );
 };
 
 export default Profile;