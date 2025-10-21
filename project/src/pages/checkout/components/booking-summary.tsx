import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import type { BookingDetails } from '../types';

interface BookingSummaryProps {
  booking: BookingDetails;
}

export function BookingSummary({ booking }: BookingSummaryProps) {
  const date = new Date(booking.selectedDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Booking Summary
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2 text-primary-600" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-2 text-primary-600" />
          <span>{booking.selectedTime}</span>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">Service Details</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Service Type: {booking.serviceType.replace(/-/g, ' ')}</li>
            <li>Square Footage: {booking.squareFootage} sq ft</li>
            <li>Frequency: {booking.frequency}</li>
            {booking.selectedExtras.length > 0 && (
              <li>
                Additional Services:
                <ul className="ml-4 mt-1">
                  {booking.selectedExtras.map(extra => (
                    <li key={extra} className="text-sm">
                      • {extra.replace(/-/g, ' ')}
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}