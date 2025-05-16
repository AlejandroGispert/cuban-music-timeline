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
}

const TimelineEvent = ({ 
  event, 
  index, 
  isLeft, 
  isExpanded, 
  onToggleExpand, 
  zoomedOut = false,
  veryZoomedOut = false
}: TimelineEventProps) => {
  // Helper function to extract YouTube video ID
  const getYoutubeId = (url?: string) => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYoutubeId(event.videoUrl);
  
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (event.videoUrl) {
      window.open(event.videoUrl, '_blank');
    }
  };
  
  if (veryZoomedOut) {
    return <MinimalEventDot isLeft={isLeft} onToggleExpand={onToggleExpand} title={event.title} />;
  }
  
  return (
    <Card 
      className={`timeline-card ${isExpanded ? 'expanded' : 'collapsed'} ${isLeft ? 'timeline-card-above' : 'timeline-card-below'} ${zoomedOut ? 'zoomed-out' : ''} transition-all duration-300 ease-in-out cursor-pointer w-full`}
      onClick={zoomedOut ? undefined : onToggleExpand}
    >
      {zoomedOut ? (
        <CompactEventCard title={event.title} />
      ) : (
        <>
          <DetailedEventHeader 
            title={event.title} 
            date={event.date} 
            city={event.location.city} 
            province={event.location.province} 
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
              onClick={(e) => {
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
