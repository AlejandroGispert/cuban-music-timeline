import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface TimelineContentProps {
  items?: React.ReactNode[]; // Made optional to prevent runtime crash
}

export default function TimelineContent({ items }: TimelineContentProps) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No timeline events to show.
      </p>
    );
  }

  return (
    <div className="relative min-h-[300px] w-full overflow-x-auto px-4">
      {/* Timeline center line */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300 z-0" />

      <Carousel
        opts={{
          align: "start",
        }}
        plugins={[Autoplay({ delay: 4000 })]}
        className="w-full"
      >
        <CarouselContent className="flex gap-12 py-12">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className="basis-auto relative flex flex-col items-center"
            >
              {/* Alternate cards above and below the center line */}
              <div
                className={`relative z-10 ${
                  index % 2 === 0
                    ? "translate-y-[-60px]"
                    : "translate-y-[60px]"
                }`}
              >
                {item}
              </div>

              {/* Dot positioned exactly on the center line */}
              <div className="w-3 h-3 rounded-full bg-gray-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
