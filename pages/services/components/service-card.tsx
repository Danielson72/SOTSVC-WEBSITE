import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
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

        <Link to="/pricing">
          <Button variant="gold" className="w-full">
            Get a Quote
          </Button>
        </Link>
      </div>
    </div>
  );
}