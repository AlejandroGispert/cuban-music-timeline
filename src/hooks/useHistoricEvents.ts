import { useState, useRef, useCallback } from "react";
import { TimelineEvent } from "@/types";
import { HistoricEventController } from "../../backend/controllers/HistoricEventController";
import { toast } from "@/components/ui/use-toast";

/**
 * Custom hook for managing historic events
 */
export const useHistoricEvents = (isAdminView: boolean = false) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to track if loadEvents is already running, preventing duplicate calls
  const loadingRef = useRef(false);

  const loadEvents = useCallback(async () => {
    // Prevent duplicate calls if already loading
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const controller = new HistoricEventController();
      const response = isAdminView
        ? await controller.getAllEventsWithUserData()
        : await controller.getAllEvents();

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setEvents(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [isAdminView]);

  /**
   * Create a new event
   */
  const createEvent = async (event: Omit<TimelineEvent, "id">): Promise<TimelineEvent | null> => {
    if (isLoading) return null; // Optional: prevent concurrent creates

    setIsLoading(true);
    setError(null);

    try {
      const controller = new HistoricEventController();
      const response = await controller.createEvent(event);

      if (response.error) {
        setError(response.error);
        return null;
      } else if (response.data) {
        setEvents(prev => [...prev, response.data!]);
        return response.data;
      }

      return null;
    } catch (err) {
      setError("An unexpected error occurred while creating the event");
      console.error("Error creating event:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing event
   */
  const updateEvent = async (id: string, event: TimelineEvent): Promise<boolean> => {
    if (isLoading) return false; // Optional: prevent concurrent updates

    setIsLoading(true);
    setError(null);

    try {
      const controller = new HistoricEventController();
      const response = await controller.updateEvent(id, event);

      if (response.error) {
        setError(response.error);
        return false;
      } else if (response.data) {
        setEvents(prev => prev.map(e => (e.id === Number(id) ? response.data! : e)));
        return true;
      }

      return false;
    } catch (err) {
      setError("An unexpected error occurred while updating the event");
      console.error("Error updating event:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete an event
   */
  const deleteEvent = async (id: string): Promise<boolean> => {
    if (isLoading) return false;

    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting delete operation for event:", id);
      const controller = new HistoricEventController();
      const response = await controller.deleteEvent(id);
      console.log("Delete response:", response);

      if (response.error) {
        console.error("Delete error:", response.error);
        setError(response.error);
        toast({
          title: "Delete Failed",
          description: response.error,
          variant: "destructive",
        });
        return false;
      }

      // Only update the UI if the delete was successful
      if (response.status === 204) {
        console.log("Delete successful, updating UI");
        setEvents(prev => {
          const newEvents = prev.filter(e => e.id !== Number(id));
          console.log("Events after delete:", newEvents);
          return newEvents;
        });
        toast({ title: "Event Deleted" });
        return true;
      }

      console.log("Delete operation completed with unexpected status:", response.status);
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while deleting the event";
      setError(errorMessage);
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error deleting event:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    events,
    isLoading,
    error,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
