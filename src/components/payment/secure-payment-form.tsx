import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validatePaymentAmount, generateIdempotencyKey } from '@/lib/payment/security';
import { validateCard, validateExpiryDate, validateCVV } from '@/lib/payment/validation';

interface SecurePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function SecurePaymentForm({ amount, onSuccess, onError }: SecurePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentTimeout, setPaymentTimeout] = useState<NodeJS.Timeout>();

  // Set up payment timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isProcessing) {
        setIsProcessing(false);
        onError('Payment timeout. Please try again.');
      }
    }, 300000); // 5 minutes

    setPaymentTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [isProcessing]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validate payment amount
    if (!validatePaymentAmount(amount)) {
      onError('Invalid payment amount');
      return;
    }

    setIsProcessing(true);

    try {
      const idempotencyKey = generateIdempotencyKey();

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
          payment_method_data: {
            metadata: {
              idempotencyKey,
            },
          },
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
      if (paymentTimeout) clearTimeout(paymentTimeout);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Security Badges */}
        <div className="flex items-center justify-center space-x-4 mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-green-600">
            <Shield className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
          <div className="flex items-center text-green-600">
            <Lock className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Encrypted</span>
          </div>
        </div>

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

      {/* Security Information */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          🔒 Your payment is secure and encrypted
        </p>
        <p className="text-xs text-gray-400">
          We use industry-standard SSL encryption to protect your data
        </p>
      </div>
    </form>
  );
}