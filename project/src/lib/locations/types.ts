export interface County {
  id: string;
  name: string;
  majorCities: string[];
  popularServices: string[];
}

export interface ServiceArea {
  county: County;
  isActive: boolean;
  coverage: number; // Percentage of county covered
}