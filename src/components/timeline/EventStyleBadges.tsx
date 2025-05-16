import { Badge } from "@/components/ui/badge";
interface EventStyleBadgesProps {
  styles?: string[] | string;
}

const EventStyleBadges = ({ styles }: EventStyleBadgesProps) => {
  const parsedStyles = typeof styles === "string" ? JSON.parse(styles) : (styles ?? []);

  if (!Array.isArray(parsedStyles) || parsedStyles.length === 0) return null;

  return (
    <>
      {parsedStyles.slice(0, 2).map(style => (
        <Badge
          key={style}
          variant="outline"
          className="bg-cuba-blue/10 text-cuba-blue border-cuba-blue/20 text-xs py-0"
        >
          {style}
        </Badge>
      ))}
      {parsedStyles.length > 2 && (
        <Badge
          variant="outline"
          className="bg-cuba-blue/10 text-cuba-blue border-cuba-blue/20 text-xs py-0"
        >
          +{parsedStyles.length - 2}
        </Badge>
      )}
    </>
  );
};

export default EventStyleBadges;
