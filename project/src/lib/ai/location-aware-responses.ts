import { isLocationServed, getCountyByCity } from '@/lib/locations/availability';
import { counties } from '@/lib/locations/service-areas';
import type { ServiceInfo } from './types';

export function generateLocationResponse(city: string): string {
  if (!isLocationServed(city)) {
    const nearestCounty = counties[0]; // This should be replaced with actual nearest location logic
    return `While we don't currently serve ${city}, we do offer our services in nearby ${nearestCounty.name}, including ${nearestCounty.majorCities.join(', ')}. Would you like to learn more about our services in these areas?`;
  }

  const county = getCountyByCity(city);
  return `Yes! We proudly serve ${city} and all of ${county}. Would you like to schedule a cleaning service or get a quote?`;
}

export function generateLocationAwarePromo(
  service: ServiceInfo,
  city: string
): string {
  const county = getCountyByCity(city);
  return `Looking for professional ${service.name} in ${city}? Sonz of Thunder SVC proudly serves all of ${county}! Book now and get 10% off your first service. #CentralFlorida #CleaningServices`;
}