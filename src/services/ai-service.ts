import { TimelineEvent } from "@/types";
import { toast } from "sonner";

// AI model configuration
const AI_MODEL = "gpt-4o-mini";

export interface AITimelineRequest {
  musicStyles: string[];
  count: number;
  allEvents: TimelineEvent[];
}

export interface AITimelineResponse {
  selectedEvents: TimelineEvent[];
  explanation?: string;
}

export const generateAITimeline = async (
  request: AITimelineRequest
): Promise<AITimelineResponse> => {
  const { musicStyles, count, allEvents } = request;

  try {
    // Filter events if styles are selected
    let eventsToProcess = [...allEvents];
    if (musicStyles.length > 0) {
      eventsToProcess = allEvents.filter(event =>
        event.style.some(style => musicStyles.includes(style))
      );
    }

    // If we don't have enough events, return what we have
    if (eventsToProcess.length <= count) {
      return { selectedEvents: eventsToProcess };
    }

    // Prepare data for the OpenAI API
    const systemPrompt = `You are a music historian AI assistant that selects key events in Cuban music history.
       Based on the provided list of historical events, select exactly ${count} events that best represent 
       the evolution of Cuban music from its foundations to modern day.
       
       Choose events that:
       1. Span the entire timeline, with event #1 representing early foundations and event #${count} representing modern developments
       2. Include the most influential moments for the selected music styles
       3. Showcase diverse aspects of Cuban music evolution
       
       Return ONLY a JSON array of event IDs in chronological order, nothing else.`;

    const userPrompt = JSON.stringify({
      events: eventsToProcess.map(event => ({
        id: event.id,
        title: event.title,
        year: event.year,
        styles: event.style,
        description: event.description,
      })),
      selectedStyles: musicStyles,
      numberOfEvents: count,
    });

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getOpenAIKey()}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const contentString = data.choices[0].message.content;

    // Parse the response to get selected event IDs
    const selectedEventIds = JSON.parse(contentString);

    // Map the IDs back to actual events
    const selectedEvents = selectedEventIds
      .map(id => eventsToProcess.find(event => event.id === id))
      .filter(event => event !== undefined) as TimelineEvent[];

    // Sort by year
    selectedEvents.sort((a, b) => a.year - b.year);

    return { selectedEvents };
  } catch (error) {
    console.error("AI Timeline generation error:", error);
    toast.error("AI processing failed. Using algorithmic selection instead.");

    // Fallback to local selection logic if AI fails
    return fallbackSelection(allEvents, musicStyles, count);
  }
};

// Fallback function that uses the original algorithm if AI processing fails
const fallbackSelection = (
  events: TimelineEvent[],
  selectedStyles: string[],
  count: number
): AITimelineResponse => {
  // Filter events based on selected styles or use all events
  let filteredEvents = [...events];
  if (selectedStyles.length > 0) {
    filteredEvents = events.filter(event =>
      event.style.some(style => selectedStyles.includes(style))
    );
  }

  // Sort events by year
  filteredEvents.sort((a, b) => a.year - b.year);

  // Select events spread across the timeline
  const selectedEvents = selectEventsAcrossTimeline(filteredEvents, count);

  return { selectedEvents };
};

// The original algorithm, now as a fallback
const selectEventsAcrossTimeline = (events: TimelineEvent[], count: number): TimelineEvent[] => {
  if (events.length <= count) return events;

  const result: TimelineEvent[] = [];
  const minYear = events[0].year;
  const maxYear = events[events.length - 1].year;
  const yearRange = maxYear - minYear;

  // Always include the first and last event
  result.push(events[0]);

  // Select count-2 events in between
  for (let i = 1; i < count - 1; i++) {
    const targetYear = minYear + (yearRange * i) / (count - 1);

    // Find the event closest to the target year
    let closestEvent = events[0];
    let minDifference = Math.abs(closestEvent.year - targetYear);

    for (const event of events) {
      const difference = Math.abs(event.year - targetYear);
      if (difference < minDifference) {
        closestEvent = event;
        minDifference = difference;
      }
    }

    // Add the event if it's not already in the result
    if (!result.includes(closestEvent)) {
      result.push(closestEvent);
    } else {
      // If the closest event is already included, find the next best option
      const nextBestEvent = events.find(e => !result.includes(e));
      if (nextBestEvent) result.push(nextBestEvent);
    }
  }

  // Add the last event if not already included
  const lastEvent = events[events.length - 1];
  if (!result.includes(lastEvent)) {
    result.push(lastEvent);
  }

  // Sort the result by year
  return result.sort((a, b) => a.year - b.year);
};

// Function to get OpenAI API key - Start with storage or prompt for API key
const getOpenAIKey = (): string => {
  const storedKey = localStorage.getItem("openai_api_key");

  // Return stored key if available
  if (storedKey) {
    return storedKey;
  }

  // If no key is stored, prompt the user and store it
  const apiKey = prompt(
    "Please enter your OpenAI API key to enable AI timeline generation. " +
      "This will be stored in your browser for future use."
  );

  if (apiKey) {
    localStorage.setItem("openai_api_key", apiKey);
    return apiKey;
  }

  throw new Error("OpenAI API key is required for AI timeline generation");
};
