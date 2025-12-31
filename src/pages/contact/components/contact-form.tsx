import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form';

// n8n webhook URL - handles everything server-side
const N8N_WEBHOOK_URL = 'https://sonzofthunder72.app.n8n.cloud/webhook/sotsvc-contact-form'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    console.log('=== CONTACT PAGE FORM SUBMISSION START ===')
    console.log('Posting to n8n webhook...')

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: (formData.get('phone') as string) || '',
          message: (formData.get('message') as string) || '',
          form_type: 'standalone',
          source_site: typeof window !== 'undefined' ? window.location.hostname : 'sotsvc.com',
        })
      })

      console.log('Response status:', response.status)

      // HTTP 200 = success, don't try to parse JSON (causes CORS issues)
      if (response.ok) {
        setError(null);
        setIsSuccess(true);
        e.currentTarget.reset();
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setError('Failed to send message. Please try again.');
        setIsSuccess(false);
      }
    } catch (err) {
      console.error('=== SUBMISSION ERROR ===', err);
      setError('Network error. Please try again.');
      setIsSuccess(false);
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
