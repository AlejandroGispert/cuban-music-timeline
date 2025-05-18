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
  thumbnailUrl?: string; // Optional image for display
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
