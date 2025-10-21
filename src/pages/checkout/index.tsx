import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderSummary } from './components/order-summary';
import { PaymentForm } from './components/payment-form';
import { BookingSummary } from './components/booking-summary';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { BookingDetails } from './types';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    const storedDetails = sessionStorage.getItem('bookingDetails');
    if (!storedDetails) {
      navigate('/pricing');
      return;
    }
    setBookingDetails(JSON.parse(storedDetails));
  }, [navigate]);

  if (!bookingDetails) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
            onClick={() => navigate('/pricing')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pricing
          </Button>
        </div>

        <div className="space-y-8">
          <BookingSummary booking={bookingDetails} />
          <OrderSummary booking={bookingDetails} />
          <PaymentForm booking={bookingDetails} />
        </div>
      </div>
    </div>
  );
}