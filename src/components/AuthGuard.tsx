import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

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

  if (isLoading || isChecking) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
