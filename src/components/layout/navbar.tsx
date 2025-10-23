import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleQuoteClick = () => {
    window.dispatchEvent(new CustomEvent('openContactForm'));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBackground = isHomePage
    ? isScrolled
      ? 'bg-white shadow-lg'
      : 'bg-transparent backdrop-blur-sm'
    : 'bg-primary-600';

  const linkColor = isHomePage
    ? isScrolled
      ? 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
      : 'text-white hover:text-white hover:bg-white/10'
    : 'text-white hover:bg-white/10';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${navBackground}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <Zap className={isHomePage && isScrolled ? 'text-gold-500' : 'text-white'} />
              <span className={`text-xl font-bold ${
                isHomePage && isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                <span className="text-gold-500">Sonz</span> of Thunder
                <span className="text-sm font-semibold ml-1 text-primary-500">SVC</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${linkColor}`}
              >
                {item.name}
              </Link>
            ))}
            {/* Mobile-visible call button */}
            <a 
              href="tel:407-461-6039"
              className="md:hidden fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-200"
              aria-label="Call now"
            >
              <Phone className="h-6 w-6" />
            </a>
            <Button
              variant="gold"
              size="default"
              className="quote-button transform hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg ml-2"
              onClick={handleQuoteClick}
            >
              Get a Free Estimate
            </Button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-md ${
              isHomePage && isScrolled ? 'text-gray-700' : 'text-white'
            }`}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={isHomePage ? 'md:hidden bg-white shadow-lg' : 'md:hidden bg-primary-700'}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isHomePage
                      ? 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                      : 'text-white hover:bg-white/10'
                  } transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile call button in menu */}
              <a 
                href="tel:407-461-6039"
                className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone className="h-5 w-5" />
                <span>Call: (407) 461-6039</span>
              </a>
              <div className="px-3 py-2">
                <Button
                  variant="gold"
                  className="w-full transform hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg"
                  onClick={handleQuoteClick}
                >
                  Get a Free Estimate
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}