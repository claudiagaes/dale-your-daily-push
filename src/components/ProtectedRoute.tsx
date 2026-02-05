 import { Navigate, useLocation } from "react-router-dom";
 import { useAuth } from "@/hooks/useAuth";
 import { Skeleton } from "@/components/ui/skeleton";
 
 interface ProtectedRouteProps {
   children: React.ReactNode;
 }
 
 const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
   const { user, loading } = useAuth();
   const location = useLocation();
 
   if (loading) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <div className="space-y-4 w-full max-w-md px-4">
           <Skeleton className="h-12 w-3/4 mx-auto" />
           <Skeleton className="h-32 w-full rounded-2xl" />
           <Skeleton className="h-32 w-full rounded-2xl" />
         </div>
       </div>
     );
   }
 
   if (!user) {
     // Guardar la ruta actual para redirigir después del login
     return <Navigate to="/login" state={{ from: location.pathname }} replace />;
   }
 
   return <>{children}</>;
 };
 
 export default ProtectedRoute;