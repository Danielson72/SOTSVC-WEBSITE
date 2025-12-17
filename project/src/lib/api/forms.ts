import { supabase } from '@/lib/supabase';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface QuoteFormData {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  smsOptIn: boolean;
}

export async function submitContactForm(data: ContactFormData) {
  try {
    console.log('Attempting Supabase insert to contact_requests...')

    const { error } = await supabase
      .from('contact_requests')
      .insert([{
        full_name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
        source_site: 'SOTSVC.com',
        form_type: 'contact'
      }])

    if (error) {
      console.error('Supabase error:', error)
      console.error('Error details:', error?.message, error?.code, error?.details)
      if (error.message?.includes('row-level security')) {
        throw new Error('Unable to submit form. Please try again.');
      }
      throw error;
    }

    console.log('Insert successful')
    return { success: true };
  } catch (error: any) {
    console.error('Contact form submission failed:', error)
    console.error('Error details:', error?.message, error?.code, error?.details)
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to submit form. Please try again later.');
    }
  }
}

export async function submitQuoteForm(data: QuoteFormData) {
  try {
    const { error } = await supabase
      .from('form_submissions')
      .insert([{
        type: 'quote',
        data: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          serviceType: data.serviceType,
          address: data.address,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          smsOptIn: data.smsOptIn
        }
      }]);

    if (error) {
      console.error('Form submission error:', error);
      if (error.message?.includes('validate_form_submission')) {
        throw new Error('Please check your input and try again.');
      }
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Quote form submission failed:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to submit quote request. Please try again later.');
    }
  }
}