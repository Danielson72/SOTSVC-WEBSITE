import { motion } from 'framer-motion';
import { Phone, Calendar, Sparkles, ThumbsUp } from 'lucide-react';

const steps = [
  {
    icon: Phone,
    title: 'Contact Us',
    description: 'Reach out through phone, email, or our online form.',
  },
  {
    icon: Calendar,
    title: 'Schedule Service',
    description: 'Choose a convenient time for your cleaning service.',
  },
  {
    icon: Sparkles,
    title: 'Professional Cleaning',
    description: 'Our expert team delivers top-quality cleaning service.',
  },
  {
    icon: ThumbsUp,
    title: 'Satisfaction Guaranteed',
    description: '100% satisfaction guarantee on all services.',
  },
];

export function ServiceProcess() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-xl text-gray-600">
            Simple steps to get your space professionally cleaned
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary-50 rounded-full">
                  <step.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}