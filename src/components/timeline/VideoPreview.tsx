import { useRef } from "react";

interface VideoPreviewProps {
  youtubeId: string | null;
  title: string;
  onVideoClick: (e: React.MouseEvent) => void;
}

const VideoPreview = ({ youtubeId, title, onVideoClick }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLIFrameElement>(null);

  if (!youtubeId) return null;

  return (
    <div
      className="relative w-full h-[180px] rounded-md overflow-hidden shadow-md cursor-pointer group"
      onClick={onVideoClick}
    >
      <iframe
        ref={videoRef}
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${youtubeId}?mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${youtubeId}`}
        title={`${title} video preview`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>

      {/* Overlay with play icon */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="white"
          stroke="none"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>
    </div>
  );
};

export default VideoPreview;
