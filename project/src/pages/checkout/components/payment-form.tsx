import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form';
import type { BookingDetails } from '../types';

interface PaymentFormProps {
  booking: BookingDetails;
}

export function PaymentForm({ booking }: PaymentFormProps) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Here you would integrate with your payment processor
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear booking details from session storage
      sessionStorage.removeItem('bookingDetails');
      
      // Navigate to success page
      navigate('/payment/success');
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Payment Details
        </h2>
        <div className="flex items-center text-green-600">
          <Lock className="h-4 w-4 mr-1" />
          <span className="text-sm">Secure Payment</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Card Number">
          <Input
            type="text"
            placeholder="1234 5678 9012 3456"
            required
            pattern="[\d\s]{13,19}"
            maxLength={19}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Expiry Date">
            <Input
              type="text"
              placeholder="MM/YY"
              required
              pattern="\d\d/\d\d"
              maxLength={5}
            />
          </FormField>

          <FormField label="CVV">
            <Input
              type="text"
              placeholder="123"
              required
              pattern="\d{3,4}"
              maxLength={4}
            />
          </FormField>
        </div>

        <FormField label="Name on Card">
          <Input
            type="text"
            placeholder="John Doe"
            required
          />
        </FormField>

        <Button
          type="submit"
          variant="gold"
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? (
            'Processing Payment...'
          ) : (
            `Pay $${(booking.quote * 0.2).toFixed(2)} Deposit`
          )}
        </Button>

        <p className="text-center text-sm text-gray-500">
          By clicking above, you agree to our{' '}
          <a href="/terms" className="text-primary-600 hover:text-primary-700">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="/privacy" className="text-primary-600 hover:text-primary-700">
            Privacy Policy
          </a>
        </p>
      </form>
    </motion.div>
  );
}