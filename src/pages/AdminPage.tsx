// src/components/admin/AdminPage.tsx

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useHistoricEvents } from "@/hooks/useHistoricEvents";
import { TimelineEvent } from "@/types";
import { HistoricEventModel } from "../../backend/models/HistoricEventModel";
import EventForm from "../components/admin/EventForm";
import EventList from "../components/admin/EventList";
import ConfirmDeleteDialog from "../components/admin/ConfirmDeleteDialog";
import AccessCodeManager from "../components/admin/AccessCodeManager";
import { useAuth } from "@/hooks/useAuth";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, createEvent, deleteEvent, updateEvent, loadEvents } = useHistoricEvents();

  const [editingEvent, setEditingEvent] = useState<Partial<TimelineEvent> | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const loadCalled = useRef(false);

  // Load events on mount, only once
  useEffect(() => {
    if (!loadCalled.current) {
      console.log("Loading events in AdminPage...");
      loadEvents();
      loadCalled.current = true;
    }
  }, []); // Remove loadEvents from dependencies

  // Verify admin access
  useEffect(() => {
    if (user && user.role !== "admin") {
      console.log("Non-admin user attempting to access admin page:", user);
      navigate("/");
    } else {
      console.log("Current user state:", user);
    }
  }, [user, navigate]);

  const handleSave = async (event: Partial<TimelineEvent>) => {
    try {
      const fullEvent: TimelineEvent = {
        id: event.id,
        title: event.title!.trim(),
        date: event.date!,
        year: event.year!,
        city: event.city!,
        province: event.province!,
        style: event.style!,
        description: event.description!.trim(),
        videoUrl: event.videoUrl,
        thumbnailUrl: event.thumbnailUrl ?? "",
        createdBy: user?.id ?? "",
      };

      if (event.id) {
        console.log("Updating event:", fullEvent);
        const result = await updateEvent(event.id.toString(), fullEvent);
        if (!result) {
          throw new Error("Update failed silently");
        }
        toast({ title: "Event Updated" });
      } else {
        const { id, ...payloadWithoutId } = fullEvent;
        console.log("Creating new event:", payloadWithoutId);
        const result = await createEvent(payloadWithoutId);
        if (!result) {
          throw new Error("Create failed silently");
        }
        toast({ title: "Event Created" });
      }

      setEditingEvent(null);
      loadEvents();
    } catch (err) {
      console.error("Error saving event:", err);
      toast({
        title: "Save Failed",
        description: err instanceof Error ? err.message : "There was a problem saving the event.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (event: TimelineEvent) => {
    setEditingEvent({ ...event });
  };

  const handleConfirmDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (pendingDeleteId) {
      await deleteEvent(pendingDeleteId);
      toast({ title: "Event Deleted" });
      loadEvents();
    }
    setShowConfirmDelete(false);
    setPendingDeleteId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cuba-navy">Admin Dashboard</h1>
        <div className="space-x-2">
          <Button onClick={() => navigate("/")}>View Timeline</Button>
          <Button onClick={() => navigate("/map")}>View Map</Button>
        </div>
      </div>
      <div>
        <Card className="w-full max-w-6xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              {editingEvent?.id ? "Edit Event" : "Add New Historic Event"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventForm
              event={editingEvent}
              onSave={handleSave}
              onCancel={() => setEditingEvent(null)}
            />
          </CardContent>
        </Card>
        {/* Only show Access Code manager for admins */}
        {user?.role === "admin" && <AccessCodeManager />}
      </div>
      <EventList events={events} onEdit={handleEdit} onDelete={handleConfirmDelete} />

      <ConfirmDeleteDialog
        open={showConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminPage;
