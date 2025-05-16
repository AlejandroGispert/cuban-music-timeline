import { HistoricEvent, ApiResponse, TimelineEvent } from "@/types";
import { HistoricEventModel } from "../models/HistoricEventModel";
import { supabase } from "../../integrations/supabase/client";

export class HistoricEventController {
  /**
   * Fetch all historic events
   */
  async getAllEvents(): Promise<ApiResponse<TimelineEvent[]>> {
    try {
      const { data, error } = await supabase.from("historic_events").select("*");
      console.log("Fetching all historic events");

      if (error) {
        console.error("Supabase fetch error:", error);
        return { error: "Failed to fetch events", status: 500 };
      }

      const timelineEvents = data.map(HistoricEventModel.toTimelineEvent);
      return { data: timelineEvents, status: 200 };
    } catch (error) {
      console.error("Error fetching historic events:", error);
      return {
        error: "Failed to fetch historic events",
        status: 500,
      };
    }
  }

  /**
   * Fetch a historic event by ID
   */
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

  /**
   * Create a new historic event
   */
  async createEvent(event: Omit<TimelineEvent, "id">): Promise<ApiResponse<TimelineEvent>> {
    try {
      const backendData = HistoricEventModel.fromTimelineEvent({
        ...event,
        id: crypto.randomUUID(),
      });

      const { data, error } = await supabase
        .from("historic_events")
        .insert([backendData])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return { error: "Failed to create event", status: 500 };
      }

      return {
        data: HistoricEventModel.toTimelineEvent(data),
        status: 201,
      };
    } catch (error) {
      console.error("Error creating historic event:", error);
      return {
        error: "Failed to create historic event",
        status: 500,
      };
    }
  }

  /**
   * Update an existing historic event
   */
  async updateEvent(id: string, event: TimelineEvent): Promise<ApiResponse<TimelineEvent>> {
    try {
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

  /**
   * Delete a historic event
   */
  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from("historic_events")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Supabase delete error:", error);
        return { error: "Failed to delete event", status: 500 };
      }

      return { status: 204 };
    } catch (error) {
      console.error(`Error deleting historic event with ID ${id}:`, error);
      return {
        error: `Failed to delete historic event with ID ${id}`,
        status: 500,
      };
    }
  }
}
