import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormError } from '@/components/ui/form';
import { signUp } from '@/lib/auth';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    try {
      await signUp({
        email,
        password: Math.random().toString(36).slice(-8), // Generate random password
        fullName: formData.get('fullName') as string,
        phone: formData.get('phone') as string,
      });
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-sm"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Get a Free Estimate
          </h1>
          <p className="text-gray-600 mb-6">
            Fill out the form below and we'll contact you with a personalized quote.
          </p>

          {error && <FormError message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Full Name">
              <Input
                type="text"
                name="fullName"
                required
                placeholder="John Doe"
              />
            </FormField>

            <FormField label="Phone Number">
              <Input
                type="tel"
                name="phone"
                required
                placeholder="(123) 456-7890"
                pattern="[\d\s()-]+"
                title="Please enter a valid phone number"
              />
            </FormField>

            <FormField label="Email">
              <Input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
              />
            </FormField>

            <Button
              type="submit"
              variant="gold"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Get Your Free Quote'}
            </Button>

            <p className="text-center text-sm text-gray-500">
              By submitting this form, you agree to our{' '}
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
      </div>
    </div>
  );
}