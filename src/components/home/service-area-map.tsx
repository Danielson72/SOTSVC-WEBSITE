import { motion } from 'framer-motion';
import { MapPin, CheckCircle, Phone } from 'lucide-react';
import { counties } from '@/lib/locations/service-areas';
import { Button } from '@/components/ui/button';

export function ServiceAreaMap() {
  const handleAvailabilityCheck = () => {
    window.dispatchEvent(new CustomEvent('openContactForm'));
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4"
          >
            Service Areas
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-2"
          >
            Proudly serving Central Florida
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-orange-600 font-semibold"
          >
            Licensed & Insured • Same-Day Service Available
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {counties.map((county, index) => (
            <motion.div
              key={county.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 text-orange-500 mr-2" />
                {county.name}
              </h3>
              <ul className="space-y-2 mb-6">
                {county.majorCities.map((city) => (
                  <li key={city} className="text-gray-600 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {city}
                  </li>
                ))}
              </ul>
              <Button 
                variant="gold" 
                className="w-full transform hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg"
                onClick={handleAvailabilityCheck}
              >
                Check Availability
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Add a prominent CTA button at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Don't See Your Area Listed?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              We're expanding! Contact us to see if we can serve your location in Central Florida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleAvailabilityCheck}
                className="bg-white text-blue-600 border-white hover:bg-blue-50 transform hover:scale-105 transition-all duration-200"
              >
                Get Free Quote
              </Button>
              <a
                href="tel:407-461-6039"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <Phone className="h-5 w-5" />
                <span>Call (407) 461-6039</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}