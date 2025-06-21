export interface HiddenSpot {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  vibe: 'Romantic' | 'Serene' | 'Creative' | 'Artistic';
  images: string[];
  stories: string[];
  ratings: {
    uniqueness: number;
    vibe: number;
    safety: number;
    crowdLevel: number;
  };
  averageRating: number;
  reviews: Review[];
  crowdLevel: 'Low' | 'Medium' | 'High';
  safetyLevel: 'High' | 'Medium' | 'Low';
  discoveredBy: string;
  discoveredDate: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  photos?: string[];
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}