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

const AdminPage = () => {
  const navigate = useNavigate();
  const { events, createEvent, deleteEvent, updateEvent, loadEvents } = useHistoricEvents();

  const [editingEvent, setEditingEvent] = useState<Partial<TimelineEvent> | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const loadCalled = useRef(false);
  useEffect(() => {
    console.log("called useeffect");
    if (!loadCalled.current) {
      loadEvents();
      loadCalled.current = true;
    }
  }, []);

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
      };

      if (event.id) {
        await updateEvent(event.id.toString(), HistoricEventModel.fromTimelineEvent(fullEvent));
        toast({ title: "Event Updated" });
      } else {
        const { id, ...payloadWithoutId } = fullEvent;
        await createEvent(payloadWithoutId);
        console.log("Submitting event:", fullEvent);

        toast({ title: "Event Created" });
      }

      setEditingEvent(null);
      loadEvents();
    } catch (err) {
      console.error(err);
      toast({
        title: "Save Failed",
        description: "There was a problem saving the event.",
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
