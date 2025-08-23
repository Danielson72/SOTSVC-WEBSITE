import { TestimonialsHero } from './components/testimonials-hero';
import { TestimonialsList } from '@/components/testimonials/testimonials-list';
import { TestimonialForm } from '@/components/testimonials/testimonial-form';

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen pt-24">
      <TestimonialsHero />
      <TestimonialsList />
      <TestimonialForm />
    </div>
  );
}