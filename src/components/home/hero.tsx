import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&f_webp',
    title: 'Professional Cleaning Services in Orlando',
    tagline: 'We bring the boom with a broom to every room!',
  },
  {
    image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&f_webp',
    title: 'Deep Cleaning Experts for Your Space',
    tagline: 'Trusted by Central Florida families & businesses',
  },
  {
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&f_webp',
    title: 'Licensed, Insured & Satisfaction Guaranteed',
    tagline: 'Experience the Sonz of Thunder difference',
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleQuoteClick = () => {
    window.open('https://api.leadconnectorhq.com/widget/form/pEHnV0t5Pk0YXdZaeypm', '_blank');
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((current) => (current + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative h-screen">
      {/* Background Slider */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            <picture className="absolute inset-0">
              {/* AVIF for newest browsers (best compression) */}
              <source srcSet={`${slide.image}&fm=avif&w=400 400w, ${slide.image}&fm=avif&w=800 800w, ${slide.image}&fm=avif&w=1200 1200w`}
                      type="image/avif" 
                      sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px" />
              
              {/* WebP for modern browsers */}
              <source srcSet={`${slide.image}&fm=webp&w=400 400w, ${slide.image}&fm=webp&w=800 800w, ${slide.image}&fm=webp&w=1200 1200w`}
                      type="image/webp" 
                      sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px" />
              
              {/* JPEG fallback */}
              <img src={`${slide.image}&w=800`}
                   srcSet={`${slide.image}&w=400 400w, ${slide.image}&w=800 800w, ${slide.image}&w=1200 1200w`}
                   sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px"
                   alt={slide.title}
                   width="1200" 
                   height="600"
                   loading={index === 0 ? "eager" : "lazy"}
                   fetchPriority={index === 0 ? "high" : "auto"}
                   className="absolute inset-0 w-full h-full object-cover" />
            </picture>
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl text-orange-400 font-semibold mb-4">
            {slides[currentSlide].tagline}
          </p>
          <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto">
            Professional residential & commercial cleaning services in Orlando and Central Florida. 
            Licensed, insured, and backed by our 100% satisfaction guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="gold"
              onClick={handleQuoteClick}
              className="quote-button text-lg px-8 py-4 bg-orange-500 hover:bg-orange-600 transform hover:scale-105 transition-all duration-200"
            >
              Get a Free Estimate
            </Button>
            <a 
              href="tel:407-461-6039"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <Phone className="h-5 w-5" />
              <span>Call Now: (407) 461-6039</span>
            </a>
            <Link to="/services">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10 px-6 py-4"
              >
                Schedule a Cleaning
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 transition-all ${
              index === currentSlide ? 'bg-white w-4' : 'bg-white/80 w-2'
            } rounded-full`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}