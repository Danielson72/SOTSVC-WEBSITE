export type ServiceType = 'deep-cleaning' | 'residential' | 'commercial' | 'move-in-out';
export type Frequency = 'one-time' | 'weekly' | 'bi-weekly' | 'monthly';

interface PricingConfig {
  basePrice: number;
  pricePerSqft: number;
  minSqft: number;
  maxSqft?: number;
  frequencyDiscounts: Record<Frequency, number>;
}

const pricingConfigs: Record<ServiceType, PricingConfig> = {
  'deep-cleaning': {
    basePrice: 150,
    pricePerSqft: 0.20,
    minSqft: 500,
    frequencyDiscounts: {
      'one-time': 0,
      'weekly': 0.20,
      'bi-weekly': 0.15,
      'monthly': 0.10
    }
  },
  'residential': {
    basePrice: 100,
    pricePerSqft: 0.15,
    minSqft: 500,
    frequencyDiscounts: {
      'one-time': 0,
      'weekly': 0.20,
      'bi-weekly': 0.15,
      'monthly': 0.10
    }
  },
  'commercial': {
    basePrice: 200,
    pricePerSqft: 0.12,
    minSqft: 1000,
    frequencyDiscounts: {
      'one-time': 0,
      'weekly': 0.25,
      'bi-weekly': 0.20,
      'monthly': 0.15
    }
  },
  'move-in-out': {
    basePrice: 200,
    pricePerSqft: 0.25,
    minSqft: 500,
    frequencyDiscounts: {
      'one-time': 0,
      'weekly': 0,
      'bi-weekly': 0,
      'monthly': 0
    }
  }
};

export function calculatePrice(
  serviceType: ServiceType,
  squareFootage: number,
  frequency: Frequency,
  extras: string[] = []
): number {
  const config = pricingConfigs[serviceType];
  
  // Validate minimum square footage
  if (squareFootage < config.minSqft) {
    squareFootage = config.minSqft;
  }
  
  // Calculate base price
  let total = config.basePrice + (squareFootage * config.pricePerSqft);
  
  // Apply frequency discount
  const discount = config.frequencyDiscounts[frequency];
  total = total * (1 - discount);
  
  // Add extras
  extras.forEach(extra => {
    switch (extra) {
      case 'windows':
        total += 50;
        break;
      case 'fridge':
        total += 30;
        break;
      case 'oven':
        total += 25;
        break;
      case 'cabinets':
        total += 40;
        break;
    }
  });
  
  return Math.round(total);
}