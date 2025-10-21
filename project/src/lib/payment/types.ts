export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface PaymentFormData {
  amount: number;
  serviceId: string;
  frequency?: string;
  squareFootage?: number;
  date?: string;
}