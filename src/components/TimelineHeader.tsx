
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Filters from "./Filters";
import { FilterOptions } from "@/types";

interface TimelineHeaderProps {
  filterOptions: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
}

const TimelineHeader = ({ filterOptions, onFilterChange }: TimelineHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Filters filterOptions={filterOptions} onFilterChange={onFilterChange} />
      <div className="flex gap-2">
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="text-cuba-blue">
            <Settings size={16} className="mr-1" />
            Admin
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TimelineHeader;
