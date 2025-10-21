import { businessHours } from './service-data';

export function isBusinessOpen(date: Date = new Date()): boolean {
  const day = date.getDay();
  const hours = businessHours.find(h => h.dayOfWeek === day);
  
  if (!hours || !hours.isOpen) return false;

  const currentTime = `${date.getHours().toString().padStart(2, '0')}:${
    date.getMinutes().toString().padStart(2, '0')}`;
    
  return currentTime >= hours.open && currentTime <= hours.close;
}

export function getNextAvailableSlot(date: Date = new Date()): Date {
  let checkDate = new Date(date);
  let daysChecked = 0;
  
  while (daysChecked < 7) {
    if (isBusinessOpen(checkDate)) {
      return checkDate;
    }
    
    checkDate.setDate(checkDate.getDate() + 1);
    checkDate.setHours(7, 0, 0, 0); // Reset to opening time
    daysChecked++;
  }
  
  throw new Error('No available slots found in the next week');
}