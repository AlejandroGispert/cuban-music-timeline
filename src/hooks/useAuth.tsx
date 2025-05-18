// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import {
  signup,
  login,
  logout,
  getUser,
  getSession,
  resendConfirmationEmail,
} from "@/services/authService";
import { User, AuthState } from "@/types";
import { AuthModel } from "../../backend/models/AuthModel";
import { supabase } from "../../integrations/supabase/client";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const { user } = await getUser();
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        }
      } else if (event === "SIGNED_OUT") {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    // Initial session check
    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignup = async (email: string, password: string, accessCode: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { user, error } = await AuthModel.signupWithRole({ email, password, accessCode });

      if (!user || error) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error || "Signup failed",
        }));
        return false;
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error:
          "Account created successfully! Please check your email to confirm your account before logging in.",
      }));

      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }));
      return false;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { user, error } = await login(email, password);

      if (error) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || "Login failed",
        }));
        return false;
      }

      if (!user) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: "No user data received",
        }));
        return false;
      }

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }));
      return false;
    }
  };

  const handleLogout = async () => {
    await logout();
    setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
  };

  const checkAuth = async () => {
    try {
      const { session } = await getSession();
      const { user } = await getUser();

      if (session && user) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      return false;
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Auth check failed",
      });
      return false;
    }
  };

  const handleResendConfirmation = async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { error } = await resendConfirmationEmail(email);

      if (error) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
        return false;
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: "Confirmation email resent. Please check your inbox.",
      }));
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to resend confirmation email",
      }));
      return false;
    }
  };

  return {
    ...authState,
    signup: handleSignup,
    login: handleLogin,
    logout: handleLogout,
    checkAuth,
    resendConfirmation: handleResendConfirmation,
  };
}
