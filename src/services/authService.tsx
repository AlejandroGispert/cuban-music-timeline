// src/services/authService.ts
import { supabase } from "../../integrations/supabase/client";
import { User } from "@/types";

export const signup = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth`,
    },
  });

  if (data?.user) {
    const user: User = {
      id: data.user.id,
      email: data.user.email || "",
      role: data.user.user_metadata?.role || "editor",
    };
    return { user, error: null };
  }

  return { user: null, error };
};

export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        return {
          user: null,
          error: "Please check your email to confirm your account before logging in.",
        };
      }
      return { user: null, error };
    }

    if (data?.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || "",
        role: data.user.user_metadata?.role || "editor",
      };
      return { user, error: null };
    }

    return { user: null, error: new Error("No user data received") };
  } catch (error) {
    console.error("Login error:", error);
    return {
      user: null,
      error: error instanceof Error ? error : new Error("An unexpected error occurred"),
    };
  }
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session, error };
};

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (data?.user) {
    const user: User = {
      id: data.user.id,
      email: data.user.email || "",
      role: data.user.user_metadata?.role || "editor",
    };
    return { user, error: null };
  }

  return { user: null, error };
};

export const resendConfirmationEmail = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });
  return { error };
};
