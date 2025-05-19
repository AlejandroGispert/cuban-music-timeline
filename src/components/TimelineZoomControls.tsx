import { useState, useRef } from "react";
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import clsx from "clsx";

interface TimelineZoomControlsProps {
  zoomLevel: number;
  onZoomChange: (value: number[]) => void;
}

const TimelineZoomControls = ({ zoomLevel, onZoomChange }: TimelineZoomControlsProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const showSlider = isHovered || isFocused;

  const handleResetZoom = () => {
    onZoomChange([50]);
  };

  return (
    <div
      className="absolute top-4 right-4 z-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
        {zoomLevel <= 20 ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
        <span className="text-sm font-medium">Zoom</span>
      </div>

      <div
        className={clsx(
          "flex items-center gap-2 bg-white shadow-md rounded-xl px-3 py-2 mt-2 transition-all duration-300",
          showSlider ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <ZoomOut size={14} className={zoomLevel <= 0 ? "text-gray-300" : "text-gray-500"} />
        <Slider
          value={[zoomLevel]}
          onValueChange={onZoomChange}
          max={100}
          step={5}
          className="w-36"
        />
        <ZoomIn size={14} className={zoomLevel >= 100 ? "text-gray-300" : "text-gray-500"} />

        {zoomLevel !== 50 && (
          <button onClick={handleResetZoom} className="ml-2 text-xs text-blue-500 hover:underline">
            <RefreshCw size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TimelineZoomControls;
