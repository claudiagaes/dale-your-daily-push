 import { useState } from "react";
 import { motion } from "framer-motion";
 import { Link } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import DaleButton from "@/components/DaleButton";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { toast } from "sonner";
 import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
 
 const ForgotPassword = () => {
   const [email, setEmail] = useState("");
   const [loading, setLoading] = useState(false);
   const [sent, setSent] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
 
     const { error } = await supabase.auth.resetPasswordForEmail(email, {
       redirectTo: `${window.location.origin}/reset-password`,
     });
 
     setLoading(false);
 
     if (error) {
       toast.error("Error", {
         description: "No pudimos enviar el correo. Intenta de nuevo.",
       });
       return;
     }
 
     setSent(true);
   };
 
   if (sent) {
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
               <h1 className="text-2xl font-bold mb-3">¡Revisa tu correo!</h1>
               <p className="text-muted-foreground mb-6">
                 Te enviamos un enlace a <strong>{email}</strong> para restablecer tu contraseña.
               </p>
               <p className="text-sm text-muted-foreground mb-6">
                 Si no lo ves, revisa tu carpeta de spam.
               </p>
               <Link to="/login">
                 <DaleButton variant="ghost" className="w-full">
                   <ArrowLeft className="w-4 h-4 mr-2" />
                   Volver al login
                 </DaleButton>
               </Link>
             </div>
           </motion.div>
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
           <Link
             to="/login"
             className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
           >
             <ArrowLeft className="w-4 h-4 mr-1" />
             Volver al login
           </Link>
 
           <div className="text-center mb-8">
             <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
               ¿Olvidaste tu contraseña?
             </h1>
             <p className="text-muted-foreground">
               Te enviaremos un enlace para restablecerla
             </p>
           </div>
 
           <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
             <form onSubmit={handleSubmit} className="space-y-5">
               <div className="space-y-2">
                 <Label htmlFor="email">Email</Label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                   <Input
                     id="email"
                     type="email"
                     placeholder="tu@email.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
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
                 {loading ? "Enviando..." : "Enviar enlace"}
               </DaleButton>
             </form>
           </div>
         </motion.div>
       </main>
     </div>
   );
 };
 
 export default ForgotPassword;