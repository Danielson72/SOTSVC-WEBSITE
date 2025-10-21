import { motion } from 'framer-motion';
import { ContactInfoCard } from './components/contact-info-card';
import { ServiceAreaMap } from './components/service-area-map';
import { FormContact } from '@/components/forms/FormContact';

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            We're here to help! Reach out to us anytime.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Cards */}
          <div className="space-y-6">
            <ContactInfoCard
              title="Owner"
              name="Daniel Alvarez"
              phone="407-461-6039"
              email="sonzofthunder72@gmail.com"
            />
            <ContactInfoCard
              title="Operations Manager"
              name="James Rodriguez"
              phone="407-868-1274"
              email="call777clean@gmail.com"
            />
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FormContact formType="embedded" />
          </motion.div>
        </div>

        {/* Map */}
        <ServiceAreaMap />
      </div>
    </div>
  );
}