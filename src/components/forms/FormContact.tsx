import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form';
import { supabase } from '@/lib/supabase';

interface FormContactProps {
  formType?: 'embedded' | 'popup' | 'standalone';
  className?: string;
}

export function FormContact({ formType = 'embedded', className = '' }: FormContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Match backend schema: contact_requests table
    const contactRequest = {
      full_name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || null,
      message: (formData.get('message') as string) || null,
      form_type: formType,
      source_site: typeof window !== 'undefined' ? window.location.hostname : 'sotsvc.com',
    };

    try {
      const { error } = await supabase
        .from('contact_requests')
        .insert([contactRequest]);

      if (error) throw error;

      // Clear any previous errors and show success
      setError(null);
      setIsSuccess(true);
      e.currentTarget.reset();

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error('Contact form submission error:', err);
      setError('Service temporarily unavailable. Please try again in 5 minutes.');
      setIsSuccess(false); // Ensure success is not showing
    } finally {
      setIsSubmitting(false);
    }
  }

  const isEmbedded = formType === 'embedded';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-8 rounded-lg shadow-sm ${className}`}
    >
      <h2 className={`font-bold text-gray-900 mb-6 ${isEmbedded ? 'text-xl' : 'text-2xl'}`}>
        {isEmbedded ? 'Get in Touch' : 'Send Us a Message'}
      </h2>

      {error && !isSuccess && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-green-50 text-green-600 rounded-md text-center"
        >
          <p className="font-semibold mb-2">Thank you for reaching out!</p>
          <p className="text-sm">We'll respond within 24 hours. Check your email for our confirmation.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Full Name">
            <Input
              type="text"
              name="name"
              required
              placeholder="John Doe"
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

          <FormField label="Phone Number (Optional)">
            <Input
              type="tel"
              name="phone"
              placeholder="(123) 456-7890"
            />
          </FormField>

          <FormField label="Message">
            <textarea
              name="message"
              required
              maxLength={500}
              rows={isEmbedded ? 3 : 4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="How can we help you?"
            />
            <p className="mt-1 text-sm text-gray-500">Maximum 500 characters</p>
          </FormField>

          <Button
            type="submit"
            variant="gold"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Sending...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      )}
    </motion.div>
  );
}

