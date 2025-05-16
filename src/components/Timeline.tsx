import { useState, useEffect, useMemo, useCallback } from "react";
import { TimelineEvent as TimelineEventType, FilterOptions } from "@/types";

import TimelineHeader from "./TimelineHeader";
import TimelineContent from "./TimelineContent";
import TimelineZoomControls from "./TimelineZoomControls";

import { useHistoricEvents } from "@/hooks/useHistoricEvents";
import { yearRange } from "@/constants/filters";

const Timeline = () => {
  const { events, loadEvents, isLoading, error } = useHistoricEvents();

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    styles: [],
    yearRange,
    provinces: [],
    cities: [],
  });

  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(50);

  const zoomedOut = zoomLevel < 30;
  const veryZoomedOut = zoomLevel < 10;

  // Load events once
  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    return events
      .filter(event => {
        if (
          filterOptions.styles.length > 0 &&
          !event.style.some(style => filterOptions.styles.includes(style))
        )
          return false;

        if (event.year < filterOptions.yearRange[0] || event.year > filterOptions.yearRange[1])
          return false;

        if (
          filterOptions.provinces.length > 0 &&
          !filterOptions.provinces.includes(event.location.province)
        )
          return false;

        if (filterOptions.cities.length > 0 && !filterOptions.cities.includes(event.location.city))
          return false;

        return true;
      })
      .sort((a, b) => a.year - b.year);
  }, [events, filterOptions]);

  // Collapse cards on zoom out
  useEffect(() => {
    if (veryZoomedOut && expandedEvent) {
      setExpandedEvent(null);
    }
  }, [veryZoomedOut, expandedEvent]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  const toggleExpand = (eventId: string) => {
    if (veryZoomedOut) return;
    setExpandedEvent(current => (current === eventId ? null : eventId));
  };

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  const resetFilters = useCallback(() => {
    setFilterOptions({
      styles: [],
      yearRange,
      provinces: [],
      cities: [],
    });
  }, []);

  return (
    <div className="container mx-auto px-4">
      <TimelineHeader filterOptions={filterOptions} onFilterChange={handleFilterChange} />

      <div className="relative pt-16 pb-20">
        {isLoading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <TimelineContent
            filteredEvents={filteredEvents}
            expandedEvent={expandedEvent}
            toggleExpand={toggleExpand}
            zoomedOut={zoomedOut}
            veryZoomedOut={veryZoomedOut}
            resetFilters={resetFilters}
            zoomLevel={zoomLevel}
          />
        )}

        <TimelineZoomControls zoomLevel={zoomLevel} onZoomChange={handleZoomChange} />
      </div>
    </div>
  );
};

export default Timeline;
