import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { X, Plus, UserRoundPlus, Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";

import { useHistoricEvents } from "@/hooks/useHistoricEvents";
import { TimelineEvent } from "@/types";
import { allMusicStyles, allCities, allProvinces } from "@/constants/filters";
import EventStyleBadges from "@/components/timeline/EventStyleBadges";
import { HistoricEventModel } from "../../backend/models/HistoricEventModel";

const AdminPage = () => {
  const navigate = useNavigate();
  const { events, createEvent, deleteEvent, updateEvent, loadEvents } = useHistoricEvents();

  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>(getEmptyEvent());
  const [newStyle, setNewStyle] = useState("");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function getEmptyEvent(): Partial<TimelineEvent> {
    const today = new Date();
    return {
      id: crypto.randomUUID(),
      title: "",
      date: today.toISOString().split("T")[0],
      year: today.getFullYear(),
      location: { city: "", province: "" },
      style: [],
      description: "",
      videoUrl: "",
    };
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev =>
      name === "year"
        ? { ...prev, year: parseInt(value, 10) || new Date().getFullYear() }
        : { ...prev, [name]: value }
    );
  };

  const handleLocationChange = (key: "city" | "province", selected: any) => {
    setNewEvent(prev => ({
      ...prev,
      location: {
        ...(prev.location || { city: "", province: "" }),
        [key]: selected?.value || "",
      },
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setNewEvent(prev => ({
      ...prev,
      date: date.toISOString().split("T")[0],
      year: date.getFullYear(),
    }));
  };

  const handleAddStyle = () => {
    const trimmed = newStyle.trim();
    if (trimmed && !newEvent.style?.includes(trimmed)) {
      setNewEvent(prev => ({ ...prev, style: [...(prev.style || []), trimmed] }));
      setNewStyle("");
    }
  };

  const handleRemoveStyle = (styleToRemove: string) => {
    setNewEvent(prev => ({
      ...prev,
      style: prev.style?.filter(s => s !== styleToRemove) || [],
    }));
  };

  const handleSaveEvent = async () => {
    const missing =
      !newEvent.title?.trim() ||
      !newEvent.date?.trim() ||
      !newEvent.description?.trim() ||
      !newEvent.location?.city?.trim() ||
      !newEvent.location?.province?.trim() ||
      !Array.isArray(newEvent.style) ||
      newEvent.style.length === 0;

    if (missing) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const fullPayload: TimelineEvent = {
        id: newEvent.id ?? editingEventId ?? crypto.randomUUID(),
        title: newEvent.title!.trim(),
        date: newEvent.date!,
        year: newEvent.year!,
        location: {
          city: newEvent.location!.city,
          province: newEvent.location!.province,
        },
        style: [...newEvent.style!],
        description: newEvent.description!.trim(),
        videoUrl: newEvent.videoUrl,
        thumbnailUrl: newEvent.thumbnailUrl,
      };

      const backendPayload = HistoricEventModel.fromTimelineEvent(fullPayload);

      if (editingEventId) {
        await updateEvent(editingEventId, backendPayload);
        toast({ title: "Event Updated" });
      } else {
        await createEvent(backendPayload);
        toast({ title: "Event Added" });
      }

      setNewEvent(getEmptyEvent());
      setEditingEventId(null);
      loadEvents();
    } catch (err) {
      console.error("Error saving event:", err);
      toast({
        title: "Internal Error",
        description: "Could not save the event. Please check input.",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setNewEvent({ ...event, style: [...event.style] });
    setEditingEventId(event.id);
  };

  const confirmDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!pendingDeleteId) return;
    await deleteEvent(pendingDeleteId);
    toast({ title: "Event Deleted" });
    setShowConfirmDelete(false);
    setPendingDeleteId(null);
    loadEvents();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... (header and form code unchanged) */}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Current Events ({events.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="border p-4 rounded-md">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {event.location.city}, {event.location.province} – {event.date}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button size="sm" onClick={() => handleEditEvent(event)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => confirmDelete(event.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1 text-xs">
                <EventStyleBadges styles={event.style} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 🧾 Confirm Delete Modal */}
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>This will permanently delete this event. This action cannot be undone.</p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Yes, delete it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  name: string;
  value: any;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <Label htmlFor={name}>{label}</Label>
    <Input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  </div>
);

export default AdminPage;
