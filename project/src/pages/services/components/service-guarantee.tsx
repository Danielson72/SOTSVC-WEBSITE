import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ServiceGuarantee() {
  return (
    <section className="py-16 bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block p-3 bg-primary-800 rounded-full mb-6"
          >
            <Shield className="h-8 w-8 text-gold-500" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold mb-4"
          >
            Our Service Guarantee
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
          >
            We stand behind our work with a 100% satisfaction guarantee. If you're not 
            completely satisfied, we'll make it right.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="gold" size="lg">
              Schedule Now
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}