import { ServiceInfo } from '../types';
import { services } from '../service-data';
import { calculatePrice } from '../pricing';
import { isBusinessOpen, getNextAvailableSlot } from '../availability';

export function generateServiceResponse(serviceType: string): string {
  const service = services.find(s => s.id === serviceType);
  if (!service) return 'I apologize, but I couldn\'t find information about that service.';

  return `
${service.name}: ${service.description}

Starting Price: $${service.basePrice}${service.priceUnit === 'per_sqft' ? ' per sq. ft.' : ''}
Minimum Space: ${service.minSquareFootage} sq. ft.
${service.availableFrequencies ? `Available Frequencies: ${service.availableFrequencies.join(', ')}` : ''}

Would you like to get a specific quote for your space?`;
}

export function generateQuote(
  service: ServiceInfo,
  squareFootage: number,
  frequency?: string
): string {
  const price = calculatePrice(service, squareFootage, frequency);
  
  return `
Based on your requirements:
- Service: ${service.name}
- Space: ${squareFootage} sq. ft.
${frequency ? `- Frequency: ${frequency}` : ''}

Estimated Price: $${price}

Would you like to schedule this service or do you have any questions?`;
}

export function generateAvailabilityResponse(): string {
  const now = new Date();
  const isOpen = isBusinessOpen(now);
  
  if (isOpen) {
    return "We're currently open and available for bookings! Would you like to schedule a service?";
  }
  
  const nextSlot = getNextAvailableSlot(now);
  return `We're currently closed, but our next available slot is ${nextSlot.toLocaleString()}. Would you like to schedule for then?`;
}