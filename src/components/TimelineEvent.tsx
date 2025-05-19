import { useRef } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TimelineEvent as TimelineEventType } from "@/types";
import MinimalEventDot from "./timeline/MinimalEventdot";
import CompactEventCard from "./timeline/CompactEventCard";
import DetailedEventHeader from "./timeline/DetailedEventHeader";
import ExpandedEventContent from "./timeline/ExpandedEventContent";
import EventStyleBadges from "./timeline/EventStyleBadges";

interface TimelineEventProps {
  event: TimelineEventType;
  index: number;
  isLeft: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  zoomedOut?: boolean;
  veryZoomedOut?: boolean;
  superZoomedIn?: boolean;
  onSelectVideo?: (url: string) => void;
}

const TimelineEvent = ({
  event,
  index,
  isLeft,
  isExpanded,
  onToggleExpand,
  zoomedOut = false,
  veryZoomedOut = false,
  superZoomedIn = false,
  onSelectVideo,
}: TimelineEventProps) => {
  const dragStartX = useRef<number | null>(null);
  const dragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || dragStartX.current === null) return;

    const dx = e.clientX - dragStartX.current;
    const container = e.currentTarget.closest(".scroll-container") as HTMLElement | null;
    if (container) {
      container.scrollLeft -= dx;
    }

    dragStartX.current = e.clientX;
  };

  const handleMouseUp = () => {
    dragging.current = false;
    dragStartX.current = null;
  };

  // Helper function to extract YouTube ID
  const getYoutubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYoutubeId(event.videoUrl);
  const stylesArray = Array.isArray(event.style)
    ? event.style
    : typeof event.style === "string"
      ? [event.style]
      : [];
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.videoUrl) {
      if (onSelectVideo) {
        onSelectVideo(event.videoUrl); // <-- centralized handling
      } else {
        window.open(event.videoUrl, "_blank");
      }
    }
  };

  if (veryZoomedOut) {
    return <MinimalEventDot isLeft={isLeft} onToggleExpand={onToggleExpand} title={event.title} />;
  }
  if (superZoomedIn) {
    return (
      <Card className="timeline-card super-zoomed shadow-lg scale-[1.05]">
        <DetailedEventHeader
          title={event.title}
          date={event.date}
          style={stylesArray}
          city={event.city}
          province={event.province}
        />
        <ExpandedEventContent
          description={event.description}
          youtubeId={youtubeId}
          title={event.title}
          onVideoClick={handleVideoClick}
          isExpanded={true}
        />
      </Card>
    );
  }

  return (
    <Card
      className={`timeline-card ${isExpanded ? "expanded" : "collapsed"} ${
        isLeft ? "timeline-card-above" : "timeline-card-below"
      } ${zoomedOut ? "zoomed-out" : ""} transition-all duration-300 ease-in-out cursor-pointer w-full`}
      onClick={zoomedOut ? undefined : onToggleExpand}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {zoomedOut ? (
        <CompactEventCard title={event.title} />
      ) : (
        <>
          <DetailedEventHeader
            title={event.title}
            date={event.date}
            style={stylesArray}
            city={event.city}
            province={event.province}
          />

          <ExpandedEventContent
            description={event.description}
            youtubeId={youtubeId}
            title={event.title}
            onVideoClick={handleVideoClick}
            isExpanded={isExpanded}
          />

          <CardFooter className="pt-0 flex flex-wrap gap-1 p-3">
            <EventStyleBadges styles={event.style} />

            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-cuba-blue hover:text-cuba-blue hover:bg-cuba-blue/10 p-1 h-6"
              onClick={e => {
                e.stopPropagation();
                onToggleExpand();
              }}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default TimelineEvent;
