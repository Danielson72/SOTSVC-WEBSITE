import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormError } from '@/components/ui/form';
import { submitInquiry } from '@/lib/api/inquiries';
import type { CustomerInquiry } from '@/lib/api/inquiries';

interface InquiryFormProps {
  onSuccess: () => void;
}

export function InquiryForm({ onSuccess }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: CustomerInquiry = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      serviceType: formData.get('serviceType') as string,
      address: formData.get('address') as string,
      preferredDate: formData.get('preferredDate') as string,
      preferredTime: formData.get('preferredTime') as string,
      smsOptIn: formData.get('smsOptIn') === 'on'
    };

    try {
      await submitInquiry(data);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {error && <FormError message={error} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full Name">
          <Input
            type="text"
            name="fullName"
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
      </div>

      <FormField label="Phone Number">
        <Input
          type="tel"
          name="phone"
          required
          placeholder="(123) 456-7890"
          pattern="[\d\s\-\(\)]+"
        />
      </FormField>

      <FormField label="Service Type">
        <select
          name="serviceType"
          required
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Select a service...</option>
          <option value="deep-cleaning">Deep Cleaning</option>
          <option value="residential">Residential Cleaning</option>
          <option value="commercial">Commercial Cleaning</option>
          <option value="move-in-out">Move In/Out Cleaning</option>
        </select>
      </FormField>

      <FormField label="Address">
        <Input
          type="text"
          name="address"
          required
          placeholder="Enter your full address"
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Preferred Date">
          <Input
            type="date"
            name="preferredDate"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </FormField>

        <FormField label="Preferred Time">
          <select
            name="preferredTime"
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Select time...</option>
            <option value="morning">Morning (7AM - 11AM)</option>
            <option value="afternoon">Afternoon (11AM - 3PM)</option>
            <option value="evening">Evening (3PM - 7PM)</option>
          </select>
        </FormField>
      </div>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          name="smsOptIn"
          id="smsOptIn"
          className="mt-1 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        <label htmlFor="smsOptIn" className="text-sm text-gray-600">
          I agree to receive text messages about my inquiry and service updates.
          I understand that I can opt-out at any time.
        </label>
      </div>

      <Button
        type="submit"
        variant="gold"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </Button>

      <p className="text-center text-xs text-gray-500">
        By submitting this form, you agree to our{' '}
        <a href="/terms" className="text-primary-600 hover:text-primary-700">
          Terms of Service
        </a>
        {' '}and{' '}
        <a href="/privacy" className="text-primary-600 hover:text-primary-700">
          Privacy Policy
        </a>
      </p>
    </motion.form>
  );
}