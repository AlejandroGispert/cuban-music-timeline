import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "editor";
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, checkAuth } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isAuthed = await checkAuth();
        if (!isAuthed) {
          setShowToast(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthStatus();
  }, [checkAuth]);

  // Show toast in a separate effect to avoid setState during render
  useEffect(() => {
    if (showToast) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      setShowToast(false);
    }
  }, [showToast]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Check if user has either admin or editor role
  if (requiredRole && user?.role !== "admin" && user?.role !== "editor") {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
