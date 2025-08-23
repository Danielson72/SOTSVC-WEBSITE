import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export function ServiceAreaMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-lg shadow-sm"
    >
      <div className="flex items-center mb-6">
        <MapPin className="h-6 w-6 text-primary-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Service Area</h2>
      </div>

      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224444.06123939705!2d-81.36753979550062!3d28.481168563435374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e773d8fecdbc77%3A0xac3b2063ca5bf9e!2sOrlando%2C%20FL!5e0!3m2!1sen!2sus!4v1704920796319!5m2!1sen!2sus"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg"
          width="100%"
          height="400"
        />
      </div>

      <p className="mt-4 text-gray-600">
        We proudly serve the greater Orlando area and surrounding communities in Central Florida.
      </p>
    </motion.div>
  );
}