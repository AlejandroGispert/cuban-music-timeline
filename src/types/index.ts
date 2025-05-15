
export interface TimelineEvent {
    id: string;
    title: string;
    date: string;
    year: number;
    location: {
      city: string;
      province: string;
    };
    style: string[];
    description: string;
    videoUrl?: string;
    thumbnailUrl?: string;
  }
  
  export interface FilterOptions {
    styles: string[];
    yearRange: [number, number];
    provinces: string[];
    cities: string[];
  }
  