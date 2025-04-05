'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, User, Lock, Phone, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { register } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const { setAuth } = useAuth();
  const router = useRouter();

  // Format and validate phone number
  const validateAndFormatPhone = (phoneNumber: string) => {
    // Remove all non-digit characters except leading '+'
    let cleaned = phoneNumber.trim();
    
    // If empty, allow it (phone is optional)
    if (!cleaned) return { isValid: true, formattedNumber: '' };
    
    // Check for valid formats
    // Indonesian mobile numbers start with +62 8... or 08...
    const indonesianMobileRegex = /^(\+62|62|0)8[1-9][0-9]{6,12}$/;
    
    if (indonesianMobileRegex.test(cleaned.replace(/[\s-]/g, ''))) {
      // Format to standard +62 format
      if (cleaned.startsWith('0')) {
        cleaned = '+62' + cleaned.substring(1).replace(/[\s-]/g, '');
      } else if (cleaned.startsWith('62')) {
        cleaned = '+' + cleaned.replace(/[\s-]/g, '');
      } else if (cleaned.startsWith('+62')) {
        cleaned = cleaned.replace(/[\s-]/g, '');
      }
      
      return { isValid: true, formattedNumber: cleaned };
    }
    
    return { 
      isValid: false, 
      formattedNumber: phoneNumber,
      error: 'Please enter a valid Indonesian phone number (e.g., +628123456789 or 08123456789)'
    };
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneInput = e.target.value;
    const { isValid, formattedNumber, error } = validateAndFormatPhone(phoneInput);
    
    setFormData({ ...formData, phone: formattedNumber });
    
    if (!isValid) {
      setErrors({...errors, phone: error || 'Invalid phone number'});
    } else {
      const newErrors = {...errors};
      delete newErrors.phone;
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Reset errors
      const newErrors: {[key: string]: string} = {};
      let hasErrors = false;
      
      // Validate data format before sending
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
        hasErrors = true;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        hasErrors = true;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
        hasErrors = true;
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
        hasErrors = true;
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        hasErrors = true;
      }
      
      // If phone is provided, validate it
      if (formData.phone) {
        const { isValid, error } = validateAndFormatPhone(formData.phone);
        if (!isValid) {
          newErrors.phone = error || 'Invalid phone number';
          hasErrors = true;
        }
      }
      
      setErrors(newErrors);
      if (hasErrors) {
        setIsLoading(false);
        return;
      }
      
      // Prepare data - only send phone if it's not empty
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        ...(formData.phone && { phone: formData.phone })
      };
      
      const response = await register(registerData);
      console.log('Registration response:', response); // Debug log
      
      if (response && response.token && response.user) {
        setAuth(response.user, response.token);
        toast.success('Registration successful!');
        router.push('/');
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      {/* Background with waves */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-blue-900 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Join DK-Mandiri community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                placeholder='Masukan Username Anda'
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.username}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500`}
                  placeholder='Masukan Email Anda'
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500`}
                  placeholder="+628xxxxxxxxxx or 08xxxxxxxxxx"
                />
              </div>
              {errors.phone ? (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.phone}
                </p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">
                  Format: +628xxxxxxxxxx or 08xxxxxxxxxx
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  placeholder='Masukan Password Anda'
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-10 pr-12 py-2 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}