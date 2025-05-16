
import { useState } from "react";
import { TimelineEvent } from "@/types";
import { HistoricEventController } from "../../backend/controllers/HistoricEventController.ts";

/**
 * Custom hook for managing historic events
 */
export function useHistoricEvents() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const controller = new HistoricEventController();
  
  /**
   * Load all events from the API
   */
  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await controller.getAllEvents();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setEvents(response.data);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading events:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create a new event
   */
  const createEvent = async (event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
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
      setError('An unexpected error occurred while creating the event');
      console.error('Error creating event:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update an existing event
   */
  const updateEvent = async (id: string, event: TimelineEvent): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await controller.updateEvent(id, event);
      
      if (response.error) {
        setError(response.error);
        return false;
      } else if (response.data) {
        setEvents(prev => prev.map(e => (e.id === id ? response.data! : e)));
        return true;
      }
      
      return false;
    } catch (err) {
      setError('An unexpected error occurred while updating the event');
      console.error('Error updating event:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete an event
   */
  const deleteEvent = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await controller.deleteEvent(id);
      
      if (response.error) {
        setError(response.error);
        return false;
      } else {
        setEvents(prev => prev.filter(e => e.id !== id));
        return true;
      }
    } catch (err) {
      setError('An unexpected error occurred while deleting the event');
      console.error('Error deleting event:', err);
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
    deleteEvent
  };
}
