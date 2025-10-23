import { Sparkles, Shield, Clock, Award, Phone, MapPin, Star, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Licensed & Insured',
    description: 'Fully licensed and insured cleaning professionals you can trust in your home or business.',
  },
  {
    icon: Shield,
    title: '100% Satisfaction Guaranteed',
    description: 'We stand behind our work with a complete satisfaction guarantee on every cleaning.',
  },
  {
    icon: Clock,
    title: '7 Days a Week Service',
    description: 'Available Sunday through Friday, 7AM-10PM. Flexible scheduling to fit your busy life.',
  },
  {
    icon: Award,
    title: 'Local Orlando Experts',
    description: 'Proudly serving Orlando and Central Florida with personalized, professional service.',
  },
];

const trustIndicators = [
  { icon: Star, text: '5-Star Reviews', color: 'text-yellow-500' },
  { icon: CheckCircle, text: 'Background Checked', color: 'text-green-500' },
  { icon: Phone, text: 'Local Family Business', color: 'text-blue-500' },
  { icon: MapPin, text: 'Central Florida Based', color: 'text-orange-500' },
];

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Why Choose Sonz of Thunder
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Central Florida's trusted cleaning professionals since day one
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {trustIndicators.map((indicator, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm"
              >
                <indicator.icon className={`h-5 w-5 ${indicator.color}`} />
                <span className="text-sm font-medium text-gray-700">{indicator.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border-t-4 border-orange-500"
            >
              <div className="absolute -top-4 left-6">
                <span className="inline-flex p-3 bg-gradient-to-br from-blue-100 to-orange-100 text-orange-600 rounded-lg shadow-md">
                  <feature.icon className="h-6 w-6" />
                </span>
              </div>
              <div className="pt-8">
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of satisfied customers in Orlando and Central Florida
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:407-461-6039"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <Phone className="h-5 w-5" />
                <span>Call (407) 461-6039</span>
              </a>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openContactForm'))}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Get Free Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}