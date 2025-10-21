import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { calculatePrice, type ServiceType, type Frequency } from '@/lib/pricing/calculator';
import { extras, type ExtraService } from '@/lib/pricing/constants';
import { Button } from '@/components/ui/button';
import { BookingCalendar } from './booking-calendar';

export function PricingCalculator() {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState<ServiceType>('residential');
  const [squareFootage, setSquareFootage] = useState(1000);
  const [frequency, setFrequency] = useState<Frequency>('one-time');
  const [selectedExtras, setSelectedExtras] = useState<ExtraService[]>([]);
  const [specialDetails, setSpecialDetails] = useState('');
  const [quote, setQuote] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleCalculate = () => {
    const price = calculatePrice(serviceType, squareFootage, frequency, selectedExtras);
    setQuote(price);
  };

  const toggleExtra = (extraId: ExtraService) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const isCheckoutReady = quote !== null && selectedDate && selectedTime;

  const handleCheckout = () => {
    // Store booking details in session storage
    const bookingDetails = {
      serviceType,
      squareFootage,
      frequency,
      selectedExtras,
      specialDetails,
      quote,
      selectedDate: selectedDate?.toISOString(),
      selectedTime,
    };
    sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    navigate('/checkout');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="space-y-6">
              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as ServiceType)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="deep-cleaning">Deep Cleaning</option>
                  <option value="residential">Residential Cleaning</option>
                  <option value="commercial">Commercial Cleaning</option>
                  <option value="move-in-out">Move In/Out Cleaning</option>
                </select>
              </div>

              {/* Square Footage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Footage
                </label>
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={squareFootage}
                  onChange={(e) => setSquareFootage(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as Frequency)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="one-time">One Time</option>
                  <option value="weekly">Weekly (20% off)</option>
                  <option value="bi-weekly">Bi-Weekly (15% off)</option>
                  <option value="monthly">Monthly (10% off)</option>
                </select>
              </div>

              {/* Extras */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Services
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {extras.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra.id)}
                        onChange={() => toggleExtra(extra.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">{extra.label}</span>
                        <p className="text-xs text-gray-500">{extra.description}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">+${extra.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Details
                </label>
                <textarea
                  value={specialDetails}
                  onChange={(e) => setSpecialDetails(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Any special requirements or details about your space..."
                />
              </div>

              <Button
                variant="gold"
                className="w-full"
                onClick={handleCalculate}
              >
                Calculate Quote
              </Button>

              {quote !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-primary-50 rounded-lg text-center"
                >
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">
                    Estimated Price: ${quote}
                  </h3>
                  <p className="text-sm text-primary-600">
                    This is an estimate based on the information provided. 
                    Final price may vary based on specific requirements and inspection.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Calendar */}
          <BookingCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
          />
        </div>

        {/* Checkout Button */}
        {isCheckoutReady && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-center"
          >
            <Button
              variant="gold"
              size="lg"
              onClick={handleCheckout}
              className="group relative overflow-hidden transform hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-bold">Finalize and Checkout</span>
              </span>
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}