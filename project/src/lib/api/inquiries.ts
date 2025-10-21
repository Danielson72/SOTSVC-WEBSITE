import { supabase } from '@/lib/supabase';
import { validateForm } from '@/lib/validation/form';

export interface CustomerInquiry {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  smsOptIn?: boolean;
}

export async function submitInquiry(data: CustomerInquiry) {
  // Validate form data
  const validation = validateForm(data);
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors)[0]);
  }

  try {
    const { error } = await supabase
      .from('quote_requests')
      .insert([{
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        service_type: data.serviceType,
        address: data.address,
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        sms_opt_in: data.smsOptIn || false
      }]);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Failed to submit inquiry:', error);
    throw new Error('Failed to submit your inquiry. Please try again.');
  }
}