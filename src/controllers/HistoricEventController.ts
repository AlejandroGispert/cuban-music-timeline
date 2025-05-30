import { TimelineEvent } from "@/types";
import { supabase } from "@/lib/supabase";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export class HistoricEventController {
  async getAllEvents(): Promise<ApiResponse<TimelineEvent[]>> {
    try {
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

      // Transform database events to TimelineEvent format
      const timelineEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        year: event.year,
        city: event.city,
        province: event.province,
        style: JSON.parse(event.styles),
        description: event.description,
        videoUrl: event.video_url,
        thumbnailUrl: event.thumbnail_url,
        createdBy: event.created_by,
      }));

      return { data: timelineEvents, status: 200 };
    } catch (error) {
      console.error("Error fetching historic events:", error);
      return {
        error: "Failed to fetch historic events",
        status: 500,
      };
    }
  }
}
