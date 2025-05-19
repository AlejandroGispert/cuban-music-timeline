import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Filters from "./Filters";
import { FilterOptions } from "@/types";

interface TimelineHeaderProps {
  filterOptions: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  videoUrl?: string;
  clearVideo?: () => void;
}

const getEmbedUrl = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const TimelineHeader = ({
  filterOptions,
  onFilterChange,
  videoUrl,
  clearVideo,
}: TimelineHeaderProps) => {
  // The original URL (non-embed) for opening in new tab:
  const getOriginalUrl = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/watch?v=${match[1]}` : url;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      <Filters filterOptions={filterOptions} onFilterChange={onFilterChange} />

      {videoUrl && (
        <div className="w-full md:w-[320px]">
          <div className="relative w-full aspect-video">
            <iframe
              className="w-full h-full rounded-lg shadow-md"
              src={getEmbedUrl(videoUrl)}
              title="YouTube video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(getOriginalUrl(videoUrl), "_blank")}
              className="flex items-center gap-1"
            >
              Open in YouTube
              <ExternalLink className="w-4 h-4" />
            </Button>

            {clearVideo && (
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/80 hover:bg-white"
                onClick={clearVideo}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineHeader;
