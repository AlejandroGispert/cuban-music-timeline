
import { useState, useEffect } from "react";
import { TimelineEvent as TimelineEventType, FilterOptions } from "@/types";
import { timelineEvents, yearRange } from "@/data/events";
import TimelineHeader from "./TimelineHeader";
import TimelineContent from "./TimelineContent";
import TimelineZoomControls from "./TimelineZoomControls";

const Timeline = () => {
  const [filteredEvents, setFilteredEvents] = useState<TimelineEventType[]>(timelineEvents);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    styles: [],
    yearRange: yearRange,
    provinces: [],
    cities: []
  });
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(50); // 0-100 scale
  
  // Derived state for zoom level
  const zoomedOut = zoomLevel < 30;
  const veryZoomedOut = zoomLevel < 10;

  useEffect(() => {
    // Apply filters
    const result = timelineEvents.filter(event => {
      // Filter by music style
      if (filterOptions.styles.length > 0 && 
          !event.style.some(style => filterOptions.styles.includes(style))) {
        return false;
      }
      
      // Filter by year range
      if (event.year < filterOptions.yearRange[0] || 
          event.year > filterOptions.yearRange[1]) {
        return false;
      }
      
      // Filter by province
      if (filterOptions.provinces.length > 0 && 
          !filterOptions.provinces.includes(event.location.province)) {
        return false;
      }
      
      // Filter by city
      if (filterOptions.cities.length > 0 && 
          !filterOptions.cities.includes(event.location.city)) {
        return false;
      }
      
      return true;
    });
    
    // Sort by year
    result.sort((a, b) => a.year - b.year);
    
    setFilteredEvents(result);
  }, [filterOptions]);

  useEffect(() => {
    // Close expanded events when very zoomed out
    if (veryZoomedOut && expandedEvent) {
      setExpandedEvent(null);
    }
  }, [veryZoomedOut, expandedEvent]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  const toggleExpand = (eventId: string) => {
    if (veryZoomedOut) return; // Prevent expanding when very zoomed out
    setExpandedEvent(current => current === eventId ? null : eventId);
  };

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  const resetFilters = () => {
    setFilterOptions({
      styles: [],
      yearRange: yearRange,
      provinces: [],
      cities: []
    });
  };

  return (
    <div className="container mx-auto px-4">
      <TimelineHeader 
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />
      
      <div className="relative pt-16 pb-20">
        <TimelineContent
          filteredEvents={filteredEvents}
          expandedEvent={expandedEvent}
          toggleExpand={toggleExpand}
          zoomedOut={zoomedOut}
          veryZoomedOut={veryZoomedOut}
          resetFilters={resetFilters}
        />
        
        <TimelineZoomControls
          zoomLevel={zoomLevel}
          onZoomChange={handleZoomChange}
        />
      </div>
    </div>
  );
};

export default Timeline;
