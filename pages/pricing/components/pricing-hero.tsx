import { motion } from 'framer-motion';

export function PricingHero() {
  return (
    <section className="relative h-[400px] mb-16">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80"
          alt="Pricing calculator"
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
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white/90">
            Get an instant quote for your cleaning needs with our easy-to-use calculator. 
            No hidden fees, just honest pricing.
          </p>
        </motion.div>
      </div>
    </section>
  );
}