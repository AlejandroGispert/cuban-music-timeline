
import { CardContent } from "@/components/ui/card";
import VideoPreview from "./VideoPreview";

interface ExpandedEventContentProps {
  description: string;
  youtubeId: string | null;
  title: string;
  onVideoClick: (e: React.MouseEvent) => void;
  isExpanded: boolean;
}

const ExpandedEventContent = ({ 
  description, 
  youtubeId, 
  title, 
  onVideoClick, 
  isExpanded 
}: ExpandedEventContentProps) => {
  if (!isExpanded) return null;
  
  return (
    <CardContent className="pb-2 p-3">
      {youtubeId && (
        <VideoPreview 
          youtubeId={youtubeId} 
          title={title} 
          onVideoClick={onVideoClick} 
        />
      )}
      
      <p className="text-xs text-gray-700">
        {description}
      </p>
    </CardContent>
  );
};

export default ExpandedEventContent;
