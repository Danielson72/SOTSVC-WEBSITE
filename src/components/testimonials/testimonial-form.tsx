import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form';
import { submitTestimonial } from '@/lib/api/testimonials';
import type { TestimonialFormData } from '@/lib/types/testimonial';

export function TestimonialForm() {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const testimonialData: TestimonialFormData = {
        name,
        job_title: jobTitle || undefined,
        rating,
        comment
      };

      await submitTestimonial(testimonialData);
      setIsSuccess(true);
      
      // Reset form
      setName('');
      setJobTitle('');
      setRating(5);
      setComment('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Share Your Experience
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        value <= rating
                          ? 'text-gold-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <FormField label="Your Name">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </FormField>

            {/* Job Title */}
            <FormField label="Your Job Title (Optional)">
              <Input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Business Owner"
              />
            </FormField>

            {/* Comment */}
            <FormField label="Your Comment">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Share your experience with our services..."
              />
            </FormField>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-green-50 text-green-600 rounded-md text-center"
              >
                Thank you for sharing your experience! Your review will be visible after approval.
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}