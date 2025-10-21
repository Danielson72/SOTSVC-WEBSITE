import { motion } from 'framer-motion';
import { Shield, Heart, Users, Trophy } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Professional Excellence',
    description: 'We maintain the highest standards in cleaning and customer service.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Your satisfaction and comfort are our top priorities.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our trained professionals deliver consistent, quality results.',
  },
  {
    icon: Trophy,
    title: 'Quality Guaranteed',
    description: '100% satisfaction guarantee on all our services.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section with New Image */}
      <section className="relative h-[400px] mb-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581578731548-7f23fd1f3a2c?auto=format&fit=crop&q=80&f_webp"
            alt="Professional cleaning service"
            className="w-full h-full object-cover"
            width="1200"
            height="400"
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
              Professional Cleaning Excellence
            </h1>
            <p className="text-xl text-white/90">
              Delivering exceptional cleaning services with unmatched dedication and care
              throughout Central Florida.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-6"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            At Sonz of Thunder SVC, we're committed to delivering exceptional cleaning 
            services that transform spaces and exceed expectations. Our dedication to 
            quality and customer satisfaction drives everything we do.
          </motion.p>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center mb-4">
                  <value.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section with Side Image */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-gray-600">
                Founded with a vision to revolutionize the cleaning industry in Central 
                Florida, Sonz of Thunder SVC has grown from a small family business 
                into a trusted name in professional cleaning services.
              </p>
              <p className="text-gray-600">
                Our journey is built on the foundation of trust, reliability, and 
                excellence in service. We continue to grow while maintaining the 
                personal touch and attention to detail that set us apart.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative h-96"
            >
              <img
                src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&f_webp"
                alt="Professional cleaning team"
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                width="600"
                height="384"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}