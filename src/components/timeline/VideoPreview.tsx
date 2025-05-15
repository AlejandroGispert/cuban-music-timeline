
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
      className="video-preview-container mb-2"
      onClick={onVideoClick}
    >
      <iframe
        ref={videoRef}
        width="100%"
        height="100"
        src={`https://www.youtube.com/embed/${youtubeId}?mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${youtubeId}`}
        title={`${title} video preview`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-md"
      ></iframe>
      <div className="video-preview-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </div>
    </div>
  );
};

export default VideoPreview;
