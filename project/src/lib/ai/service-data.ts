import { ServiceInfo, PricingTier, BusinessHours } from './types';

export const services: ServiceInfo[] = [
  {
    id: 'deep-cleaning',
    name: 'Deep Cleaning',
    description: 'A thorough cleaning of every nook and cranny, including baseboards, light fixtures, and hard-to-reach areas.',
    basePrice: 150,
    priceUnit: 'flat',
    minSquareFootage: 500,
    availableFrequencies: ['one-time'],
  },
  {
    id: 'residential',
    name: 'Residential Cleaning',
    description: 'Regular or one-time cleaning of homes, including kitchens, bathrooms, living spaces, and bedrooms.',
    basePrice: 100,
    priceUnit: 'flat',
    minSquareFootage: 500,
    availableFrequencies: ['one-time', 'weekly', 'bi-weekly', 'monthly'],
  },
  {
    id: 'commercial',
    name: 'Commercial Cleaning',
    description: 'Professional cleaning services for offices, retail spaces, and other commercial properties.',
    basePrice: 0.15,
    priceUnit: 'per_sqft',
    minSquareFootage: 1000,
  },
  {
    id: 'move-in-out',
    name: 'Move-In/Move-Out Cleaning',
    description: 'Detailed cleaning of empty properties, preparing them for new tenants or homeowners.',
    basePrice: 200,
    priceUnit: 'flat',
    minSquareFootage: 500,
  },
];

export const pricingTiers: Record<string, PricingTier[]> = {
  'deep-cleaning': [
    { minSqft: 0, maxSqft: 1000, price: 150 },
    { minSqft: 1001, maxSqft: 2000, price: 200 },
    { minSqft: 2001, maxSqft: 3000, price: 300 },
  ],
  'residential': [
    { minSqft: 0, maxSqft: 1500, price: 100, frequency: 'weekly' },
    { minSqft: 0, maxSqft: 1500, price: 150, frequency: 'bi-weekly' },
    { minSqft: 0, maxSqft: 1500, price: 200, frequency: 'monthly' },
  ],
};

export const businessHours: BusinessHours[] = [
  { dayOfWeek: 0, open: '07:00', close: '22:00', isOpen: true },  // Sunday
  { dayOfWeek: 1, open: '07:00', close: '22:00', isOpen: true },  // Monday
  { dayOfWeek: 2, open: '07:00', close: '22:00', isOpen: true },  // Tuesday
  { dayOfWeek: 3, open: '07:00', close: '22:00', isOpen: true },  // Wednesday
  { dayOfWeek: 4, open: '07:00', close: '22:00', isOpen: true },  // Thursday
  { dayOfWeek: 5, open: '07:00', close: '22:00', isOpen: true },  // Friday
  { dayOfWeek: 6, open: '00:00', close: '00:00', isOpen: false }, // Saturday
];