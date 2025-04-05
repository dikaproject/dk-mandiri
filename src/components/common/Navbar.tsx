'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, LogOut, User, Settings, ChevronDown, Home, Info, Package, Users, Globe, Mail, X, ShoppingCart } from 'lucide-react';
import { useTheme } from '@/components/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'home', icon: Home, href: '/' },
    { name: 'about', icon: Info, href: '/about' },
    { name: 'products', icon: Package, href: '/product' },
    { name: 'partners', icon: Users, href: '/partners' },
    { name: 'community', icon: Globe, href: '/community' },
    { name: 'contact', icon: Mail, href: '/contact' },
    { name: 'assistant', icon: Globe, href: '/assistant' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed w-full z-[100] transition-all duration-300 ${isScrolled
          ? 'dark:bg-gray-900/90 bg-white/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent hover:from-blue-700 hover:to-teal-600 transition-all duration-300"
            >
              DK-Mandiri
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative group text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                <span className="capitalize">{item.name}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                >
                  <span className="text-gray-700 dark:text-gray-300">{user.username}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                        >
                          <Settings className="h-4 w-4" />
                          Dashboard
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
              <Link
                href="/login"
                className="relative overflow-hidden px-6 py-2 rounded-md group bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-700 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              </>     
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-50 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    transition={{ duration: 0.3 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    transition={{ duration: 0.3 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </AnimatePresence>
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm md:hidden z-[90]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] md:hidden bg-white dark:bg-gray-900 shadow-2xl z-[100] max-h-screen overflow-y-auto overscroll-y-contain"
              style={{ height: '100dvh' }}
            >
              <div className="flex flex-col h-full relative">
                <div className="sticky top-0 z-20 flex items-center justify-between p-5 border-b dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                  <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3">
                  <div className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r from-blue-50 to-teal-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Icon className="h-5 w-5 text-blue-500" />
                            <span className="capitalize">{item.name}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Add Cart Link in Mobile Menu */}
                  <div className="mt-2">
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href="/cart"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r from-blue-50 to-teal-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ShoppingCart className="h-5 w-5 text-blue-500" />
                        <span>Shopping Cart</span>
                        <div className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</div>
                      </Link>
                    </motion.div>
                  </div>

                  <div className="mt-6 px-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                  </div>

                  <div className="mt-6 px-3 space-y-3">
                    {user ? (
                      <>
                        <div className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{user.username}</p>
                        </div>
                        {user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Settings className="h-5 w-5 text-blue-500" />
                            Dashboard
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-5 w-5 text-blue-500" />
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300"
                        >
                          <LogOut className="h-5 w-5" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-700 hover:to-teal-600 transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;