import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { services } from '@/lib/ai/service-data';
import { Button } from '@/components/ui/button';

export function ServiceOverview() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-2"
          >
            Professional cleaning solutions for every need
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-orange-600 font-semibold"
          >
            Serving Orlando, Winter Park, Kissimmee & Central Florida
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-orange-500"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-primary-600 font-medium">
                  From ${service.basePrice}
                  {service.priceUnit === 'per_sqft' ? '/sq. ft.' : ''}
                </span>
                <Button
                  variant="gold"
                  onClick={() => window.dispatchEvent(new CustomEvent('openContactForm'))}
                >
                  Get Quote
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}