import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function PaymentSuccess() {
  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-lg shadow-sm text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <CheckCircle className="h-16 w-16 text-green-500" />
          </motion.div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Thank you for your payment. Your cleaning service has been scheduled.
            You will receive a confirmation email shortly.
          </p>

          <div className="space-y-4">
            <Button variant="gold" className="w-full" asChild>
              <Link to="/dashboard">View Booking Details</Link>
            </Button>
            
            <Button variant="outline" className="w-full" asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}