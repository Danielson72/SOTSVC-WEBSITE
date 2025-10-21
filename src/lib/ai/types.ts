export interface ServiceInfo {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  priceUnit: 'flat' | 'per_sqft';
  minSquareFootage?: number;
  maxSquareFootage?: number;
  availableFrequencies?: ('one-time' | 'weekly' | 'bi-weekly' | 'monthly')[];
}

export interface PricingTier {
  minSqft: number;
  maxSqft: number;
  price: number;
  frequency?: string;
}

export interface BusinessHours {
  dayOfWeek: number;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface AIAgentConfig {
  role: 'customer_service' | 'advertising' | 'lead_generation';
  name: string;
  tone: 'professional' | 'friendly' | 'persuasive';
  capabilities: string[];
}