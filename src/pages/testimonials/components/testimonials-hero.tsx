import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function TestimonialsHero() {
  return (
    <section className="relative h-[400px] mb-16">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80"
          alt="Customer testimonials"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-900/70" />
      </div>
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white max-w-2xl"
        >
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-gold-500 fill-current" />
            ))}
          </div>
          <h1 className="text-4xl font-bold mb-4">
            What Our Customers Say
          </h1>
          <p className="text-xl text-white/90">
            Real experiences from real customers. See why people trust us with their cleaning needs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}