import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Homeowner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    content: 'The level of professionalism and attention to detail is outstanding. Our home has never looked better!',
    rating: 5,
    date: '2024-01-15',
  },
  {
    name: 'Michael Chen',
    role: 'Business Owner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    content: 'Reliable, thorough, and always on time. They make keeping our office clean completely hassle-free.',
    rating: 5,
    date: '2024-01-10',
  },
  // Add more testimonials as needed
];

export function TestimonialsList() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-gray-200" />
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gold-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
              <p className="text-sm text-gray-500">
                Posted on {new Date(testimonial.date).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}