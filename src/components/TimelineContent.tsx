import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { TimelineEvent as TimelineEventTypes } from "@/types";
import TimelineEvent from "./TimelineEvent";

interface TimelineContentProps {
  filteredEvents: TimelineEventTypes[];
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
  if (!Array.isArray(filteredEvents) || filteredEvents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">No timeline events to show.</p>
    );
  }

  return (
    <div className="relative min-h-[300px] w-full overflow-x-auto px-4">
      {/* Timeline center line */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300 z-0" />

      <Carousel opts={{ align: "start" }} plugins={[Autoplay({ delay: 4000 })]} className="w-full">
        <CarouselContent className="flex gap-12 py-12">
          {filteredEvents.map((event, index) => (
            <CarouselItem key={event.id} className="basis-auto relative flex flex-col items-center">
              {/* Alternate above/below the line */}
              <div
                className={`relative z-10 ${
                  index % 2 === 0 ? "translate-y-[-60px]" : "translate-y-[60px]"
                }`}
              >
                {/* Render your event content however you like: */}
                <TimelineEvent
                  event={event}
                  index={index}
                  isLeft={index % 2 === 0}
                  isExpanded={expandedEvent === event.id}
                  onToggleExpand={() => toggleExpand(event.id)}
                  zoomedOut={zoomedOut}
                  veryZoomedOut={veryZoomedOut}
                />
              </div>

              {/* Dot on the timeline */}
              <div className="w-3 h-3 rounded-full bg-gray-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
export default TimelineContent;
