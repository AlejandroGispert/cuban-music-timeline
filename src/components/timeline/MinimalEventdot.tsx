import React from "react";
import { TimelineEvent as TimelineEventType } from "@/types";

interface MinimalEventDotProps {
  event: TimelineEventType;
  onToggleExpand: () => void;
  onSelectVideo: (url: string) => void;
}

const MinimalEventDot = ({ event, onToggleExpand, onSelectVideo }: MinimalEventDotProps) => {
  const displayTitle = event.title || `${event.year}`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onToggleExpand();
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        className="group relative flex flex-col items-center cursor-pointer"
        aria-label={`View ${displayTitle}`}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-cuba-red border border-red-300/30 shadow-sm group-hover:scale-110 group-hover:bg-red-500 transition-all duration-200" />
        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {displayTitle}
        </span>
      </button>
    </div>
  );
};

export default MinimalEventDot;
