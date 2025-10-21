import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form';
import { supabase } from '@/lib/supabase';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const message = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([message]);

      if (error) throw error;
      
      setIsSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-lg shadow-sm"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

      {error && (
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
          Thank you for reaching out! We'll get back to you shortly.
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
              rows={4}
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