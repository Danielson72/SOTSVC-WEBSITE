import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { PaymentIntent } from '@/lib/payment/types';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentProviderProps {
  clientSecret: string;
  children: React.ReactNode;
}

export function PaymentProvider({ clientSecret, children }: PaymentProviderProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#e1a224',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}