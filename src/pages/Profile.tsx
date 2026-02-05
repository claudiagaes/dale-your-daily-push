 import { useState, useEffect } from "react";
 import { useQueryClient } from "@tanstack/react-query";
 import { useNavigate } from "react-router-dom";
 import { motion } from "framer-motion";
 import { useAuth } from "@/hooks/useAuth";
 import { supabase } from "@/integrations/supabase/client";
 import { useProfile, useUpdateProfile, ProfileData } from "@/hooks/useProfile";
 import { useUserProgress, useDeleteUserProgress } from "@/hooks/useUserProgress";
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
   const queryClient = useQueryClient();
   
   // React Query hooks
   const { data: profile, isLoading: profileLoading } = useProfile();
   const { data: progress, isLoading: progressLoading } = useUserProgress();
   const updateProfile = useUpdateProfile();
   const deleteProgress = useDeleteUserProgress();
   
   const [editedName, setEditedName] = useState("");
   const [editedBio, setEditedBio] = useState("");
  const [isResetting, setIsResetting] = useState(false);
 
   // Sincronizar estado local con datos del perfil
   useEffect(() => {
     if (profile) {
       setEditedName(profile.display_name || "");
       setEditedBio(profile.bio || "");
     }
   }, [profile]);
 
   const handleAvatarUpdate = (newUrl: string) => {
     queryClient.setQueryData(["profile", user?.id], (old: ProfileData | null) => 
       old ? { ...old, avatar_url: newUrl } : null
     );
   };

   const handleSave = async () => {
     if (!user) return;
 
     try {
       await updateProfile.mutateAsync({
         display_name: editedName.trim() || null,
         bio: editedBio.trim() || null,
       });
 
       toast({
         title: "¡Guardado!",
         description: "Tu perfil se actualizó correctamente",
       });
     } catch (error) {
       toast({
         title: "Error",
         description: "No pudimos guardar los cambios",
         variant: "destructive",
       });
     }
   };
 
  const handleChangeProgram = async () => {
    if (!user) return;

    setIsResetting(true);

     try {
       // Delete existing progress
       await deleteProgress.mutateAsync();
 
       // Clear program assignment in profile
       await updateProfile.mutateAsync({
        objetivo: null,
        nivel: null,
        tiempo_disponible: null,
        programa_asignado: null,
       });

       toast({
         title: "¡Listo!",
         description: "Ahora puedes elegir un nuevo programa",
       });
 
       navigate("/onboarding");
     } catch (error) {
      toast({
        title: "Error",
        description: "No pudimos reiniciar tu progreso",
        variant: "destructive",
      });
     } finally {
      setIsResetting(false);
    }
  };

   const isLoading = profileLoading || progressLoading;
 
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
                    disabled={updateProfile.isPending}
                   className="w-full"
                 >
                    {updateProfile.isPending ? (
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