"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addAddress } from '@/services/address';
import { AddressData } from '@/types/address';
import { MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function AddAddressPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [addressData, setAddressData] = useState<AddressData>({
    province: '',
    city: '',
    district: '',
    postalCode: '',
    fullAddress: '',
    recipientName: '',
    phone: '',
    isPrimary: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setAddressData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const validateForm = (): boolean => {
    // Required fields
    const requiredFields: (keyof AddressData)[] = ['province', 'city', 'district', 'postalCode', 'fullAddress'];
    
    for (const field of requiredFields) {
      if (!addressData[field]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    
    // Validate postal code (Indonesia uses 5-digit postal codes)
    if (!/^\d{5}$/.test(addressData.postalCode)) {
      toast.error('Postal code must be 5 digits');
      return false;
    }
    
    // Phone number validation (if provided)
    if (addressData.phone && !/^(\+62|62|0)[0-9]{9,12}$/.test(addressData.phone)) {
      toast.error('Please enter a valid Indonesian phone number');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addAddress(addressData);
      toast.success('Address added successfully');
      
      // Give the toast time to be seen before redirecting
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      console.error('Error adding address:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to add address';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center">
          <Link 
            href="/profile" 
            className="flex items-center text-cyan-600 hover:text-cyan-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Profile</span>
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-8 flex items-center space-x-4">
            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-full">
              <MapPin className="h-6 w-6 text-cyan-700 dark:text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Address
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Recipient Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    id="recipientName"
                    name="recipientName"
                    value={addressData.recipientName || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={addressData.phone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 081234567890"
                  />
                </div>
              </div>
            </div>
            
            {/* Address Details */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Address Details
              </h2>
              
              <div>
                <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="fullAddress"
                  name="fullAddress"
                  value={addressData.fullAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Street name, building number, etc."
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={addressData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Kemayoran"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={addressData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Jakarta Pusat"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    value={addressData.province}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., DKI Jakarta"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={addressData.postalCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 10620"
                    maxLength={5}
                    pattern="[0-9]{5}"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">5-digit postal code</p>
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="isPrimary"
                  name="isPrimary"
                  checked={addressData.isPrimary}
                  onChange={handleChange}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Set as default address
                </label>
              </div>
            </div>
            
            {/* Submit button */}
            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 flex items-center disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}