
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { timelineEvents, allMusicStyles } from "@/data/events";
import { TimelineEvent } from "@/types";
import { X, Plus, UserRoundPlus, FolderPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AdminPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<TimelineEvent[]>(timelineEvents);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    id: crypto.randomUUID(),
    title: "",
    date: "",
    year: new Date().getFullYear(),
    location: {
      city: "",
      province: ""
    },
    style: [],
    description: "",
    videoUrl: ""
  });
  const [newStyle, setNewStyle] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "city" || name === "province") {
      setNewEvent({
        ...newEvent,
        location: {
          ...newEvent.location,
          [name]: value
        }
      });
    } else if (name === "year") {
      setNewEvent({
        ...newEvent,
        year: parseInt(value) || new Date().getFullYear()
      });
    } else {
      setNewEvent({
        ...newEvent,
        [name]: value
      });
    }
  };

  const handleAddStyle = () => {
    if (newStyle && !newEvent.style?.includes(newStyle)) {
      setNewEvent({
        ...newEvent,
        style: [...(newEvent.style || []), newStyle]
      });
      setNewStyle("");
    }
  };

  const handleRemoveStyle = (styleToRemove: string) => {
    setNewEvent({
      ...newEvent,
      style: newEvent.style?.filter(style => style !== styleToRemove) || []
    });
  };

  const handleAddEvent = () => {
    // Validate required fields
    if (!newEvent.title || !newEvent.date || !newEvent.description || !newEvent.location?.city || !newEvent.location?.province || !newEvent.style?.length) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Add the new event
    const updatedEvents = [...events, newEvent as TimelineEvent];
    setEvents(updatedEvents);
    
    // Show success message
    toast({
      title: "Event Added",
      description: "The event has been added to the timeline",
    });
    
    // Reset the form
    setNewEvent({
      id: crypto.randomUUID(),
      title: "",
      date: "",
      year: new Date().getFullYear(),
      location: {
        city: "",
        province: ""
      },
      style: [],
      description: "",
      videoUrl: ""
    });
    
    // Note: In a real application, this would save to a database
    console.log("New events list (would save to database):", updatedEvents);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cuba-navy">Admin Dashboard</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate("/")}>View Timeline</Button>
          <Button variant="outline" onClick={() => navigate("/map")}>View Map</Button>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Historic Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title*</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={newEvent.title} 
                  onChange={handleInputChange} 
                  placeholder="Birth of the Danzón" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date*</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    value={newEvent.date} 
                    onChange={handleInputChange} 
                    placeholder="January 1, 1879" 
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year*</Label>
                  <Input 
                    id="year" 
                    name="year" 
                    type="number" 
                    value={newEvent.year} 
                    onChange={handleInputChange} 
                    placeholder="1879" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City*</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={newEvent.location?.city} 
                    onChange={handleInputChange} 
                    placeholder="Havana" 
                  />
                </div>
                <div>
                  <Label htmlFor="province">Province*</Label>
                  <Input 
                    id="province" 
                    name="province" 
                    value={newEvent.location?.province} 
                    onChange={handleInputChange} 
                    placeholder="La Habana" 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="videoUrl">YouTube Video URL (optional)</Label>
                <Input 
                  id="videoUrl" 
                  name="videoUrl" 
                  value={newEvent.videoUrl} 
                  onChange={handleInputChange} 
                  placeholder="https://www.youtube.com/watch?v=..." 
                />
              </div>
            </div>
            
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
                    onChange={(e) => setNewStyle(e.target.value)} 
                    placeholder="Add a music style..." 
                    onKeyPress={(e) => e.key === 'Enter' && handleAddStyle()}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddStyle} 
                    variant="outline"
                    size="icon"
                  >
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
                            setNewEvent({
                              ...newEvent,
                              style: [...(newEvent.style || []), style]
                            });
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
          <Button 
            onClick={handleAddEvent} 
            className="w-full md:w-auto ml-auto"
          >
            <UserRoundPlus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Current Events ({events.length})</CardTitle>
          <Button variant="ghost" disabled className="cursor-not-allowed opacity-50">
            <FolderPlus className="mr-2 h-4 w-4" /> Save All Changes
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4">
            Note: This is a demo interface. In a production environment, changes would be saved to a database.
          </p>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-md p-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{event.title}</h3>
                  <span className="text-sm text-cuba-red">{event.date}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {event.location.city}, {event.location.province}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {event.style.map(style => (
                    <Badge key={style} variant="outline" className="text-xs">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
