import { Badge } from "@/components/ui/badge";

interface EventStyleBadgesProps {
  styles?: string[]; // Made optional to prevent crash if undefined
}

const EventStyleBadges = ({ styles }: EventStyleBadgesProps) => {
  if (!Array.isArray(styles) || styles.length === 0) return null;

  return (
    <>
      {styles.slice(0, 2).map(style => (
        <Badge
          key={style}
          variant="outline"
          className="bg-cuba-blue/10 text-cuba-blue border-cuba-blue/20 text-xs py-0"
        >
          {style}
        </Badge>
      ))}
      {styles.length > 2 && (
        <Badge
          variant="outline"
          className="bg-cuba-blue/10 text-cuba-blue border-cuba-blue/20 text-xs py-0"
        >
          +{styles.length - 2}
        </Badge>
      )}
    </>
  );
};

export default EventStyleBadges;
