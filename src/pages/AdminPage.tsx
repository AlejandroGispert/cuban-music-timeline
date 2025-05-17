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
      // id is integer, so undefined initially (to be assigned by backend or manually)
      id: undefined,
      title: "",
      date: today.toISOString().split("T")[0],
      year: today.getFullYear(),
      city: "",
      province: "",
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
    if (name === "year") {
      setNewEvent(prev => ({ ...prev, year: parseInt(value, 10) || new Date().getFullYear() }));
    } else {
      setNewEvent(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationChange = (key: "city" | "province", selected: any) => {
    setNewEvent(prev => ({
      ...prev,
      [key]: selected?.value || "",
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
      setNewEvent(prev => ({
        ...prev,
        style: [...(prev.style || []), trimmed],
      }));
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
    const missingFields =
      !newEvent.title?.trim() ||
      !newEvent.date?.trim() ||
      !newEvent.description?.trim() ||
      !newEvent.city?.trim() ||
      !newEvent.province?.trim() ||
      !Array.isArray(newEvent.style) ||
      newEvent.style.length === 0;

    if (missingFields) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const stylesArray = Array.isArray(newEvent.style) ? newEvent.style : [newEvent.style];

    const fullPayload: TimelineEvent = {
      id: newEvent.id, // 0 or undefined if new, or assigned by backend
      title: newEvent.title!.trim(),
      date: newEvent.date!,
      year: newEvent.year!,
      city: newEvent.city!,
      province: newEvent.province!,
      style: stylesArray,
      description: newEvent.description!.trim(),
      videoUrl: newEvent.videoUrl,
      thumbnailUrl: newEvent.thumbnailUrl ?? "",
    };

    try {
      if (editingEventId) {
        // Update requires ID
        const backendPayload = HistoricEventModel.fromTimelineEvent(fullPayload);
        await updateEvent(editingEventId, backendPayload);
        console.log("Updating event:", backendPayload);
        toast({ title: "Event Updated" });
      } else {
        // Create omits ID, backend will generate it
        const { id, ...payloadWithoutId } = fullPayload;
        const backendPayload = HistoricEventModel.fromTimelineEventWithoutId(payloadWithoutId);
        await createEvent(backendPayload);
        console.log("Creating event:", backendPayload);
        toast({ title: "Event Added" });
      }

      setNewEvent(getEmptyEvent());
      setEditingEventId(null);
      loadEvents();
    } catch (err) {
      console.error("Error preparing event:", err);
      toast({
        title: "Internal Error",
        description: "There was a problem preparing or saving the event.",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setNewEvent({
      id: event.id,
      title: event.title,
      date: event.date,
      year: event.year,
      city: event.city,
      province: event.province,
      style: Array.isArray(event.style) ? event.style : [event.style],
      description: event.description,
      videoUrl: event.videoUrl,
    });
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cuba-navy">Admin Dashboard</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate("/")}>
            View Timeline
          </Button>
          <Button variant="outline" onClick={() => navigate("/map")}>
            View Map
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">
            {editingEventId ? "Edit Event" : "Add New Historic Event"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InputField
                label="Title*"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
              />
              <div>
                <Label>Date*</Label>
                <DatePicker
                  selected={newEvent.date ? new Date(newEvent.date) : null}
                  onChange={handleDateChange}
                  className="w-full border rounded-md px-3 py-2"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select a date"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Province*</Label>
                  <Select
                    options={allProvinces.map(p => ({ label: p, value: p }))}
                    value={
                      newEvent.province
                        ? { label: newEvent.province, value: newEvent.province }
                        : null
                    }
                    onChange={val => handleLocationChange("province", val)}
                    placeholder="Select Province"
                  />
                </div>
                <div>
                  <Label>City*</Label>
                  <Select
                    options={allCities.map(c => ({ label: c, value: c }))}
                    value={newEvent.city ? { label: newEvent.city, value: newEvent.city } : null}
                    onChange={val => handleLocationChange("city", val)}
                    placeholder="Select City"
                  />
                </div>
              </div>
              <InputField
                label="YouTube URL"
                name="videoUrl"
                value={newEvent.videoUrl}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-4">
              <Label>Description*</Label>
              <Textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                className="min-h-[150px]"
              />

              <Label>Music Styles*</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newEvent.style?.map(style => (
                  <Badge key={style} variant="outline" className="flex items-center gap-1">
                    {style}
                    <X
                      size={14}
                      onClick={() => handleRemoveStyle(style)}
                      className="cursor-pointer"
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newStyle}
                  onChange={e => setNewStyle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddStyle();
                    }
                  }}
                  placeholder="Add music style..."
                />
                <Button onClick={handleAddStyle} size="icon" variant="outline">
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {allMusicStyles.map(style => (
                  <Badge
                    key={style}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => {
                      if (!newEvent.style?.includes(style)) {
                        setNewEvent(prev => ({
                          ...prev,
                          style: [...(prev.style || []), style],
                        }));
                      }
                    }}
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveEvent} className="ml-auto">
            <UserRoundPlus className="mr-2 h-4 w-4" />
            {editingEventId ? "Update Event" : "Add Event"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Current Events ({events.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {events
            .slice() // create a shallow copy so you don't mutate original array
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(event => (
              <div key={event.id} className="border p-4 rounded-md">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {event.city}
                      {event.province}
                      {new Date(event.date).toLocaleDateString()}
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
