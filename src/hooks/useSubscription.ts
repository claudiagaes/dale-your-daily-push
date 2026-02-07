import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SubscriptionData {
  subscribed: boolean;
  subscription_end: string | null;
}

export const useSubscription = () => {
  const { user, session } = useAuth();

  return useQuery<SubscriptionData>({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;
      return data as SubscriptionData;
    },
    enabled: !!user && !!session,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000,
    retry: 1,
  });
};
