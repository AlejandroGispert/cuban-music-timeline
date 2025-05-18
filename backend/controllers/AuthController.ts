import { z } from "zod";
import { supabase } from "../../integrations/supabase/client";

// Password validation
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase")
  .regex(/[a-z]/, "Must contain lowercase")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

// Rate limiting (in-memory)
const signupAttempts = new Map<string, { count: number; timestamp: number }>();
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW = 15 * 60 * 1000;

export async function secureSignup(email: string, password: string, accessCode: string) {
  try {
    const now = Date.now();
    const attempt = signupAttempts.get(email) || { count: 0, timestamp: now };

    if (attempt.count >= MAX_ATTEMPTS && now - attempt.timestamp < ATTEMPT_WINDOW) {
      return {
        error: "Too many signup attempts. Please try again later.",
        user: null,
      };
    }

    // Validate fields
    if (!email || !password || !accessCode) {
      return { error: "Missing required fields", user: null };
    }

    // Validate email format
    try {
      z.string().email().parse(email);
    } catch (err) {
      return { error: "Invalid email format", user: null };
    }

    // Validate password
    try {
      passwordSchema.parse(password);
    } catch (err) {
      return {
        error: (err as z.ZodError).errors?.[0]?.message || "Invalid password",
        user: null,
      };
    }

    // Validate access code from Supabase table
    const { data: accessRow, error: accessError } = await supabase
      .from("access_codes")
      .select("*")
      .eq("code", accessCode)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (!accessRow || accessError) {
      signupAttempts.set(email, { count: attempt.count + 1, timestamp: now });
      return {
        error: "Invalid, expired, or already used access code",
        user: null,
      };
    }

    // Create user with role from DB
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: accessRow.role },
    });

    if (error || !data?.user) {
      return {
        user: null,
        error: error?.message || "Failed to create user account",
      };
    }

    // Mark code as used
    const { error: updateError } = await supabase
      .from("access_codes")
      .update({
        used: true,
        used_by: data.user.id,
        used_at: new Date().toISOString(),
      })
      .eq("id", accessRow.id);

    if (updateError) {
      console.error("Failed to mark access code as used:", updateError);
    }

    // Clear rate limiting on success
    signupAttempts.delete(email);

    return {
      user: data.user,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error during signup:", error);
    return {
      user: null,
      error: "An unexpected error occurred during signup",
    };
  }
}
