import { TimelineEvent } from "@/types";
import { HistoricEventModel } from "../models/HistoricEventModel";
import { supabase } from "../../integrations/supabase/client";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export class HistoricEventController {
  async getAllEvents(): Promise<ApiResponse<TimelineEvent[]>> {
    try {
      console.log("Fetching all events from Supabase...");

      // First, let's check if we can access the table
      const { count, error: countError } = await supabase
        .from("historic_events")
        .select("*", { count: "exact", head: true });

      // Now fetch the actual data with user information
      const { data, error } = await supabase
        .from("historic_events")
        .select("*")
        .order("year", { ascending: true });

      if (error) {
        console.error("Supabase fetch error:", error);
        return { error: "Failed to fetch events", status: 500 };
      }

      console.log("Number of events:", data?.length);

      // Get unique creator IDs
      const creatorIds = [...new Set(data?.map(event => event.created_by))];
      console.log("Creator IDs:", creatorIds);
      console.log(
        "Raw creator IDs from events:",
        data?.map(event => event.created_by)
      );

      // First, let's try to fetch a single user to verify the ID
      const { data: singleUser, error: singleUserError } = await supabase
        .from("users")
        .select("id, username")
        .eq("id", "609b80de-28a1-4a45-a900-924c44a8e0ed")
        .single();

      console.log("Single user test:", { singleUser, singleUserError });

      // Now try the bulk fetch
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, username")
        .in("id", creatorIds);

      console.log("User data response:", userData);
      console.log("User error:", userError);

      if (userError) {
        console.error("Error fetching users:", userError);
        return { error: "Failed to fetch user data", status: 500 };
      }

      // Create a map of user IDs to usernames
      const userMap = new Map(userData?.map(user => [user.id, user.username]) || []);
      console.log("User map:", Object.fromEntries(userMap));
      console.log("Raw user data:", userData);

      const timelineEvents = data.map(event => {
        const timelineEvent = HistoricEventModel.toTimelineEvent(event);
        // Add creator information
        const username = userMap.get(event.created_by);
        console.log(`Looking up username for ${event.created_by}:`, username);
        timelineEvent.creator = {
          username: username || "Unknown",
        };
        return timelineEvent;
      });

      return { data: timelineEvents, status: 200 };
    } catch (error) {
      console.error("Error fetching historic events:", error);
      return {
        error: "Failed to fetch historic events",
        status: 500,
      };
    }
  }

  async getEventById(id: string): Promise<ApiResponse<TimelineEvent | null>> {
    try {
      const { data, error } = await supabase
        .from("historic_events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Supabase fetch error:", error);
        return { error: "Event not found", status: 404 };
      }

      return { data: HistoricEventModel.toTimelineEvent(data), status: 200 };
    } catch (error) {
      console.error(`Error fetching historic event with ID ${id}:`, error);
      return {
        error: `Failed to fetch historic event with ID ${id}`,
        status: 500,
      };
    }
  }

  async createEvent(event: Omit<TimelineEvent, "id">): Promise<ApiResponse<TimelineEvent>> {
    try {
      // Check if user is authenticated
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      if (authError || !session) {
        console.error("Authentication error:", authError);
        return {
          error: "User must be authenticated to create events",
          status: 401,
        };
      }

      const backendData = HistoricEventModel.fromTimelineEventWithoutId(event);
      console.log("Attempting to create event with data:", backendData);

      const { data, error } = await supabase
        .from("historic_events")
        .insert([backendData])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        return {
          error: `Failed to create event: ${error.message}`,
          status: 500,
        };
      }

      if (!data) {
        console.error("No data returned from insert");
        return {
          error: "No data returned after creating event",
          status: 500,
        };
      }

      return {
        data: HistoricEventModel.toTimelineEvent(data),
        status: 201,
      };
    } catch (error) {
      console.error("Error creating historic event:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to create historic event",
        status: 500,
      };
    }
  }

  async updateEvent(id: string, event: TimelineEvent): Promise<ApiResponse<TimelineEvent>> {
    try {
      // Include id for update
      const backendData = HistoricEventModel.fromTimelineEvent(event);

      const { data, error } = await supabase
        .from("historic_events")
        .update(backendData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        return { error: "Failed to update event", status: 500 };
      }

      return { data: HistoricEventModel.toTimelineEvent(data), status: 200 };
    } catch (error) {
      console.error("Unexpected error:", error);
      return { error: "Failed to update event", status: 500 };
    }
  }

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    try {
      // Check if user is authenticated
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      if (authError || !session) {
        console.error("Authentication error:", authError);
        return {
          error: "User must be authenticated to delete events",
          status: 401,
        };
      }

      console.log("Current user session:", {
        userId: session.user.id,
        role: session.user.user_metadata?.role,
        email: session.user.email,
      });
      console.log("Attempting to delete event with ID:", id);

      // First check if the event exists and get its details
      const { data: existingEvent, error: checkError } = await supabase
        .from("historic_events")
        .select("*")
        .eq("id", id)
        .single();

      console.log("Existing event check:", { existingEvent, checkError });

      if (checkError) {
        console.error("Error checking event existence:", checkError);
        return {
          error: "Event not found",
          status: 404,
        };
      }

      // Check if user has permission to delete
      const isAdmin = session.user.user_metadata?.role === "admin";
      const isOwner = existingEvent.created_by === session.user.id;

      console.log("Permission check:", {
        isAdmin,
        isOwner,
        userId: session.user.id,
        eventCreator: existingEvent.created_by,
        eventId: id,
      });

      if (!isAdmin && !isOwner) {
        return {
          error: "You don't have permission to delete this event",
          status: 403,
        };
      }

      // Perform the delete with explicit error handling
      const { error: deleteError, status } = await supabase
        .from("historic_events")
        .delete()
        .eq("id", id)
        .select();

      console.log("Delete operation result:", {
        deleteError,
        status,
        affectedRows: deleteError ? 0 : 1,
      });

      if (deleteError) {
        console.error("Supabase delete error details:", {
          code: deleteError.code,
          message: deleteError.message,
          details: deleteError.details,
          hint: deleteError.hint,
        });
        return {
          error: `Failed to delete event: ${deleteError.message}`,
          status: 500,
        };
      }

      // Verify deletion with a more specific query
      const { data: verifyEvent, error: verifyError } = await supabase
        .from("historic_events")
        .select("id")
        .eq("id", id)
        .maybeSingle();

      console.log("Verification after delete:", {
        verifyEvent,
        verifyError,
        eventStillExists: !!verifyEvent,
      });

      if (verifyEvent) {
        console.error("Event still exists after delete attempt:", verifyEvent);
        return {
          error: "Failed to delete event - event still exists",
          status: 500,
        };
      }

      return { status: 204 };
    } catch (error) {
      console.error(`Error deleting historic event with ID ${id}:`, error);
      return {
        error: error instanceof Error ? error.message : "Failed to delete event",
        status: 500,
      };
    }
  }
}
