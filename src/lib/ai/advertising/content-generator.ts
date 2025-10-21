import { ServiceInfo } from '../types';
import { calculatePrice } from '../pricing';

export function generateSocialPost(
  service: ServiceInfo,
  platform: 'facebook' | 'instagram' | 'twitter',
  type: 'promotional' | 'informative' | 'testimonial'
): string {
  const basePrice = service.priceUnit === 'per_sqft' 
    ? `Starting at $${service.basePrice}/sq. ft.`
    : `Starting at $${service.basePrice}`;

  switch (type) {
    case 'promotional':
      return `✨ Transform your space with our professional ${service.name}!
${basePrice}
🏠 ${service.description}
📞 Book now and get 10% off your first service!
#CleanHome #ProfessionalCleaning #SonzOfThunder`;

    case 'informative':
      return `Did you know? Our ${service.name} includes:
✅ ${service.description}
${basePrice}
🕒 Flexible scheduling available
💫 100% Satisfaction guaranteed
#CleaningServices #HomeServices #SonzOfThunder`;

    case 'testimonial':
      return `"Absolutely amazing service! The team was professional and thorough!"
- Happy Customer

Try our ${service.name} today!
${basePrice}
#CustomerReview #CleaningServices #SonzOfThunder`;

    default:
      return '';
  }
}