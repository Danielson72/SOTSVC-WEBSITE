import { supabase } from '../supabase';

export interface QuoteRequestData {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  smsOptIn: boolean;
}

export async function submitQuoteRequest(data: QuoteRequestData) {
  try {
    // Create quote request
    const { error } = await supabase
      .from('quote_requests')
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        service_type: data.serviceType,
        address: data.address,
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        sms_opt_in: data.smsOptIn
      });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Quote request submission failed:', error);
    throw error;
  }
}