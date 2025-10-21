import { counties } from '@/lib/locations/service-areas';
import { Button } from '@/components/ui/button';

export default function ServiceAreasPage() {
  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Service Areas
          </h1>
          <p className="text-xl text-gray-600">
            Proudly serving Central Florida with exceptional cleaning services
          </p>
        </div>

        {/* Counties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {counties.map((county) => (
            <div
              key={county.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {county.name}
              </h2>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Major Cities
                </h3>
                <ul className="space-y-1">
                  {county.majorCities.map((city) => (
                    <li key={city} className="text-gray-600">
                      {city}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Popular Services
                </h3>
                <ul className="space-y-1">
                  {county.popularServices.map((service) => (
                    <li key={service} className="text-gray-600 capitalize">
                      {service.replace('-', ' ')}
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="gold" className="w-full">
                Check Availability
              </Button>
            </div>
          ))}
        </div>

        {/* Service Guarantee */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Our Service Guarantee
          </h2>
          <p className="text-gray-600 mb-6">
            As a locally owned business, we take pride in serving Central Florida 
            with exceptional cleaning services. Our team is familiar with the unique 
            needs of each community we serve.
          </p>
          <Button variant="gold" size="lg">
            Schedule a Cleaning
          </Button>
        </div>
      </div>
    </div>
  );
}