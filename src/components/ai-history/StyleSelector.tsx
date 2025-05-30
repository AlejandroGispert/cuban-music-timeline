import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface StyleSelectorProps {
  allStyles: string[];
  selectedStyles: string[];
  onChange: (styles: string[]) => void;
}

const StyleSelector = ({ allStyles, selectedStyles, onChange }: StyleSelectorProps) => {
  const [showAll, setShowAll] = useState(false);

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      onChange(selectedStyles.filter(s => s !== style));
    } else {
      onChange([...selectedStyles, style]);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const selectAll = () => {
    onChange([...allStyles]);
  };

  const clearAll = () => {
    onChange([]);
  };

  const displayedStyles = showAll ? allStyles : allStyles.slice(0, 5);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {displayedStyles.map(style => (
          <Badge
            key={style}
            variant={selectedStyles.includes(style) ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedStyles.includes(style)
                ? "bg-cuba-blue text-white"
                : "bg-transparent hover:bg-gray-100"
            }`}
            onClick={() => toggleStyle(style)}
          >
            {style}
            {selectedStyles.includes(style) && (
              <X
                className="ml-1 h-3 w-3"
                onClick={e => {
                  e.stopPropagation();
                  toggleStyle(style);
                }}
                role="button"
                aria-label={`Remove ${style} filter`}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleStyle(style);
                  }
                }}
              />
            )}
          </Badge>
        ))}

        {allStyles.length > 5 && (
          <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={toggleShowAll}>
            {showAll ? (
              <>
                <ChevronUp size={14} className="mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={14} className="mr-1" />
                Show More
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex gap-2 mt-2">
        <Button variant="outline" size="sm" className="text-xs py-0 h-6" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="outline" size="sm" className="text-xs py-0 h-6" onClick={clearAll}>
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default StyleSelector;
