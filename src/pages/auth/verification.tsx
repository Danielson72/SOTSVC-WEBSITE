import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerificationPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate('/sign-up');
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-sm text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary-50 rounded-full">
              <Mail className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Verify Your Email
          </h1>
          
          <p className="text-gray-600 mb-2">
            We've sent a verification link to:
          </p>
          <p className="text-primary-600 font-medium mb-6">
            {email}
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Please click the link in the email to verify your account.
            If you don't see it, check your spam folder.
          </p>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/sign-in')}
          >
            Back to Sign In
          </Button>
        </motion.div>
      </div>
    </div>
  );
}