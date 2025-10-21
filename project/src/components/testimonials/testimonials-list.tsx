import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTestimonials, getUserTestimonials, deleteTestimonial } from '@/lib/api/testimonials';
import type { Testimonial } from '@/lib/types/testimonial';
import { useAuth } from '@/contexts/auth-context';

// Sample reviews to display (can be replaced with real reviews later)
const sampleReviews = [
  {
    id: 'sample-1',
    name: 'Jasmine Rivera',
    job_title: 'Office Manager',
    rating: 5,
    comment: 'Sonz of Thunder brought our office back to life. Spotless and professional from top to bottom!',
    created_at: '2025-02-15T10:30:00Z',
    is_approved: true,
  },
  {
    id: 'sample-2', 
    name: 'David N.',
    job_title: 'Airbnb Host',
    rating: 5,
    comment: 'They\'re my go-to for deep cleans between guests. Always on time, always sparkling results.',
    created_at: '2025-04-06T14:45:00Z',
    is_approved: true,
  },
  {
    id: 'sample-3',
    name: 'Maria Lopez', 
    job_title: 'Salon Owner',
    rating: 5,
    comment: 'My salon has never looked better. They really do bring the boom with a broom!',
    created_at: '2025-05-12T09:15:00Z',
    is_approved: true,
  },
  {
    id: 'sample-4',
    name: 'Thomas Greene',
    job_title: 'Contractor', 
    rating: 5,
    comment: 'I hired SOTSVC for a post-renovation clean, and they exceeded expectations.',
    created_at: '2025-06-18T16:20:00Z',
    is_approved: true,
  },
];

export function TestimonialsList() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    async function loadTestimonials() {
      try {
        setIsLoading(true);
        setError(null);

        // First try to get public testimonials
        const publicData = await getTestimonials();
        if (mounted) {
          setTestimonials(publicData);
        }

        // Then try to get user testimonials if logged in
        if (user) {
          const userData = await getUserTestimonials();
          if (mounted) {
            setUserTestimonials(userData);
          }
        }

        if (mounted) {
          setError(null);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        if (mounted) {
          setError('Failed to load testimonials. Please try again.');
          
          // Implement exponential backoff for retries
          if (retryCount < 3) {
            const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
            retryTimeout = setTimeout(() => {
              setRetryCount(prev => prev + 1);
              loadTestimonials();
            }, delay);
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadTestimonials();

    return () => {
      mounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [user, retryCount]);

  const handleRetry = () => {
    setRetryCount(0); // Reset retry count
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await deleteTestimonial(id);
      setUserTestimonials(prev => prev.filter(t => t.id !== id));
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete testimonial');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading testimonials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={handleRetry}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User's Testimonials */}
        {userTestimonials.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {userTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-6 relative"
                >
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-gray-200" />
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary-600">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {testimonial.name}
                          {testimonial.job_title && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                              {testimonial.job_title}
                            </span>
                          )}
                        </h3>
                        <div className="flex space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-5 w-5 text-gold-500 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-gray-600 italic mb-4">"{testimonial.comment}"</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(testimonial.created_at).toLocaleDateString()}
                    </p>
                    {!testimonial.is_approved && (
                      <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                        Pending Approval
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Public Testimonials */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          {sampleReviews.length === 0 && testimonials.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sample Reviews */}
              {sampleReviews.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-6 relative"
                >
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-gray-200" />
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-600">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {testimonial.name}
                        {testimonial.job_title && (
                          <span className="text-sm font-normal text-gray-500 ml-2">
                            {testimonial.job_title}
                          </span>
                        )}
                      </h3>
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-gold-500 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 italic mb-4">"{testimonial.comment}"</p>
                  
                  <p className="text-sm text-gray-500">
                    Posted on {new Date(testimonial.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
              
              {/* Real Reviews from Supabase */}
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (sampleReviews.length + index) * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-6 relative"
                >
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-gray-200" />
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-600">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {testimonial.name}
                        {testimonial.job_title && (
                          <span className="text-sm font-normal text-gray-500 ml-2">
                            {testimonial.job_title}
                          </span>
                        )}
                      </h3>
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-gold-500 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 italic mb-4">"{testimonial.comment}"</p>
                  
                  <p className="text-sm text-gray-500">
                    Posted on {new Date(testimonial.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}