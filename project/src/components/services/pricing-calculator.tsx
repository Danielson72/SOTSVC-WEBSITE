import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CalculatorProps {
  onGetQuote: (estimate: number) => void;
}

export function PricingCalculator({ onGetQuote }: CalculatorProps) {
  const [squareFootage, setSquareFootage] = useState<number>(1000);
  const [serviceType, setServiceType] = useState<string>('residential');
  const [frequency, setFrequency] = useState<string>('one-time');

  const calculateEstimate = () => {
    let baseRate = 0;
    
    switch (serviceType) {
      case 'deep':
        baseRate = squareFootage <= 1000 ? 150 : 
                  squareFootage <= 2000 ? 200 : 300;
        break;
      case 'residential':
        baseRate = 100;
        if (frequency === 'bi-weekly') baseRate = 150;
        if (frequency === 'monthly') baseRate = 200;
        if (squareFootage > 2000) baseRate += 25;
        break;
      case 'commercial':
        baseRate = squareFootage * 0.15;
        break;
      case 'move':
        baseRate = squareFootage <= 1000 ? 200 :
                  squareFootage <= 2000 ? 250 : 350;
        break;
    }

    onGetQuote(baseRate);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Service Type
        </label>
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="deep">Deep Cleaning</option>
          <option value="residential">Residential Cleaning</option>
          <option value="commercial">Commercial Cleaning</option>
          <option value="move">Move In/Out Cleaning</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Square Footage
        </label>
        <input
          type="number"
          min="100"
          step="100"
          value={squareFootage}
          onChange={(e) => setSquareFootage(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {serviceType === 'residential' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="one-time">One Time</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      )}

      <Button
        variant="gold"
        className="w-full"
        onClick={calculateEstimate}
      >
        Calculate Estimate
      </Button>
    </div>
  );
}