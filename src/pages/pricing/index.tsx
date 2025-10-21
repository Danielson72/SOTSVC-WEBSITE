import { PricingCalculator } from './components/pricing-calculator';
import { PricingHero } from './components/pricing-hero';
import { PricingFAQ } from './components/pricing-faq';

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-24">
      <PricingHero />
      <PricingCalculator />
      <PricingFAQ />
    </div>
  );
}