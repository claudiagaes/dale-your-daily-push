 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "./useAuth";
 
 export interface UserProgressData {
   id: string;
   programa: string;
   dia_actual: number;
   total_dias: number;
   dias_completados: number[] | null;
   fecha_inicio: string;
   fecha_ultimo_entrenamiento: string | null;
   completado: boolean;
 }
 
 export const useUserProgress = () => {
   const { user } = useAuth();
 
   return useQuery({
     queryKey: ["user_progress", user?.id],
     queryFn: async () => {
       if (!user) return null;
 
       const { data, error } = await supabase
         .from("user_progress")
         .select("id, programa, dia_actual, total_dias, dias_completados, fecha_inicio, fecha_ultimo_entrenamiento, completado")
         .eq("user_id", user.id)
         .order("created_at", { ascending: false })
         .limit(1)
         .maybeSingle();
 
       if (error) throw error;
       return data as UserProgressData | null;
     },
     enabled: !!user,
     staleTime: 1000 * 60 * 2, // 2 minutos
   });
 };
 
 export const useUpdateUserProgress = () => {
   const { user } = useAuth();
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, updates }: { id: string; updates: Partial<UserProgressData> }) => {
       const { error } = await supabase
         .from("user_progress")
         .update(updates)
         .eq("id", id);
 
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["user_progress", user?.id] });
     },
   });
 };
 
 export const useDeleteUserProgress = () => {
   const { user } = useAuth();
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async () => {
       if (!user) throw new Error("No user");
 
       const { error } = await supabase
         .from("user_progress")
         .delete()
         .eq("user_id", user.id);
 
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["user_progress", user?.id] });
     },
   });
 };