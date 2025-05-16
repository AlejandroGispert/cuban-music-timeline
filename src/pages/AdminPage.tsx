import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { X, Plus, UserRoundPlus, FolderPlus } from "lucide-react";

import { useHistoricEvents } from "@/hooks/useHistoricEvents";
import { TimelineEvent } from "@/types";
import { allMusicStyles } from "@/constants/filters";

import EventStyleBadges from "../components/timeline/EventStyleBadges";

const AdminPage = () => {
  const navigate = useNavigate();
  const { events, createEvent, loadEvents } = useHistoricEvents();

  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    id: crypto.randomUUID(),
    title: "",
    date: "",
    year: new Date().getFullYear(),
    location: {
      city: "",
      province: "",
    },
    style: [],
    description: "",
    videoUrl: "",
  });

  const [newStyle, setNewStyle] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "city" || name === "province") {
      setNewEvent(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else if (name === "year") {
      setNewEvent(prev => ({
        ...prev,
        year: parseInt(value, 10) || new Date().getFullYear(),
      }));
    } else {
      setNewEvent(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddStyle = () => {
    if (newStyle && !newEvent.style?.includes(newStyle)) {
      setNewEvent(prev => ({
        ...prev,
        style: [...(prev.style || []), newStyle],
      }));
      setNewStyle("");
    }
  };

  const handleRemoveStyle = (styleToRemove: string) => {
    setNewEvent(prev => ({
      ...prev,
      style: prev.style?.filter(style => style !== styleToRemove) || [],
    }));
  };

  const handleAddEvent = async () => {
    const required = [
      "title",
      "date",
      "description",
      "location.city",
      "location.province",
      "style",
    ];
    const missing = required.some(field => {
      const value = field.split(".").reduce((obj, key) => obj?.[key], newEvent);
      return !value || (Array.isArray(value) && value.length === 0);
    });

    if (missing) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const saved = await createEvent(newEvent as Omit<TimelineEvent, "id">);
    if (!saved) return;

    toast({
      title: "Event Added",
      description: "The event has been added to the timeline",
    });

    setNewEvent({
      id: crypto.randomUUID(),
      title: "",
      date: "",
      year: new Date().getFullYear(),
      location: {
        city: "",
        province: "",
      },
      style: [],
      description: "",
      videoUrl: "",
    });

    loadEvents(); // Refresh event list
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

      {/* Add Event Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Historic Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Fields */}
            <div className="space-y-4">
              <InputField
                label="Event Title*"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Date*"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Year*"
                  name="year"
                  type="number"
                  value={newEvent.year}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="City*"
                  name="city"
                  value={newEvent.location?.city}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Province*"
                  name="province"
                  value={newEvent.location?.province}
                  onChange={handleInputChange}
                />
              </div>
              <InputField
                label="YouTube Video URL"
                name="videoUrl"
                value={newEvent.videoUrl}
                onChange={handleInputChange}
              />
            </div>

            {/* Right Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  placeholder="Describe the historical event..."
                  className="min-h-[150px]"
                />
              </div>

              <div>
                <Label>Music Styles*</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newEvent.style?.map(style => (
                    <Badge
                      key={style}
                      variant="outline"
                      className="bg-cuba-blue/10 text-cuba-blue border-cuba-blue/20 flex items-center gap-1"
                    >
                      {style}
                      <X
                        size={14}
                        className="cursor-pointer"
                        onClick={() => handleRemoveStyle(style)}
                      />
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newStyle}
                    onChange={e => setNewStyle(e.target.value)}
                    placeholder="Add a music style..."
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddStyle();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddStyle} variant="outline" size="icon">
                    <Plus size={16} />
                  </Button>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">Suggested styles:</p>
                  <div className="flex flex-wrap gap-1">
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
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddEvent} className="w-full md:w-auto ml-auto">
            <UserRoundPlus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </CardFooter>
      </Card>

      {/* Existing Events List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Current Events ({events.length})</CardTitle>
          <Button variant="ghost" disabled className="cursor-not-allowed opacity-50">
            <FolderPlus className="mr-2 h-4 w-4" /> Save All Changes
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4">
            Note: This is a demo interface. In a production environment, changes would be saved to a
            database.
          </p>
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="border rounded-md p-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{event.title}</h3>
                  <span className="text-sm text-cuba-red">{event.date}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {event.location.city}, {event.location.province}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <EventStyleBadges styles={event.style} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Reusable Input Field
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
