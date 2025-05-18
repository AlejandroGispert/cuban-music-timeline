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
    // console.log("Converting backend event to timeline event:", event);

    let styles: string[] = [];
    try {
      styles = JSON.parse(event.styles);
      // console.log("Parsed styles:", styles);
    } catch (e) {
      console.error("Error parsing styles:", e, "Raw styles:", event.styles);
    }

    const timelineEvent = {
      id: event.id,
      title: event.title,
      date: event.date,
      year: event.year,
      city: event.city,
      province: event.province,
      style: styles,
      description: event.description,
      videoUrl: event.video_url,
      thumbnailUrl: event.thumbnail_url,
      createdBy: event.created_by,
    };

    // console.log("Converted to timeline event:", timelineEvent);
    return timelineEvent;
  }

  /**
   * Convert a frontend TimelineEvent to a backend HistoricEvent
   */
  static fromTimelineEvent(event: TimelineEvent): HistoricEvent {
    // console.log("Converting timeline event to backend event:", event);

    const stylesAsString = Array.isArray(event.style) ? JSON.stringify(event.style) : "[]";
    // console.log("Styles as string:", stylesAsString);

    const backendEvent = {
      id: event.id!,
      title: event.title,
      date: event.date,
      year: event.year,
      city: event.city,
      province: event.province,
      styles: stylesAsString,
      description: event.description,
      video_url: event.videoUrl,
      thumbnail_url: event.thumbnailUrl ?? "",
      created_by: event.createdBy ?? "",
    };

    console.log("Converted to backend event:", backendEvent);
    return backendEvent;
  }

  static fromTimelineEventWithoutId(event: Omit<TimelineEvent, "id">): Omit<HistoricEvent, "id"> {
    // console.log("Converting timeline event (without id) to backend event:", event);

    const stylesAsString = Array.isArray(event.style) ? JSON.stringify(event.style) : "[]";
    // console.log("Styles as string:", stylesAsString);

    const backendData = {
      title: event.title,
      date: event.date,
      year: event.year,
      city: event.city,
      province: event.province,
      styles: stylesAsString,
      description: event.description,
      video_url: event.videoUrl,
      thumbnail_url: event.thumbnailUrl ?? "",
      created_by: event.createdBy ?? "",
    };
    // console.log("Converted to backend data:", backendData);

    return backendData;
  }
}
