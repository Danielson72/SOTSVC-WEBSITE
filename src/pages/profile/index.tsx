import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface Transaction {
  id: string;
  type: 'appointment' | 'purchase';
  date: string;
  amount: number;
  description: string;
  status: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    async function loadTransactions() {
      try {
        // Load appointments
        const { data: appointments } = await supabase
          .from('bookings')
          .select('*')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false });

        // Load purchases
        const { data: purchases } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Combine and format transactions
        const formattedTransactions = [
          ...(appointments || []).map(apt => ({
            id: apt.id,
            type: 'appointment' as const,
            date: new Date(apt.scheduled_date).toLocaleDateString(),
            amount: 0, // Add amount if available
            description: `${apt.service_type} - ${apt.square_footage} sq ft`,
            status: apt.status
          })),
          ...(purchases || []).map(purchase => ({
            id: purchase.id,
            type: 'purchase' as const,
            date: new Date(purchase.purchase_date).toLocaleDateString(),
            amount: purchase.price,
            description: purchase.service_type,
            status: 'completed'
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTransactions();
  }, [user, navigate]);

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-sm mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary-50 rounded-full">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.full_name}
              </h1>
              <p className="text-gray-500">Customer Profile</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{profile.phone}</span>
            </div>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Transaction History
            </h2>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {transaction.type === 'appointment' ? (
                        <Calendar className="h-5 w-5 text-primary-600" />
                      ) : (
                        <DollarSign className="h-5 w-5 text-green-600" />
                      )}
                      <span className="font-medium text-gray-900">
                        {transaction.description}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {transaction.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    {transaction.amount > 0 && (
                      <span className="text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </span>
                    )}
                    <span className={`text-sm ${
                      transaction.status === 'completed' ? 'text-green-600' :
                      transaction.status === 'pending' ? 'text-yellow-600' :
                      transaction.status === 'cancelled' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/services')}
          >
            Book New Service
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/contact')}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}