import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Filters from "./Filters";
import { FilterOptions } from "@/types";
import { useEffect, useRef, useState } from "react";

interface TimelineHeaderProps {
  filterOptions: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  videoUrl?: string;
  clearVideo?: () => void;
}

const getEmbedUrl = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?enablejsapi=1` : url;
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    if (!videoUrl || !iframeRef.current) return;

    const loadPlayer = () => {
      if (window.YT && window.YT.Player) {
        const ytPlayer = new window.YT.Player(iframeRef.current!, {
          events: {
            onReady: (event: any) => setPlayer(event.target),
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = loadPlayer;
    }

    return () => {
      // Clean up player on unmount/change
      player?.destroy?.();
      setPlayer(null);
    };
  }, [videoUrl]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <Filters filterOptions={filterOptions} onFilterChange={onFilterChange} />
      </div>

      {videoUrl && (
        <div className="md:fixed md:top-[210px] md:right-4 w-full md:w-[320px] z-50">
          <div className="relative w-full aspect-video bg-white rounded-lg shadow-lg">
            <iframe
              ref={iframeRef}
              className="w-full h-full rounded-lg"
              src={getEmbedUrl(videoUrl)}
              title="YouTube video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex justify-between items-center mt-1 bg-white/95 backdrop-blur-sm p-2 rounded-lg">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (player && player.pauseVideo) {
                  player.pauseVideo();
                }
                window.open(getOriginalUrl(videoUrl), "_blank");
              }}
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
    </>
  );
};

export default TimelineHeader;
