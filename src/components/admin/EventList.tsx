// src/components/admin/EventList.tsx

import { TimelineEvent } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Search } from "lucide-react";
import EventStyleBadges from "../timeline/EventStyleBadges";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Props {
  events: TimelineEvent[];
  onEdit: (event: TimelineEvent) => void;
  onDelete: (id: string) => void;
}

const EventList: React.FC<Props> = ({ events, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 mt-8 ">
      <div className="relative mt-8 w-[300px]">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 "
          size={16}
        />
        <Input
          type="text"
          placeholder="Search events by title..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map(e => (
          <div key={e.id} className="border p-4 rounded flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold h-12 line-clamp-2">{e.title}</p>
                <p className="text-sm text-gray-600">{e.date}</p>

                <div className="mt-2 flex flex-wrap gap-1 text-xs">
                  <EventStyleBadges styles={e.style} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => onEdit(e)}>
                  <Pencil size={16} />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(e.id.toString())}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t text-xs text-gray-500">
              Created by: {e.creator?.username || "Unknown"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
