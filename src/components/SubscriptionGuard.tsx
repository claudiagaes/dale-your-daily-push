import { Navigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { data, isLoading } = useSubscription();

  if (authLoading || isLoading) {
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
    return <Navigate to="/login" replace />;
  }

  if (!data?.subscribed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
