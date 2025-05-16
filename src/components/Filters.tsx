
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FilterOptions } from "@/types";
import { yearRange, allMusicStyles, allProvinces, allCities } from "@/constants/filters";


interface FiltersProps {
  filterOptions: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const Filters = ({ filterOptions, onFilterChange }: FiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filterOptions);
  
  const handleStyleChange = (style: string) => {
    const updatedStyles = localFilters.styles.includes(style)
      ? localFilters.styles.filter(s => s !== style)
      : [...localFilters.styles, style];
    
    const newFilters = { ...localFilters, styles: updatedStyles };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleProvinceChange = (province: string) => {
    const newFilters = {
      ...localFilters,
      provinces: province === "all" ? [] : [province],
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };



  const handleCityChange = (city: string) => {
    const newFilters = {
      ...localFilters,
      cities: city === "all" ? [] : [city],
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };
  

  const handleYearChange = (value: number[]) => {
    const newFilters = { ...localFilters, yearRange: [value[0], value[1]] as [number, number] };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      styles: [],
      yearRange: [...yearRange] as [number, number],
      provinces: [],
      cities: []
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white shadow rounded-lg mb-8">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close" : "Open"}
        </Button>
      </div>
      
      {isOpen && (
        <div className="p-4 border-t">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="music-style">
              <AccordionTrigger className="text-sm font-medium">Music Style</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2">
                  {allMusicStyles.map(style => (
                    <Button
                      key={style}
                      variant={localFilters.styles.includes(style) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleChange(style)}
                      className={`text-xs ${
                        localFilters.styles.includes(style) ? "bg-cuba-red" : ""
                      }`}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="year-range">
              <AccordionTrigger className="text-sm font-medium">Year Range</AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>{localFilters.yearRange[0]}</span>
                    <span>{localFilters.yearRange[1]}</span>
                  </div>
                  <Slider
                    defaultValue={[localFilters.yearRange[0], localFilters.yearRange[1]]}
                    min={yearRange[0]}
                    max={yearRange[1]}
                    step={1}
                    onValueChange={handleYearChange}
                    className="my-4"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="location">
              <AccordionTrigger className="text-sm font-medium">Location</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Province</label>
                    <Select 
                      value={localFilters.provinces[0] || "all"} 
                      onValueChange={handleProvinceChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Provinces" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Provinces</SelectItem>
                        {allProvinces.map(province => (
                          <SelectItem key={province} value={province}>{province}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">City</label>
                    <Select 
                      value={localFilters.cities[0] || "all"} 
                      onValueChange={handleCityChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Cities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {allCities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
