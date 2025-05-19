import React, { useRef, useState, useEffect } from "react";
import { TimelineEvent as TimelineEventType } from "@/types";
import TimelineEvent from "./TimelineEvent";
import debug from "debug";

interface TimelineContentProps {
  filteredEvents: TimelineEventType[] | { decade: number; events: TimelineEventType[] }[];
  expandedEvent: string | null;
  toggleExpand: (id: string) => void;
  zoomedOut: boolean;
  veryZoomedOut: boolean;
  superZoomedIn: boolean;
  resetFilters: () => void;
  setSelectedVideoUrl: (url: string | undefined) => void;
}

const TimelineContent = ({
  filteredEvents,
  expandedEvent,
  toggleExpand,
  zoomedOut,
  veryZoomedOut,
  superZoomedIn,
  resetFilters,
  setSelectedVideoUrl,
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
    <div className="relative min-h-[300px] w-full">
      {/* Timeline center line */}
      <div
        className="absolute left-0 w-full h-[2px] bg-red-300 z-0"
        style={{ top: expandedEvent ? "150px" : "150px" }}
      />
      {/* Scroll container with drag support */}
      <div
        ref={scrollContainerRef}
        className="scroll-container whitespace-nowrap overflow-x-auto cursor-grab w-full"
        style={{ paddingTop: "80px", paddingBottom: "80px" }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {veryZoomedOut
          ? // Render grouped events with decade labels
            (filteredEvents as { decade: number; events: TimelineEventType[] }[]).map(
              (group, groupIndex) => (
                <div key={group.decade} className="inline-block">
                  <div className="text-xs text-gray-400 text-center mb-2">{group.decade}s</div>
                  <div className="flex items-center space-x-1">
                    {group.events.map((event, index) => (
                      <div
                        key={event.id}
                        className="inline-block"
                        style={{ width: 40, marginRight: 2 }}
                      >
                        <TimelineEvent
                          event={event}
                          index={index}
                          isLeft={index % 2 === 0}
                          isExpanded={expandedEvent === event.id.toString()}
                          onToggleExpand={() => toggleExpand(event.id.toString())}
                          zoomedOut={zoomedOut}
                          veryZoomedOut={veryZoomedOut}
                          onSelectVideo={(url: string) => setSelectedVideoUrl(url)}
                          superZoomedIn={superZoomedIn}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            )
          : // Render normal timeline view
            (filteredEvents as TimelineEventType[]).map((event, index) => (
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
                  isExpanded={expandedEvent === event.id.toString()}
                  onToggleExpand={() => toggleExpand(event.id.toString())}
                  zoomedOut={zoomedOut}
                  veryZoomedOut={veryZoomedOut}
                  onSelectVideo={(url: string) => setSelectedVideoUrl(url)}
                  superZoomedIn={superZoomedIn}
                />

                {/* Dot on timeline line */}
                {expandedEvent !== event.id.toString() && (
                  <div
                    className="w-3 h-3 rounded-full bg-gray-400 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                    style={{
                      top: index % 2 === 0 ? "132px" : "12px",
                      pointerEvents: "none",
                    }}
                  ></div>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default TimelineContent;
