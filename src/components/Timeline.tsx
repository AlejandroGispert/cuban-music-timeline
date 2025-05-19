import { useState, useEffect, useMemo } from "react";
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
    yearRange: yearRange,
    provinces: [],
    cities: [],
  });

  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(50);

  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | undefined>(undefined);
  const zoomedOut = zoomLevel < 30;
  const veryZoomedOut = zoomLevel < 10;
  const superZoomedIn = zoomLevel > 90;

  // Load events only once
  useEffect(() => {
    loadEvents();
  }, []);

  // Memoized filtered & sorted events
  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    const sortedEvents = events
      .filter(event => {
        const eventStyles = Array.isArray(event.style)
          ? event.style
          : typeof event.style === "string"
            ? JSON.parse(event.style)
            : [];

        if (
          filterOptions.styles.length > 0 &&
          !filterOptions.styles.some(style => eventStyles.includes(style))
        )
          return false;
        if (event.year < filterOptions.yearRange[0] || event.year > filterOptions.yearRange[1])
          return false;
        if (filterOptions.provinces.length > 0 && !filterOptions.provinces.includes(event.province))
          return false;
        if (filterOptions.cities.length > 0 && !filterOptions.cities.includes(event.city))
          return false;

        return true;
      })
      .sort((a, b) => a.year - b.year);

    // Group events by decades for veryZoomedOut view
    if (veryZoomedOut) {
      const groupedEvents = sortedEvents.reduce(
        (groups, event) => {
          const decade = Math.floor(event.year / 10) * 10;
          if (!groups[decade]) {
            groups[decade] = [];
          }
          groups[decade].push(event);
          return groups;
        },
        {} as Record<number, typeof sortedEvents>
      );

      return Object.entries(groupedEvents).map(([decade, events]) => ({
        decade: parseInt(decade),
        events,
      }));
    }

    return sortedEvents;
  }, [events, filterOptions, veryZoomedOut]);

  // Collapse expanded card if very zoomed out
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
    setExpandedEvent(prev => (prev === eventId ? null : eventId));
  };

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  const resetFilters = () => {
    setFilterOptions({
      styles: [],
      yearRange: yearRange,
      provinces: [],
      cities: [],
    });
  };

  return (
    <div className="container mx-auto px-0 md:px-4">
      <TimelineHeader
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        videoUrl={selectedVideoUrl}
        clearVideo={() => setSelectedVideoUrl(undefined)}
      />

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
            setSelectedVideoUrl={setSelectedVideoUrl}
            superZoomedIn={superZoomedIn}
          />
        )}

        <TimelineZoomControls zoomLevel={zoomLevel} onZoomChange={handleZoomChange} />
      </div>
    </div>
  );
};

export default Timeline;
