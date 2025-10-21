import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const timeSlots = [
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM'
];

interface BookingCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  selectedTime: string | null;
}

export function BookingCalendar({
  selectedDate,
  onDateSelect,
  onTimeSelect,
  selectedTime
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = date.getTime() === today.getTime();
      const isPast = date < today;
      const isSelected = selectedDate?.getTime() === date.getTime();
      const isSunday = date.getDay() === 0;

      days.push(
        <button
          key={day}
          onClick={() => !isPast && !isSunday && onDateSelect(date)}
          disabled={isPast || isSunday}
          className={`h-12 rounded-lg text-sm relative ${
            isPast || isSunday
              ? 'text-gray-400 cursor-not-allowed'
              : isSelected
              ? 'bg-primary-600 text-white'
              : isToday
              ? 'bg-primary-50 text-primary-600'
              : 'hover:bg-gray-50'
          }`}
        >
          {day}
          {isSunday && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">
              Closed
            </span>
          )}
        </button>
      );
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const prevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    if (newDate >= new Date()) {
      setCurrentMonth(newDate);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary-600" />
          Schedule Your Cleaning
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            ←
          </button>
          <span className="text-gray-900 font-medium">
            {currentMonth.toLocaleString('default', {
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}
        {generateCalendarDays()}
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 mr-2 text-primary-600" />
            <h4 className="text-sm font-medium text-gray-900">
              Available Time Slots
            </h4>
          </div>
          <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? 'gold' : 'outline'}
                className="text-sm"
                onClick={() => onTimeSelect(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-6 flex items-start space-x-2 text-sm text-gray-600">
        <AlertCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
        <p>
          Appointments must be scheduled at least 24 hours in advance. 
          We are closed on Sundays. Same-day bookings are not available.
        </p>
      </div>
    </motion.div>
  );
}