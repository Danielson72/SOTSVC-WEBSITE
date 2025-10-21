import { pricingTiers } from './service-data';
import type { ServiceInfo } from './types';

export function calculatePrice(
  service: ServiceInfo,
  squareFootage: number,
  frequency?: string
): number {
  // Get pricing tiers for the service
  const tiers = pricingTiers[service.id];
  
  if (service.priceUnit === 'per_sqft') {
    return Math.round(squareFootage * service.basePrice);
  }

  // Find the appropriate tier based on square footage
  const tier = tiers?.find(
    t => squareFootage >= t.minSqft && squareFootage <= t.maxSqft && 
    (!frequency || t.frequency === frequency)
  );

  if (!tier) {
    return service.basePrice;
  }

  return tier.price;
}

export function getFrequencyDiscount(frequency: string): number {
  switch (frequency) {
    case 'weekly':
      return 0.15; // 15% discount
    case 'bi-weekly':
      return 0.10; // 10% discount
    case 'monthly':
      return 0.05; // 5% discount
    default:
      return 0;
  }
}