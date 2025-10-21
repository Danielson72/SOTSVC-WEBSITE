import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QUOTE_URL = 'https://api.leadconnectorhq.com/widget/form/pEHnV0t5Pk0YXdZaeypm';

interface ServiceCardProps {
  title: string;
  description: string;
  price: number;
  unit: string;
  sqft: string;
  image: string;
  features: string[];
}

export function ServiceCard({
  title,
  description,
  price,
  unit,
  sqft,
  image,
  features,
}: ServiceCardProps) {
  const handleQuoteClick = () => {
    window.open(QUOTE_URL, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden">
        <picture>
          {/* AVIF for newest browsers */}
          <source srcSet={`${image}&fm=avif&w=400&h=192&fit=crop 400w, ${image}&fm=avif&w=800&h=384&fit=crop 800w`}
                  type="image/avif" 
                  sizes="(max-width: 768px) 400px, 800px" />
          
          {/* WebP for modern browsers */}
          <source srcSet={`${image}&fm=webp&w=400&h=192&fit=crop 400w, ${image}&fm=webp&w=800&h=384&fit=crop 800w`}
                  type="image/webp" 
                  sizes="(max-width: 768px) 400px, 800px" />
          
          {/* JPEG fallback */}
          <img src={`${image}&w=400&h=192&fit=crop`}
               srcSet={`${image}&w=400&h=192&fit=crop 400w, ${image}&w=800&h=384&fit=crop 800w`}
               sizes="(max-width: 768px) 400px, 800px"
               alt={title}
               className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
               width="400"
               height="192"
               loading="lazy" />
        </picture>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="mb-4">
          <div className="text-2xl font-bold text-primary-600">
            ${price}
            <span className="text-sm font-normal text-gray-500"> {unit}</span>
          </div>
          <div className="text-sm text-gray-500">Up to {sqft}</div>
        </div>

        <div className="space-y-2 mb-6">
          {features.map((feature) => (
            <div key={feature} className="flex items-center text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <Button 
          variant="gold" 
          onClick={handleQuoteClick}
          className="w-full quote-button"
        >
          Get a Free Estimate
        </Button>
      </div>
    </div>
  );
}