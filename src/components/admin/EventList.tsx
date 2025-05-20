// src/components/admin/EventList.tsx

import { TimelineEvent } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Search, ChevronLeft, ChevronRight } from "lucide-react";
import EventStyleBadges from "../timeline/EventStyleBadges";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHistoricEvents } from "@/hooks/useHistoricEvents";

const EventList = () => {
  const { events, loadEvents, isLoading, error, updateEvent, deleteEvent } =
    useHistoricEvents(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // Default to 9 items (3x3 grid)

  // Load events when component mounts
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  // Reset to first page when search changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center">
        <div className="relative w-[300px]">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            type="text"
            placeholder="Search events by title..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={value => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9">9 per page</SelectItem>
              <SelectItem value="18">18 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentEvents.map(e => (
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
                <Button size="sm" onClick={() => updateEvent(e.id!.toString(), e)}>
                  <Pencil size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteEvent(e.id!.toString())}
                >
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredEvents.length)} of{" "}
          {filteredEvents.length} events
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventList;
