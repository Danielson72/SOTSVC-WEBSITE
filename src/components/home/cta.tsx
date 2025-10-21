import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Award, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const guarantees = [
  { icon: Award, text: '100% Satisfaction Guaranteed' },
  { icon: Shield, text: 'Licensed & Insured' },
  { icon: Clock, text: 'Same-Day Service Available' },
];

export function CTA() {
  const handleQuoteClick = () => {
    window.open('https://api.leadconnectorhq.com/widget/form/pEHnV0t5Pk0YXdZaeypm', '_blank');
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" 
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
               backgroundSize: '20px 20px'
             }} />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          Ready to Experience the Sonz of Thunder Difference?
        </h2>
        <p className="text-xl text-white/90 mb-2">
          Professional cleaning services in Orlando & Central Florida
        </p>
        <p className="text-lg text-orange-300 font-semibold mb-8">
          "We bring the boom with a broom to every room!"
        </p>
        
        {/* Guarantees */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {guarantees.map((guarantee, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <guarantee.icon className="h-5 w-5 text-orange-300" />
              <span className="text-white text-sm font-medium">{guarantee.text}</span>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            size="lg" 
            variant="gold"
            onClick={handleQuoteClick}
            className="quote-button bg-orange-500 hover:bg-orange-600 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Get Your Free Quote
          </Button>
          <a
            href="tel:407-461-6039"
            className="flex items-center justify-center space-x-2 bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Phone className="h-5 w-5" />
            <span>Call (407) 461-6039</span>
          </a>
        </div>
        
        <p className="text-white/80 text-sm mb-8">
          <strong>Licensed • Insured • Local Orlando Business</strong><br/>
          Serving Orange, Seminole, Volusia, Osceola & Brevard Counties
        </p>
        
        <div className="mt-12">
          <h3 className="text-white text-lg font-medium mb-4">Follow Us on Social Media</h3>
          <div className="flex justify-center space-x-6">
            <a
              href="https://www.facebook.com/share/19U4RrwrF6/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-orange-300 transition-colors transform hover:scale-110"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-8 h-8" />
            </a>
            <a
              href="https://www.instagram.com/sonz_of_thunder_72?igsh=d3FsY2xnNTZ5NGE5&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-orange-300 transition-colors transform hover:scale-110"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-8 h-8" />
            </a>
          </div>
          <p className="text-white/70 text-sm mt-4">
            See our latest work and happy customers!
          </p>
        </div>
      </div>
    </section>
  );
}