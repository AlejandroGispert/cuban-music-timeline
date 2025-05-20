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

      // Fetch events without user data for regular view
      const { data, error } = await supabase
        .from("historic_events")
        .select("*")
        .order("year", { ascending: true });

      if (error) {
        console.error("Supabase fetch error:", error);
        return { error: "Failed to fetch events", status: 500 };
      }

      if (!data?.length) {
        return { data: [], status: 200 };
      }

      // Transform events without user data
      const timelineEvents = data.map(event => HistoricEventModel.toTimelineEvent(event));

      return { data: timelineEvents, status: 200 };
    } catch (error) {
      console.error("Error fetching historic events:", error);
      return {
        error: "Failed to fetch historic events",
        status: 500,
      };
    }
  }

  async getAllEventsWithUserData(): Promise<ApiResponse<TimelineEvent[]>> {
    try {
      console.log("Fetching all events with user data from Supabase...");

      // Fetch events with user data for admin view - only select needed fields
      const { data, error } = await supabase
        .from("historic_events")
        .select(
          `
          id,
          title,
          date,
          year,
          city,
          province,
          styles,
          description,
          video_url,
          thumbnail_url,
          created_by,
          users!left (
            username
          )
        `
        )
        .order("year", { ascending: true });

      if (error) {
        console.error("Supabase fetch error:", error);
        return { error: "Failed to fetch events", status: 500 };
      }

      console.log("Raw data from Supabase:", JSON.stringify(data, null, 2));

      if (!data?.length) {
        return { data: [], status: 200 };
      }

      // Transform events with user data
      const timelineEvents = data.map(event => {
        console.log("Processing event:", event.id, "Users data:", event.users);

        // First convert to TimelineEvent without creator
        const timelineEvent = HistoricEventModel.toTimelineEvent({
          id: event.id,
          title: event.title,
          date: event.date,
          year: event.year,
          city: event.city,
          province: event.province,
          styles: event.styles,
          description: event.description,
          video_url: event.video_url,
          thumbnail_url: event.thumbnail_url,
          created_by: event.created_by,
        });

        // Then add creator data - handle both array and single object cases
        const username =
          event.users?.[0]?.username ||
          (typeof event.users === "object" && !Array.isArray(event.users)
            ? event.users.username
            : null) ||
          "Unknown";

        timelineEvent.creator = {
          username,
        };

        console.log("Transformed event:", timelineEvent);
        return timelineEvent;
      });

      return { data: timelineEvents, status: 200 };
    } catch (error) {
      console.error("Error fetching historic events with user data:", error);
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

      //   console.log("Current user session:", {
      //    userId: session.user.id,
      //role: session.user.user_metadata?.role,
      //   email: session.user.email,
      //});
      //  console.log("Attempting to delete event with ID:", id);

      // First check if the event exists and get its details
      const { data: existingEvent, error: checkError } = await supabase
        .from("historic_events")
        .select("*")
        .eq("id", id)
        .single();

      //      console.log("Existing event check:", { existingEvent, checkError });

      if (checkError) {
        //   console.error("Error checking event existence:", checkError);
        return {
          error: "Event not found",
          status: 404,
        };
      }

      // Check if user has permission to delete
      const isAdmin = session.user.user_metadata?.role === "admin";
      const isOwner = existingEvent.created_by === session.user.id;

      //     console.log("Permission check:", {
      //     isAdmin,
      //   isOwner,
      // userId: session.user.id,
      //eventCreator: existingEvent.created_by,
      //eventId: id,
      //});

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

      //   console.log("Verification after delete:", {
      //    verifyEvent,
      //    verifyError,
      //    eventStillExists: !!verifyEvent,
      //  });

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
