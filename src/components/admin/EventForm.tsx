import { useState, useEffect } from "react";
import EventFormInputs from "./EventFormInputs";
import { TimelineEvent } from "@/types";
import { Button } from "@/components/ui/button";

interface Props {
  event: Partial<TimelineEvent> | null;
  onSave: (event: Partial<TimelineEvent>) => void;
  onCancel: () => void;
}

const getEmptyEvent = (): Partial<TimelineEvent> => {
  const today = new Date();
  return {
    title: "",
    date: today.toISOString().split("T")[0],
    year: today.getFullYear(),
    city: "",
    province: "",
    style: [],
    description: "",
    videoUrl: "",
  };
};

const parseStyle = (style: unknown): string[] => {
  if (Array.isArray(style)) return style;
  if (typeof style === "string") {
    try {
      const parsed = JSON.parse(style);
      return Array.isArray(parsed) ? parsed : [style];
    } catch {
      // Fallback if JSON parsing fails (comma-separated string?)
      return style.split(",").map(s => s.trim());
    }
  }
  return [];
};

const EventForm: React.FC<Props> = ({ event, onSave, onCancel }) => {
  const [formState, setFormState] = useState<Partial<TimelineEvent>>(getEmptyEvent());

  useEffect(() => {
    if (event) {
      const parsedStyle = parseStyle(event.style);
      setFormState({ ...event, style: parsedStyle });
    } else {
      setFormState(getEmptyEvent());
    }
  }, [event]);

  const handleChange = (updated: Partial<TimelineEvent>) => {
    setFormState(prev => ({ ...prev, ...updated }));
  };

  const handleSubmit = () => {
    console.log("clicked");
    const requiredFields = ["title", "date", "description", "city", "province", "style"];
    const missing = requiredFields.some(
      k =>
        !formState[k as keyof TimelineEvent] ||
        (k === "style" && (formState.style as any[])?.length === 0)
    );

    if (missing) {
      console.log("error: missing required field(s)");
      return;
    }

    // Ensure style is an array before saving
    const finalEvent: Partial<TimelineEvent> = {
      ...formState,
      style: Array.isArray(formState.style) ? formState.style : parseStyle(formState.style),
    };

    onSave(finalEvent);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <EventFormInputs event={formState} onChange={handleChange} />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
};

export default EventForm;
