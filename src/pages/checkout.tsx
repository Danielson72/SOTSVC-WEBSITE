import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentProvider } from '@/components/payment/payment-provider';
import { SecurePaymentForm } from '@/components/payment/secure-payment-form';
import { calculatePrice } from '@/lib/ai/pricing';
import { services } from '@/lib/ai/service-data';
import { validatePaymentIntent } from '@/lib/payment/security';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 3;

  // Reset attempts after 24 hours
  useEffect(() => {
    const resetTime = localStorage.getItem('paymentAttemptsResetTime');
    if (resetTime && Date.now() - parseInt(resetTime) >= 86400000) {
      setAttempts(0);
      localStorage.removeItem('paymentAttemptsResetTime');
    }
  }, []);

  // Mock booking data - in real app, this would come from your booking flow
  const mockBooking = {
    serviceId: 'deep-cleaning',
    squareFootage: 1500,
    frequency: 'one-time',
  };

  const service = services.find(s => s.id === mockBooking.serviceId);
  const amount = service 
    ? calculatePrice(service, mockBooking.squareFootage, mockBooking.frequency)
    : 0;

  const handleSuccess = () => {
    setAttempts(0);
    navigate('/payment/success');
  };

  const handleError = (message: string) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (newAttempts >= MAX_ATTEMPTS) {
      localStorage.setItem('paymentAttemptsResetTime', Date.now().toString());
      setError('Too many failed attempts. Please try again in 24 hours.');
      return;
    }
    
    setError(message);
  };

  // In a real app, you would fetch this from your backend
  const mockClientSecret = 'mock_secret';

  // Validate payment intent
  const mockIntent = {
    clientSecret: mockClientSecret,
    amount,
    currency: 'usd',
  };

  if (!validatePaymentIntent(mockIntent)) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-red-50 p-4 rounded-lg text-red-600">
            Invalid payment configuration. Please contact support.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {attempts < MAX_ATTEMPTS && (
          <PaymentProvider clientSecret={mockClientSecret}>
            <SecurePaymentForm
              amount={amount}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </PaymentProvider>
        )}
      </div>
    </div>
  );
}