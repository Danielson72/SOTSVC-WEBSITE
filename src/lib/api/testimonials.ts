import { supabase } from '@/lib/supabase';
import type { TestimonialFormData, Testimonial } from '@/lib/types/testimonial';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

async function fetchWithRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function submitTestimonial(data: TestimonialFormData) {
  return fetchWithRetry(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to submit a testimonial');

    const { error } = await supabase
      .from('testimonials')
      .insert([{
        user_id: user.id,
        name: data.name,
        job_title: data.job_title,
        rating: data.rating,
        comment: data.comment,
        is_approved: false
      }]);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to submit testimonial');
    }
    
    return true;
  });
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return fetchWithRetry(async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return data || [];
  });
}

export async function getUserTestimonials(): Promise<Testimonial[]> {
  return fetchWithRetry(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return data || [];
  });
}

export async function deleteTestimonial(id: string) {
  return fetchWithRetry(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to delete a testimonial');

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .match({ id, user_id: user.id });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to delete testimonial');
    }

    return true;
  });
}