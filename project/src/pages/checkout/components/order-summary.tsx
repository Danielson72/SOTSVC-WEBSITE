import { motion } from 'framer-motion';
import type { BookingDetails } from '../types';

interface OrderSummaryProps {
  booking: BookingDetails;
}

export function OrderSummary({ booking }: OrderSummaryProps) {
  const depositAmount = booking.quote * 0.2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>Service Total</span>
          <span>${booking.quote.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Required Deposit (20%)</span>
          <span className="font-medium text-primary-600">
            ${depositAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Remaining Balance</span>
          <span>${(booking.quote - depositAmount).toFixed(2)}</span>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            * A 20% deposit is required to secure your booking. The remaining balance
            will be due upon service completion.
          </p>
        </div>
      </div>
    </motion.div>
  );
}