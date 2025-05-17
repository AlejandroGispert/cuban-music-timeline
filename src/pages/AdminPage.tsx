import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
    if (name === "year") {
      setNewEvent(prev => ({ ...prev, year: parseInt(value, 10) || new Date().getFullYear() }));
    } else {
      setNewEvent(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationChange = (key: "city" | "province", selected: any) => {
    setNewEvent(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [key]: selected?.value || "", // ensure it's a string
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
      !newEvent.location?.city?.trim() ||
      !newEvent.location?.province?.trim() ||
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

    const payloadWithId = {
      ...(newEvent as TimelineEvent),
      id: editingEventId || newEvent.id || crypto.randomUUID(),
    };
    console.log("Submitting event", newEvent);
    const backendPayload = HistoricEventModel.fromTimelineEvent(payloadWithId);

    if (editingEventId) {
      await updateEvent(editingEventId, backendPayload);
      toast({ title: "Event Updated" });
    } else {
      console.log("Submitting event:", backendPayload);

      await createEvent(backendPayload);
      toast({ title: "Event Added" });
    }

    setNewEvent(getEmptyEvent());
    setEditingEventId(null);
    loadEvents();
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setNewEvent({
      ...event,
      style: Array.isArray(event.style) ? event.style : [], // ensure it's an array
    });
    setEditingEventId(event.id);
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
    toast({ title: "Event Deleted" });
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
                      newEvent.location?.province
                        ? { label: newEvent.location.province, value: newEvent.location.province }
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
                    value={
                      newEvent.location?.city
                        ? { label: newEvent.location.city, value: newEvent.location.city }
                        : null
                    }
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
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
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
