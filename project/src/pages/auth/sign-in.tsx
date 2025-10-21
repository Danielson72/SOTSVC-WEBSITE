import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormError } from '@/components/ui/form';
import { signIn } from '@/lib/auth';

export default function SignInPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Welcome Back
          </h1>

          {error && <FormError message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email">
              <Input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
              />
            </FormField>

            <FormField label="Password">
              <Input
                type="password"
                name="password"
                required
                placeholder="••••••••"
              />
            </FormField>

            <Button
              type="submit"
              variant="gold"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/sign-up" className="text-primary-600 hover:text-primary-700">
                  Sign up
                </Link>
              </p>
              <Link 
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 block"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}