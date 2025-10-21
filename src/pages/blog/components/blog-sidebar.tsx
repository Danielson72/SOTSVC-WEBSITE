import { motion } from 'framer-motion';
import { Search, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';

const categories = [
  'Cleaning Tips',
  'Commercial Cleaning',
  'Residential Cleaning',
  'Green Cleaning',
  'Industry News'
];

export function BlogSidebar() {
  return (
    <div className="space-y-8">
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>
        <div className="relative">
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Tag className="h-4 w-4 mr-2" />
              {category}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}