export interface Testimonial {
  id: string;
  user_id: string;
  name: string;
  job_title?: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface TestimonialFormData {
  name: string;
  job_title?: string;
  rating: number;
  comment: string;
}