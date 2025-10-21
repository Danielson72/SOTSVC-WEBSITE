import { motion } from 'framer-motion';
import { ServiceCard } from './service-card';

const services = [
  {
    title: 'Deep Cleaning',
    description: 'Thorough cleaning of every nook and cranny, including baseboards, light fixtures, and hard-to-reach areas.',
    price: 150,
    unit: 'starting at',
    sqft: '500 sq. ft.',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80',
    features: [
      'Detailed cleaning of all surfaces',
      'Deep carpet cleaning',
      'Window cleaning',
      'Baseboards and crown molding',
    ],
  },
  {
    title: 'Residential Cleaning',
    description: 'Regular or one-time cleaning of homes, keeping your living space pristine and comfortable.',
    price: 100,
    unit: 'starting at',
    sqft: '500 sq. ft.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80',
    features: [
      'Kitchen and bathroom cleaning',
      'Dusting and vacuuming',
      'Floor cleaning',
      'General tidying',
    ],
  },
  {
    title: 'Commercial Cleaning',
    description: 'Professional cleaning services for offices and commercial spaces.',
    price: 200,
    unit: 'starting at',
    sqft: '1,000 sq. ft.',
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80',
    features: [
      'Office cleaning',
      'Common area maintenance',
      'Restroom sanitation',
      'Trash removal',
    ],
  },
  {
    title: 'Move-In/Move-Out Cleaning',
    description: 'Detailed cleaning for moving transitions, ensuring spaces are ready for new occupants.',
    price: 180,
    unit: 'starting at',
    sqft: '800 sq. ft.',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80',
    features: [
      'Deep cleaning all rooms',
      'Appliance cleaning',
      'Cabinet cleaning',
      'Floor deep cleaning',
    ],
  },
  {
    title: 'Special Request Cleaning',
    description: 'Have unique cleaning needs? We offer customized cleaning solutions tailored specifically to your requirements. No job is too big or too small.',
    price: 0,
    unit: 'custom quote',
    sqft: 'any size',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80',
    features: [
      'Customized cleaning plans',
      'Flexible scheduling options',
      'Specialized cleaning services',
      'Free consultation and quote',
      'Satisfaction guaranteed',
    ],
  },
];

export function ServicesGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600">
            Professional cleaning solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}