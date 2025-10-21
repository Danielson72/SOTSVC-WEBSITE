import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export function VerificationMessage({ email }: { email: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-primary-50 rounded-full">
          <Mail className="h-8 w-8 text-primary-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Check Your Email
      </h2>
      
      <p className="text-gray-600 mb-2">
        We've sent a verification link to:
      </p>
      <p className="text-primary-600 font-medium mb-4">
        {email}
      </p>
      
      <p className="text-sm text-gray-500">
        Please click the link in the email to verify your account. 
        If you don't see it, check your spam folder.
      </p>
    </motion.div>
  );
}