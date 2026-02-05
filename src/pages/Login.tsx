 import { useState } from "react";
 import { motion } from "framer-motion";
 import { useNavigate, Link } from "react-router-dom";
 import { useAuth } from "@/hooks/useAuth";
 import DaleButton from "@/components/DaleButton";
import GoogleSignInButton from "@/components/GoogleSignInButton";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { toast } from "sonner";
 import { Mail, Lock, Eye, EyeOff } from "lucide-react";
 
 const Login = () => {
   const navigate = useNavigate();
   const { signIn } = useAuth();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
 
     const { error } = await signIn(email, password);
 
     if (error) {
       toast.error("Error al iniciar sesión", {
         description: error.message === "Invalid login credentials" 
           ? "Email o contraseña incorrectos" 
           : error.message,
       });
     } else {
       toast.success("¡Bienvenido de vuelta!");
       navigate("/entrenamiento");
     }
 
     setLoading(false);
   };
 
   return (
     <div className="min-h-screen bg-background flex flex-col">
       {/* Header */}
       <header className="p-4 md:p-6 border-b border-border/50">
         <div className="container-dale">
           <Link to="/" className="text-2xl font-extrabold text-motivational">
             Dale
           </Link>
         </div>
       </header>
 
       {/* Main Content */}
       <main className="flex-1 flex items-center justify-center px-4 py-10">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="w-full max-w-md"
         >
           <div className="text-center mb-8">
             <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
               ¡Hola de nuevo!
             </h1>
             <p className="text-muted-foreground">
               Ingresa para continuar con tu entrenamiento
             </p>
           </div>
 
           <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            {/* Google Sign In */}
            <GoogleSignInButton className="w-full mb-6" />

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">o con email</span>
              </div>
            </div>

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
 
               <div className="space-y-2">
                 <Label htmlFor="password">Contraseña</Label>
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
 
            <div className="flex justify-end mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

               <DaleButton
                 type="submit"
                 variant="hero"
                 size="lg"
                 className="w-full"
                 disabled={loading}
               >
                 {loading ? "Ingresando..." : "Ingresar"}
               </DaleButton>
             </form>
 
             <div className="mt-6 text-center">
               <p className="text-sm text-muted-foreground">
                 ¿No tienes cuenta?{" "}
                 <Link to="/registro" className="text-primary font-medium hover:underline">
                   Regístrate gratis
                 </Link>
               </p>
             </div>
           </div>
         </motion.div>
       </main>
     </div>
   );
 };
 
 export default Login;