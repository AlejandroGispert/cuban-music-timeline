import React, { useRef, useState, useEffect } from "react";
import { TimelineEvent as TimelineEventType } from "@/types";
import TimelineEvent from "./TimelineEvent";

interface TimelineContentProps {
  filteredEvents: TimelineEventType[];
  expandedEvent: string | null;
  toggleExpand: (id: string) => void;
  zoomedOut: boolean;
  veryZoomedOut: boolean;
  resetFilters: () => void;
}

const TimelineContent = ({
  filteredEvents,
  expandedEvent,
  toggleExpand,
  zoomedOut,
  veryZoomedOut,
  resetFilters,
}: TimelineContentProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // For drag-to-scroll
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number>(0);
  const scrollLeftStart = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    dragStartX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftStart.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = x - dragStartX.current;
    scrollContainerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  if (!Array.isArray(filteredEvents) || filteredEvents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">No timeline events to show.</p>
    );
  }

  return (
    <div className="relative min-h-[300px] w-full px-4">
      {/* Timeline center line */}
      <div
        className="absolute left-0 w-full h-[2px] bg-gray-300 z-0"
        style={{ top: expandedEvent ? "35%" : "50%" }}
      />
      {/* Scroll container with drag support */}
      <div
        ref={scrollContainerRef}
        className="scroll-container whitespace-nowrap overflow-x-auto cursor-grab"
        style={{ paddingTop: "80px", paddingBottom: "80px" }} // space for cards above/below line
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {filteredEvents.map((event, index) => (
          <div
            key={event.id}
            className={`inline-block align-top relative z-10 ${
              index % 2 === 0 ? "translate-y-[-60px]" : "translate-y-[60px]"
            }`}
            style={{ width: 280, marginRight: 24 }}
          >
            <TimelineEvent
              event={event}
              index={index}
              isLeft={index % 2 === 0}
              isExpanded={expandedEvent === event.id}
              onToggleExpand={() => toggleExpand(event.id)}
              zoomedOut={zoomedOut}
              veryZoomedOut={veryZoomedOut}
            />

            {/* Dot on timeline line */}
            {expandedEvent !== event.id && (
              <div
                className="w-3 h-3 rounded-full bg-gray-400 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{
                  top: index % 2 === 0 ? "132px" : "12px", // Higher dot when card is below
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineContent;
