import { counties } from './service-areas';

export function isLocationServed(city: string): boolean {
  return counties.some(county => 
    county.majorCities.some(c => 
      c.toLowerCase() === city.toLowerCase()
    )
  );
}

export function getCountyByCity(city: string): string | null {
  const county = counties.find(county =>
    county.majorCities.some(c => 
      c.toLowerCase() === city.toLowerCase()
    )
  );
  return county?.name ?? null;
}

export function getNearestCity(latitude: number, longitude: number): string {
  // This would integrate with a geocoding service
  // For now, return a default city
  return 'Orlando';
}