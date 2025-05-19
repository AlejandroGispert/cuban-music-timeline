import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      console.log("AuthGuard state:", { isAuthenticated, user, isLoading });

      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        navigate("/login");
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        console.log("User does not have required role:", { userRole: user?.role, requiredRole });
        navigate("/");
        return;
      }

      setIsChecking(false);
    }
  }, [isAuthenticated, user, isLoading, navigate, requiredRole]);

  // Only show loading state if we're still checking auth
  if (isLoading || isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-cuba-red" />
          <h2 className="text-xl font-semibold mb-2">Verifying access...</h2>
          <p className="text-sm text-gray-500">Please wait while we check your permissions.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
