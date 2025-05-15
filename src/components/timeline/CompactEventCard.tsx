
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface CompactEventCardProps {
  title: string;
}

const CompactEventCard = ({ title }: CompactEventCardProps) => {
  return (
    <CardHeader className="py-1 px-2">
      <CardTitle className="text-xs font-medium truncate">{title}</CardTitle>
    </CardHeader>
  );
};

export default CompactEventCard;
