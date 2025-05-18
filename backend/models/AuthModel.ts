// src/models/AuthModel.ts

import { User } from "@/types";
import { supabase } from "../../integrations/supabase/client";

export interface SignupPayload {
  email: string;
  password: string;
  accessCode: string;
}

export interface SignupResponse {
  user: User | null;
  error: string | null;
}

export class AuthModel {
  static async signupWithRole(payload: SignupPayload): Promise<SignupResponse> {
    try {
      // First validate the access code
      const { data: accessCode, error: accessError } = await supabase
        .from("access_codes")
        .select("*")
        .eq("code", payload.accessCode)
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (!accessCode || accessError) {
        return {
          user: null,
          error: "Invalid, expired, or already used access code",
        };
      }

      // Create the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            role: accessCode.role,
          },
        },
      });

      if (error || !data?.user) {
        return {
          user: null,
          error: error?.message || "Failed to create user account",
        };
      }

      // Mark the access code as used
      const { error: updateError } = await supabase
        .from("access_codes")
        .update({
          used: true,
        })
        .eq("id", accessCode.id);

      if (updateError) {
        console.error("Failed to mark access code as used:", updateError);
      }

      // Return the created user
      const user: User = {
        id: data.user.id,
        email: data.user.email || "",
        role: data.user.user_metadata?.role || "editor",
      };

      return { user, error: null };
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      return {
        user: null,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      };
    }
  }
}
