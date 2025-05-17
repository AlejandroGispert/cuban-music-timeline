import { HistoricEvent, TimelineEvent } from "@/types";

/**
 * Model class for historic events
 * This will be used to interact with the backend API
 */
export class HistoricEventModel {
  /**
   * Convert a backend HistoricEvent to a frontend TimelineEvent
   */
  static toTimelineEvent(event: HistoricEvent): TimelineEvent {
    return {
      id: event.id,
      title: event.title,
      date: event.date,
      year: event.year,
      location: {
        city: event.city,
        province: event.province,
      },
      style: event.styles,
      description: event.description,
      videoUrl: event.video_url,
      thumbnailUrl: event.thumbnail_url,
    };
  }

  /**
   * Convert a frontend TimelineEvent to a backend HistoricEvent
   */
  static fromTimelineEvent(event: TimelineEvent): HistoricEvent {
    return {
      title: event.title,
      date: event.date,
      year: event.year,
      city: event.city,
      province: event.province,
      styles: event.style,
      description: event.description,
      video_url: event.videoUrl,
      thumbnail_url: event.thumbnailUrl,
    };
  }
}
