import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactInfoCardProps {
  title: string;
  name: string;
  phone?: string;
  email?: string;
}

export function ContactInfoCard({ title, name, phone, email }: ContactInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        <p className="text-gray-700 font-medium">{name}</p>
        
        {phone && (
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Phone className="h-4 w-4 mr-2" />
            {phone}
          </a>
        )}
        
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Mail className="h-4 w-4 mr-2" />
            {email}
          </a>
        )}
      </div>
    </motion.div>
  );
}