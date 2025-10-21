import { motion } from 'framer-motion';
import { FormContact } from '@/components/forms/FormContact';

export function ContactSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with us today for a free quote. We're here to make your space shine!
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <FormContact formType="embedded" />
        </div>
      </div>
    </section>
  );
}

