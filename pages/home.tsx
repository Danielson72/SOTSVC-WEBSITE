import { Hero } from '@/components/home/hero';
import { Features } from '@/components/home/features';
import { Testimonials } from '@/components/home/testimonials';
import { CTA } from '@/components/home/cta';
import { ServiceOverview } from '@/components/home/service-overview';
import { ServiceAreaMap } from '@/components/home/service-area-map';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <ServiceOverview />
      <Features />
      <ServiceAreaMap />
      <Testimonials />
      <CTA />
    </div>
  );
}