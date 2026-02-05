 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "./useAuth";
 
 export interface ProfileData {
   display_name: string | null;
   email: string | null;
   bio: string | null;
   objetivo: string | null;
   nivel: string | null;
   tiempo_disponible: string | null;
   programa_asignado: string | null;
   avatar_url: string | null;
 }
 
 export const useProfile = () => {
   const { user } = useAuth();
 
   return useQuery({
     queryKey: ["profile", user?.id],
     queryFn: async () => {
       if (!user) return null;
 
       const { data, error } = await supabase
         .from("profiles")
         .select("display_name, email, bio, objetivo, nivel, tiempo_disponible, programa_asignado, avatar_url")
         .eq("user_id", user.id)
         .maybeSingle();
 
       if (error) throw error;
       return data as ProfileData | null;
     },
     enabled: !!user,
     staleTime: 1000 * 60 * 5, // 5 minutos
   });
 };
 
 export const useUpdateProfile = () => {
   const { user } = useAuth();
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (updates: Partial<ProfileData>) => {
       if (!user) throw new Error("No user");
 
       const { error } = await supabase
         .from("profiles")
         .update(updates)
         .eq("user_id", user.id);
 
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
     },
   });
 };