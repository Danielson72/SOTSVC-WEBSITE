import { motion } from 'framer-motion';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-8 rounded-lg shadow-sm"
    >
      {/* Owner Information - Large and Prominent */}
      <div className="bg-primary-50 p-8 rounded-xl mb-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Daniel Alvarez</h2>
          <p className="text-xl text-primary-600 font-medium mb-6">Owner & Operator</p>
          
          <div className="flex justify-center space-x-8">
            <a 
              href="tel:407-461-6039" 
              className="flex items-center text-lg text-primary-700 hover:text-primary-800 font-medium"
            >
              <Phone className="h-6 w-6 mr-2" />
              407-461-6039
            </a>
            <a 
              href="mailto:sonzofthunder72@gmail.com" 
              className="flex items-center text-lg text-primary-700 hover:text-primary-800 font-medium"
            >
              <Mail className="h-6 w-6 mr-2" />
              sonzofthunder72@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-start">
          <Clock className="h-6 w-6 text-primary-600 mt-1 mr-4" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
            <p className="text-gray-600">Sunday to Friday: 7:00 AM - 10:00 PM</p>
            <p className="text-gray-600">Saturday: Closed</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gold-50 rounded-lg border border-gold-200">
        <p className="text-center text-gray-800 font-medium">
          For fastest response, call or text <span className="text-primary-600">407-461-6039</span>
        </p>
      </div>
    </motion.div>
  );
}