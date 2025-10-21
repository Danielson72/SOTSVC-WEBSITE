import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError, FormField } from '@/components/ui/form';
import { signUp } from '@/lib/auth';
import type { SignUpData } from '@/lib/types/auth';

export function SignUpForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data: SignUpData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
    };
    
    try {
      await signUp(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <FormError message={error} />}
      
      <FormField label="Full Name">
        <Input
          type="text"
          id="fullName"
          name="fullName"
          required
        />
      </FormField>

      <FormField label="Email">
        <Input
          type="email"
          id="email"
          name="email"
          required
        />
      </FormField>

      <FormField label="Phone Number">
        <Input
          type="tel"
          id="phone"
          name="phone"
          required
        />
      </FormField>

      <FormField label="Password">
        <Input
          type="password"
          id="password"
          name="password"
          required
          minLength={8}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}