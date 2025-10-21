import { PaymentIntent } from './types';

// Constants for security settings
const PAYMENT_TIMEOUT_MS = 300000; // 5 minutes
const MAX_PAYMENT_ATTEMPTS = 3;
const MIN_PAYMENT_AMOUNT = 1; // $1
const MAX_PAYMENT_AMOUNT = 10000; // $10,000

// Validate payment amount is within acceptable range
export function validatePaymentAmount(amount: number): boolean {
  return amount >= MIN_PAYMENT_AMOUNT && amount <= MAX_PAYMENT_AMOUNT;
}

// Generate a unique idempotency key for payment requests
export function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Sanitize and validate payment data
export function sanitizePaymentData(data: Record<string, any>): Record<string, any> {
  return Object.entries(data).reduce((acc, [key, value]) => {
    // Remove any potential XSS or injection attempts
    if (typeof value === 'string') {
      value = value.replace(/[<>]/g, '');
    }
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>);
}

// Validate payment intent
export function validatePaymentIntent(intent: PaymentIntent): boolean {
  return !!(
    intent.clientSecret &&
    intent.amount &&
    intent.currency &&
    validatePaymentAmount(intent.amount)
  );
}