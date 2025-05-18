// types/timeline.ts

/**
 * Represents a single event shown in the timeline.
 */
export interface TimelineEvent {
  id?: number;
  title: string;
  date: string; // e.g., "January 1, 1959"
  year: number; // For easier sorting/filtering
  city: string;
  province: string;
  style: string[]; // e.g., ["Salsa", "Son Cubano"]
  description: string;
  videoUrl: string; // Optional YouTube link
  thumbnailUrl?: string;
  createdBy?: string; // Optional image for display
}

/**
 * Represents the database schema for historic events
 */
export interface HistoricEvent {
  id: number;
  title: string;
  date: string;
  year: number;
  city: string;
  province: string;
  styles: string; // Stored as JSON string in database
  description: string;
  video_url: string;
  thumbnail_url: string;
  created_by: string;
}

/**
 * Filter configuration for timeline queries.
 */
export interface FilterOptions {
  styles: string[]; // Music genres
  yearRange: [number, number]; // Inclusive year filter
  provinces: string[];
  cities: string[];
}
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
export interface User {
  id: string;
  email: string;
  role: "admin" | "editor";
}
