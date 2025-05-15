
import { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface TimelineZoomControlsProps {
  zoomLevel: number;
  onZoomChange: (value: number[]) => void;
}

const TimelineZoomControls = ({ zoomLevel, onZoomChange }: TimelineZoomControlsProps) => {
  const [showZoomSlider, setShowZoomSlider] = useState(false);
  const sliderTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Auto-hide slider after delay
    if (sliderTimeoutRef.current) {
      window.clearTimeout(sliderTimeoutRef.current);
    }

    sliderTimeoutRef.current = window.setTimeout(() => {
      setShowZoomSlider(false);
      sliderTimeoutRef.current = null;
    }, 3000);

    return () => {
      if (sliderTimeoutRef.current) {
        window.clearTimeout(sliderTimeoutRef.current);
      }
    };
  }, [zoomLevel]);

  const handleZoomSliderToggle = () => {
    setShowZoomSlider(prev => !prev);
    
    // Clear any existing timeout
    if (sliderTimeoutRef.current) {
      window.clearTimeout(sliderTimeoutRef.current);
      sliderTimeoutRef.current = null;
    }
  };

  return (
    <>
      <div 
        className="zoom-indicator cursor-pointer opacity-50 hover:opacity-80 transition-opacity"
        onClick={handleZoomSliderToggle}
      >
        {zoomLevel < 30 ? (
          <>
            <ZoomIn size={14} />
            <span className="text-xs font-medium">Zoom</span>
          </>
        ) : (
          <>
            <ZoomOut size={14} />
            <span className="text-xs font-medium">Zoom</span>
          </>
        )}
      </div>
      
      <div className={`zoom-slider-container ${showZoomSlider ? 'open' : ''}`}>
        <ZoomOut size={12} className="text-gray-400" />
        <Slider 
          value={[zoomLevel]} 
          onValueChange={onZoomChange} 
          max={100} 
          step={5}
          className="flex-1" 
        />
        <ZoomIn size={12} className="text-gray-400" />
      </div>
    </>
  );
};

export default TimelineZoomControls;
