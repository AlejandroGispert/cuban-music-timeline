import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { allCities, allMusicStyles, allProvinces } from "@/constants/filters";
import { TimelineEvent } from "@/types";
import { useState } from "react";

interface Props {
  event: Partial<TimelineEvent>;
  onChange: (update: Partial<TimelineEvent>) => void;
}

const EventFormInputs: React.FC<Props> = ({ event, onChange }) => {
  const [newStyle, setNewStyle] = useState("");

  const styles = Array.isArray(event.style)
    ? event.style
    : typeof event.style === "string"
      ? event.style.split(",").map(s => s.trim())
      : [];

  const addStyle = () => {
    const trimmed = newStyle.trim();
    if (trimmed && !styles.includes(trimmed)) {
      onChange({ style: [...styles, trimmed] });
      setNewStyle("");
    }
  };

  const removeStyle = (style: string) => {
    onChange({ style: styles.filter(s => s !== style) });
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    onChange({
      date: date.toISOString().split("T")[0],
      year: date.getFullYear(),
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Title</Label>
        <Input
          placeholder="Title"
          value={event.title || ""}
          onChange={e => onChange({ title: e.target.value })}
        />
      </div>

      <div>
        <Label>Date</Label>
        <br />
        <DatePicker
          selected={event.date ? new Date(event.date) : null}
          onChange={handleDateChange}
          className="w-full border rounded px-2 py-2"
          dateFormat="dd-MM-yyyy"
          placeholderText="Select a date"
        />
      </div>

      <div>
        <Label>Province</Label>
        <Select
          options={allProvinces.map(p => ({ value: p, label: p }))}
          value={event.province ? { label: event.province, value: event.province } : null}
          onChange={val => onChange({ province: val?.value })}
        />
      </div>

      <div>
        <Label>City</Label>
        <Select
          options={allCities.map(c => ({ value: c, label: c }))}
          value={event.city ? { label: event.city, value: event.city } : null}
          onChange={val => onChange({ city: val?.value })}
        />
      </div>

      <div className="md:col-span-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Description"
          value={event.description || ""}
          onChange={e => onChange({ description: e.target.value })}
        />
      </div>

      <div className="md:col-span-2">
        <Label>YouTube URL</Label>
        <Input
          placeholder="YouTube URL"
          value={event.videoUrl || ""}
          onChange={e => onChange({ videoUrl: e.target.value })}
        />
      </div>

      <div className="md:col-span-2">
        <Label>Music Styles*</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {styles.map(style => (
            <Badge key={style} variant="outline" className="flex items-center gap-1">
              {style}
              <X size={14} onClick={() => removeStyle(style)} className="cursor-pointer" />
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
                addStyle();
              }
            }}
            placeholder="Add music style..."
          />
          <Button onClick={addStyle} size="icon" variant="outline">
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
                if (!styles?.includes(style)) {
                  onChange({ style: [...styles, style] });
                }
              }}
            >
              {style}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFormInputs;
