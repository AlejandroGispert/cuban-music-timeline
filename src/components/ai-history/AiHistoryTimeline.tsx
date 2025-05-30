import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Music, MapPin, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { TimelineEvent } from "@/types";
import { getYoutubeId } from "@/utils/youtube";
import { Link } from "react-router-dom";

interface AIHistoryTimelineProps {
  events: TimelineEvent[];
}

const AIHistoryTimeline = ({ events }: AIHistoryTimelineProps) => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  // Function to get the evolutionary stage number (1-8)
  const getStageNumber = (index: number, total: number): number => {
    return Math.round((index / (total - 1)) * 7) + 1;
  };

  return (
    <div className="py-8">
      <div className="flex justify-end mb-4">
        <Link to="/">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-cuba-blue text-cuba-blue hover:bg-cuba-blue/10 hover:text-cuba-blue"
          >
            <ArrowLeft size={16} />
            Back to Timeline
          </Button>
        </Link>
      </div>
      <div className="relative">
        {/* Main timeline track */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-2 bg-gradient-to-b from-cuba-red via-cuba-gold to-cuba-blue rounded-full"></div>

        {/* Events */}
        <div className="space-y-24 relative">
          {events.map((event, index) => {
            const isLeft = index % 2 === 0;
            const isExpanded = expandedEvent === event.id.toString();
            const stageNumber = getStageNumber(index, events.length);

            return (
              <div key={event.id} className="relative">
                {/* Stage number indicator */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border-4 border-cuba-blue flex items-center justify-center z-10 shadow-lg">
                  <span className="font-bold text-cuba-blue">{stageNumber}</span>
                </div>

                {/* Content card */}
                <Card
                  className={`w-5/6 sm:w-5/12 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                    isLeft ? "ml-auto mr-[calc(50%+2rem)]" : "mr-auto ml-[calc(50%+2rem)]"
                  } ${isExpanded ? "bg-white shadow-xl" : "bg-white/95"}`}
                  onClick={() => toggleExpand(event.id.toString())}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-semibold text-cuba-red bg-cuba-red/10 px-2 py-1 rounded-full">
                          {event.year}
                        </span>
                        <CardTitle
                          className={`mt-2 text-lg ${isExpanded ? "text-cuba-navy" : "text-gray-800"}`}
                        >
                          {event.title}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-cuba-blue hover:text-cuba-blue hover:bg-cuba-blue/10 p-1 h-6"
                        onClick={e => {
                          e.stopPropagation();
                          toggleExpand(event.id.toString());
                        }}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </Button>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={12} />
                      <span>
                        {event.location?.city || "Unknown"}, {event.location?.province || "Unknown"}
                      </span>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-2">
                      <p className="text-sm text-gray-700">{event.description}</p>

                      {event.videoUrl && (
                        <div className="mt-4 rounded-md overflow-hidden bg-gray-100 relative">
                          <div className="aspect-video">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${getYoutubeId(event.videoUrl)}`}
                              title={event.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}

                  <CardFooter className="pt-0 flex flex-wrap gap-1 p-3">
                    <div className="flex gap-1 flex-wrap">
                      {event.style.map(style => (
                        <Badge
                          key={style}
                          variant="outline"
                          className="bg-cuba-blue/10 text-cuba-blue border-cuba-blue/20 text-xs py-0"
                        >
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>

                {/* Timeline connector */}
                <div
                  className={`absolute top-0 h-1 bg-cuba-blue ${
                    isLeft ? "right-1/2 w-[calc(8.33%+1rem)]" : "left-1/2 w-[calc(8.33%+1rem)]"
                  }`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIHistoryTimeline;
