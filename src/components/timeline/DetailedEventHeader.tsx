import { CardHeader, CardTitle } from "@/components/ui/card";

interface DetailedEventHeaderProps {
  title: string;
  date: string;
  style: string[];
  city: string;
  province: string;
}
//working fine
const DetailedEventHeader = ({ title, date, style, city, province }: DetailedEventHeaderProps) => {
  return (
    <CardHeader className="p-3">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-cuba-red bg-cuba-red/10 px-2 py-1 rounded-full mt-1 inline-block w-fit">
          {date}
        </span>
        <CardTitle className="text-sm font-bold text-cuba-navy line-clamp-2">{title}</CardTitle>

        <div className="text-xs text-gray-500 mt-1">
          {city}, {province}
        </div>
      </div>
    </CardHeader>
  );
};

export default DetailedEventHeader;
