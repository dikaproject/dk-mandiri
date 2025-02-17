'use client';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import DashboardSection from '@/components/section/admin-dashboard/DashboardSection';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back, {user?.username}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            This is your admin dashboard.
          </p>
        </div>

        <DashboardSection />
      </motion.div>
    </div>
  );
}