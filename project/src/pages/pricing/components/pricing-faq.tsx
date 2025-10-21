import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'How is the pricing calculated?',
    answer: 'Our pricing is based on several factors including square footage, service type, frequency of service, and any additional services requested. We use a base rate plus a per-square-foot calculation to ensure fair and transparent pricing.'
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'No, we believe in transparent pricing. The quote you receive includes all standard cleaning services. Any additional services are clearly priced and optional.'
  },
  {
    question: 'Do you offer discounts for recurring services?',
    answer: 'Yes! We offer discounts for regular cleaning schedules: 20% off for weekly service, 15% off for bi-weekly service, and 10% off for monthly service.'
  },
  {
    question: 'What is your minimum square footage requirement?',
    answer: 'Our minimum square footage is 500 sq. ft. for residential services and 1,000 sq. ft. for commercial services.'
  }
];

export function PricingFAQ() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Common questions about our pricing
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}