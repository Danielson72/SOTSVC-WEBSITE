import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import type { PaymentFormData } from '@/lib/payment/types';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        onError(error.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      onError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Payment Details
          </h3>
          <p className="text-gray-600">
            Amount to pay: ${amount.toFixed(2)}
          </p>
        </div>

        <PaymentElement />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <Button
            type="submit"
            variant="gold"
            className="w-full"
            disabled={isProcessing || !stripe}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </motion.div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Your payment is secure and encrypted</p>
      </div>
    </form>
  );
}