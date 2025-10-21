import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError, FormField } from '@/components/ui/form';
import { signIn } from '@/lib/auth';
import type { SignInData } from '@/lib/types/auth';

export function SignInForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data: SignInData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    
    try {
      await signIn(data);
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
      
      <FormField label="Email">
        <Input
          type="email"
          id="email"
          name="email"
          required
        />
      </FormField>

      <FormField label="Password">
        <Input
          type="password"
          id="password"
          name="password"
          required
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}