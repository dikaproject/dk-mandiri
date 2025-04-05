import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompleteOrderModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSubmit: (transactionId: string, data: { staffName: string, notes: string }) => Promise<void>;
}

export default function CompleteOrderModal({ isOpen, transaction, onClose, onSubmit }: CompleteOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    staffName: '',
    notes: ''
  });
  const [errors, setErrors] = useState({
    staffName: ''
  });

  if (!isOpen || !transaction) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (name === 'staffName' && errors.staffName) {
      setErrors(prev => ({ ...prev, staffName: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = { staffName: '' };
    let isValid = true;
    
    if (!formData.staffName.trim()) {
      newErrors.staffName = 'Staff name is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(transaction.id, {
        staffName: formData.staffName.trim(),
        notes: formData.notes.trim()
      });
      
      // Reset form
      setFormData({
        staffName: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error completing order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const customerName = transaction?.order?.user?.name || 'Customer';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <CheckCircle size={20} className="mr-2" />
              Complete Offline Order
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4">
            <div className="mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Order Information</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Customer:</strong> {customerName}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Order ID:</strong> {transaction.order.id.slice(0, 8)}...
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="staffName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Staff Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="staffName"
                  name="staffName"
                  value={formData.staffName}
                  onChange={handleChange}
                  placeholder="Enter staff name handling this transaction"
                  className={`w-full px-3 py-2 border ${
                    errors.staffName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  disabled={isSubmitting}
                />
                {errors.staffName && (
                  <p className="mt-1 text-sm text-red-500">{errors.staffName}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transaction Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any notes about this transaction"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm flex items-center justify-center min-w-[140px] disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <CheckCircle size={16} className="mr-1" />
                      Complete Order
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}