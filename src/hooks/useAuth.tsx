// src/hooks/useAuth.ts
import { useState, useEffect, useRef } from "react";
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

  // Add a ref to track if we've already checked auth
  const hasCheckedAuth = useRef(false);
  const checkInProgress = useRef(false);
  const lastAuthState = useRef(authState);

  const checkAuth = async () => {
    // Prevent multiple simultaneous checks
    if (checkInProgress.current) {
      console.log("Auth check already in progress, skipping...");
      return false;
    }

    try {
      checkInProgress.current = true;
      const { session } = await getSession();
      const { user } = await getUser();

      console.log("Checking auth - Full details:", {
        session: session
          ? {
              access_token: session.access_token,
              user: session.user,
              user_metadata: session.user?.user_metadata,
            }
          : null,
        user: user
          ? {
              id: user.id,
              email: user.email,
              role: user.role,
              metadata: user.user_metadata,
            }
          : null,
      });

      if (session && user) {
        // Ensure we get the role from user metadata
        const userWithRole = {
          ...user,
          role: session.user.user_metadata?.role || user.role,
        };

        // Only update state if it's different
        if (
          JSON.stringify(lastAuthState.current) !==
          JSON.stringify({
            user: userWithRole,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        ) {
          console.log("Setting auth state with user:", userWithRole);
          const newState = {
            user: userWithRole,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          };
          lastAuthState.current = newState;
          setAuthState(newState);
        }
        return true;
      }

      // Only update state if it's different
      if (
        JSON.stringify(lastAuthState.current) !==
        JSON.stringify({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      ) {
        console.log("No valid session or user found");
        const newState = {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        };
        lastAuthState.current = newState;
        setAuthState(newState);
      }
      return false;
    } catch (error) {
      console.error("Auth check error:", error);
      const newState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Auth check failed",
      };
      lastAuthState.current = newState;
      setAuthState(newState);
      return false;
    } finally {
      checkInProgress.current = false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (!mounted) return;

      if (event === "SIGNED_IN" && session) {
        const { user } = await getUser();
        if (user && mounted) {
          // Ensure we get the role from user metadata
          const userWithRole = {
            ...user,
            role: session.user.user_metadata?.role || user.role,
          };

          // Only update state if it's different
          if (
            JSON.stringify(lastAuthState.current) !==
            JSON.stringify({
              user: userWithRole,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          ) {
            console.log("User authenticated:", userWithRole);
            const newState = {
              user: userWithRole,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            };
            lastAuthState.current = newState;
            setAuthState(newState);
          }
        }
      } else if (event === "SIGNED_OUT" && mounted) {
        // Only update state if it's different
        if (
          JSON.stringify(lastAuthState.current) !==
          JSON.stringify({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        ) {
          console.log("User signed out");
          const newState = {
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          };
          lastAuthState.current = newState;
          setAuthState(newState);
        }
      }
    });

    // Only do initial session check if we haven't already
    if (!hasCheckedAuth.current) {
      checkAuth();
      hasCheckedAuth.current = true;
    }

    return () => {
      mounted = false;
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
