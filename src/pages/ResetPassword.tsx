 import { useState, useEffect } from "react";
 import { motion } from "framer-motion";
 import { Link, useNavigate } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import DaleButton from "@/components/DaleButton";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { toast } from "sonner";
 import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
 
 const ResetPassword = () => {
   const navigate = useNavigate();
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState(false);
   const [hasSession, setHasSession] = useState(false);
 
   useEffect(() => {
     // Check if user has a valid recovery session
     supabase.auth.getSession().then(({ data: { session } }) => {
       if (session) {
         setHasSession(true);
       }
     });
 
     // Listen for auth state changes (recovery link clicked)
     const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
       if (event === "PASSWORD_RECOVERY") {
         setHasSession(true);
       }
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
 
     if (password !== confirmPassword) {
       toast.error("Las contraseñas no coinciden");
       return;
     }
 
     if (password.length < 6) {
       toast.error("La contraseña debe tener al menos 6 caracteres");
       return;
     }
 
     setLoading(true);
 
     const { error } = await supabase.auth.updateUser({ password });
 
     setLoading(false);
 
     if (error) {
       toast.error("Error", {
         description: "No pudimos actualizar tu contraseña. Intenta de nuevo.",
       });
       return;
     }
 
     setSuccess(true);
   };
 
   if (success) {
     return (
       <div className="min-h-screen bg-background flex flex-col">
         <header className="p-4 md:p-6 border-b border-border/50">
           <div className="container-dale">
             <Link to="/" className="text-2xl font-extrabold text-motivational">
               Dale
             </Link>
           </div>
         </header>
 
         <main className="flex-1 flex items-center justify-center px-4 py-10">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-full max-w-md text-center"
           >
             <div className="bg-card rounded-2xl border border-border p-8">
               <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 className="w-8 h-8 text-secondary" />
               </div>
               <h1 className="text-2xl font-bold mb-3">¡Contraseña actualizada!</h1>
               <p className="text-muted-foreground mb-6">
                 Ya puedes iniciar sesión con tu nueva contraseña.
               </p>
               <DaleButton
                 variant="hero"
                 className="w-full"
                 onClick={() => navigate("/login")}
               >
                 Ir al login
               </DaleButton>
             </div>
           </motion.div>
         </main>
       </div>
     );
   }
 
   if (!hasSession) {
     return (
       <div className="min-h-screen bg-background flex flex-col">
         <header className="p-4 md:p-6 border-b border-border/50">
           <div className="container-dale">
             <Link to="/" className="text-2xl font-extrabold text-motivational">
               Dale
             </Link>
           </div>
         </header>
 
         <main className="flex-1 flex items-center justify-center px-4 py-10">
           <div className="w-full max-w-md text-center">
             <div className="bg-card rounded-2xl border border-border p-8">
               <h1 className="text-2xl font-bold mb-3">Enlace inválido</h1>
               <p className="text-muted-foreground mb-6">
                 Este enlace ha expirado o no es válido. Solicita uno nuevo.
               </p>
               <Link to="/forgot-password">
                 <DaleButton variant="hero" className="w-full">
                   Solicitar nuevo enlace
                 </DaleButton>
               </Link>
             </div>
           </div>
         </main>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-background flex flex-col">
       <header className="p-4 md:p-6 border-b border-border/50">
         <div className="container-dale">
           <Link to="/" className="text-2xl font-extrabold text-motivational">
             Dale
           </Link>
         </div>
       </header>
 
       <main className="flex-1 flex items-center justify-center px-4 py-10">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="w-full max-w-md"
         >
           <div className="text-center mb-8">
             <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
               Nueva contraseña
             </h1>
             <p className="text-muted-foreground">
               Ingresa tu nueva contraseña
             </p>
           </div>
 
           <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
             <form onSubmit={handleSubmit} className="space-y-5">
               <div className="space-y-2">
                 <Label htmlFor="password">Nueva contraseña</Label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                   <Input
                     id="password"
                     type={showPassword ? "text" : "password"}
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="pl-10 pr-10"
                     required
                     minLength={6}
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                   >
                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                   </button>
                 </div>
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                   <Input
                     id="confirmPassword"
                     type={showPassword ? "text" : "password"}
                     placeholder="••••••••"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="pl-10"
                     required
                   />
                 </div>
               </div>
 
               <DaleButton
                 type="submit"
                 variant="hero"
                 size="lg"
                 className="w-full"
                 disabled={loading}
               >
                 {loading ? "Guardando..." : "Guardar contraseña"}
               </DaleButton>
             </form>
           </div>
         </motion.div>
       </main>
     </div>
   );
 };
 
 export default ResetPassword;