import { motion } from 'framer-motion';
import { ContactForm } from './components/contact-form';
import { ContactInfo } from './components/contact-info';
import { Map } from './components/map';

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ContactForm />
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <ContactInfo />
            <Map />
          </motion.div>
        </div>
      </div>
    </div>
  );
}