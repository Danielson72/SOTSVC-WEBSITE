import { Star, Quote, MapPin, Phone } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Homeowner, Winter Park',
    location: 'Winter Park, FL',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&f_webp',
    content: 'Daniel and his team are absolutely amazing! They transformed our home with their deep cleaning service. Professional, reliable, and the attention to detail is incredible. We use them monthly now!',
    rating: 5,
    service: 'Deep Cleaning'
  },
  {
    name: 'Michael Chen',
    role: 'Business Owner, Orlando',
    location: 'Orlando, FL',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&f_webp',
    content: 'Our office has never looked better! Sonz of Thunder provides exceptional commercial cleaning. Always on time, thorough, and professional. Highly recommend to any business in Orlando.',
    rating: 5,
    service: 'Commercial Cleaning'
  },
  {
    name: 'Jennifer Martinez',
    role: 'Property Manager, Kissimmee',
    location: 'Kissimmee, FL',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&f_webp&w=150&h=150',
    content: 'We use Sonz of Thunder for all our move-out cleanings. They consistently deliver outstanding results. Reliable, affordable, and they treat every property like their own home.',
    rating: 5,
    service: 'Move-Out Cleaning'
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
              ))}
              <span className="ml-2 text-gray-600 font-medium">5.0 Stars</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Real reviews from real customers across Central Florida
          </p>
          <p className="text-orange-600 font-semibold">
            Join 500+ satisfied customers in Orlando, Winter Park, and Kissimmee
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="flex flex-col bg-gray-50 rounded-xl shadow-sm p-8 hover:shadow-lg transition-all duration-300 relative border-l-4 border-orange-500"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-orange-200" />
              <div className="flex items-center gap-4 mb-4">
                <picture>
                  <source srcSet={`${testimonial.image}&fm=avif&w=96&h=96&fit=crop&crop=face 1x, ${testimonial.image}&fm=avif&w=192&h=192&fit=crop&crop=face 2x`}
                          type="image/avif" />
                  <source srcSet={`${testimonial.image}&fm=webp&w=96&h=96&fit=crop&crop=face 1x, ${testimonial.image}&fm=webp&w=192&h=192&fit=crop&crop=face 2x`}
                          type="image/webp" />
                  <img src={`${testimonial.image}&w=96&h=96&fit=crop&crop=face`}
                       srcSet={`${testimonial.image}&w=96&h=96&fit=crop&crop=face 1x, ${testimonial.image}&w=192&h=192&fit=crop&crop=face 2x`}
                       alt={testimonial.name}
                       className="h-12 w-12 rounded-full object-cover"
                       width="48"
                       height="48"
                       loading="lazy" />
                </picture>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {testimonial.location}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-gold-500 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4 flex-grow">"{testimonial.content}"</p>
              <div className="mt-auto">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  {testimonial.service}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Join Our Happy Customers?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Experience the Sonz of Thunder difference in your home or business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://api.leadconnectorhq.com/widget/form/pEHnV0t5Pk0YXdZaeypm"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Get Your Free Quote
              </a>
              <a
                href="tel:407-461-6039"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <Phone className="h-5 w-5" />
                <span>Call (407) 461-6039</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}