'use client'
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartPieIcon, 
  TagIcon, 
  CubeIcon, 
  UsersIcon, 
  ShoppingCartIcon,
  SunIcon,
  MoonIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '@/components/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartPieIcon },
  { name: 'Product Category', href: '/admin/category', icon: TagIcon },
  { name: 'Product Management', href: '/admin/product', icon: CubeIcon },
  { name: 'User Management', href: '/admin/user', icon: UsersIcon },
  { name: 'Transaction Management', href: '/admin/transactions', icon: ShoppingCartIcon },
  { name: 'POS Management', href: '/admin/pos', icon: ShoppingCartIcon },
  { name: 'Back To Home', href: '/', icon: HomeIcon },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
      logout();
      router.push('/login');
    };

    const toggleSidebar = () => {
      if (window.innerWidth >= 768) {
        setIsCollapsed(!isCollapsed);
      } else {
        setIsMobileOpen(!isMobileOpen);
      }
    };

    const SidebarContent = ({ isMobile = false }) => (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <motion.div
            initial={false}
            animate={{ opacity: isCollapsed && !isMobile ? 0 : 1 }}
            className="flex items-center"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              {!isCollapsed || isMobile ? 'DK Mandiri' : ''}
            </h2>
          </motion.div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isCollapsed || isMobileOpen ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-3 text-sm font-medium rounded-lg
                  ${isActive 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }
                `}
                onClick={() => isMobile && setIsMobileOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {(!isCollapsed || isMobile) && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="flex items-center w-full px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-500" />
            )}
            {(!isCollapsed || isMobile) && (
              <span className="ml-3">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 mt-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 rounded-lg"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            {(!isCollapsed || isMobile) && (
              <span className="ml-3">Logout</span>
            )}
          </button>
        </div>
      </div>
    );

    return (
      <>
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ 
            width: isCollapsed ? '5rem' : '16rem',
            x: 0
          }}
          className="hidden md:flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        >
          <SidebarContent />
        </motion.div>

        <AnimatePresence>
          {(isMobileOpen || isCollapsed) && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleSidebar}
                className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: isMobileOpen ? '-100%' : '0%' }}
                animate={{ x: '0%' }}
                exit={{ x: '-100%' }}
                transition={{ 
                  type: 'spring', 
                  damping: 25, 
                  stiffness: 200 
                }}
                className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 md:hidden"
              >
                <SidebarContent isMobile />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
}