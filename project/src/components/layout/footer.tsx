import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, Shield, Award } from 'lucide-react';
import { counties } from '@/lib/locations/service-areas';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Sonz of Thunder Services</h3>
                <p className="text-orange-400 font-medium">SOTSVC.com</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 text-lg font-medium">
              "We bring the boom with a broom to every room!"
            </p>
            <p className="text-gray-400 mb-6">
              Professional residential and commercial cleaning services serving Orlando and Central Florida. 
              Licensed, insured, and committed to your complete satisfaction.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-sm">Licensed & Insured</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                <Award className="h-4 w-4 text-yellow-400" />
                <span className="text-sm">5-Star Service</span>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <a 
                href="tel:407-461-6039" 
                className="flex items-center text-white hover:text-orange-400 transition-colors text-lg font-medium"
              >
                <Phone className="h-5 w-5 mr-3 text-orange-400" />
                (407) 461-6039
              </a>
              <a 
                href="mailto:sonzofthunder72@gmail.com"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5 mr-3 text-orange-400" />
                sonzofthunder72@gmail.com
              </a>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-5 w-5 mr-3 text-orange-400" />
                Serving Orlando & Central Florida
              </div>
              <div className="flex items-center text-gray-300">
                <Clock className="h-5 w-5 mr-3 text-orange-400" />
                Sunday-Friday: 7:00 AM - 10:00 PM
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-400">Service Areas</h4>
            <ul className="space-y-2">
              {counties.map((county) => (
                <li key={county.id}>
                  <Link
                    to={`/service-areas#${county.id}`}
                    className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                  >
                    {county.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">
                <strong className="text-white">Don't see your area?</strong><br/>
                We're expanding! Call us to check availability.
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-400">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                  Residential Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                  Commercial Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                  Deep Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                  Move-In/Out Cleaning
                </Link>
              </li>
            </ul>
            
            <h4 className="text-lg font-semibold mb-4 mt-6 text-orange-400">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Sonz of Thunder Services. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Licensed & Insured Cleaning Professionals | FL License #ABC123
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Follow Us:</span>
              <a
                href="https://www.facebook.com/share/19U4RrwrF6/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-400 transition-colors transform hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/sonz_of_thunder_72?igsh=d3FsY2xnNTZ5NGE5&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-400 transition-colors transform hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          {/* Additional Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-2 md:space-y-0">
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <span>Professional Cleaning Orlando</span>
                <span>•</span>
                <span>Residential Cleaning Services</span>
                <span>•</span>
                <span>Commercial Cleaning FL</span>
              </div>
              <p className="text-center text-gray-400">
              In association with Coverall
            </p>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}