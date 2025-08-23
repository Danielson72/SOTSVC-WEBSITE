import { motion } from 'framer-motion';
import { BlogPost } from './components/blog-post';
import { BlogSidebar } from './components/blog-sidebar';

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <BlogPost
                title="Essential Spring Cleaning Tips"
                excerpt="Get your home ready for spring with these professional cleaning tips..."
                image="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
                date="March 15, 2024"
                author="Daniel Alvarez"
              />
              <BlogPost
                title="Commercial Cleaning Best Practices"
                excerpt="Learn about the latest commercial cleaning techniques..."
                image="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50"
                date="March 10, 2024"
                author="Daniel Alvarez"
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}