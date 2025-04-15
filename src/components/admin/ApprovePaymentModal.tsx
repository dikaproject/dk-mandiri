'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, RefreshCw, Image } from 'lucide-react';

interface ApprovePaymentModalProps {
  isOpen: boolean;
  transaction: any | null;
  onClose: () => void;
  onSubmit: (transactionId: string, data: { staffName: string, notes: string }) => Promise<void>;
  onViewProof?: (proofUrl: string) => void;
}

export default function ApprovePaymentModal({ 
  isOpen, 
  transaction, 
  onClose, 
  onSubmit,
  onViewProof
}: ApprovePaymentModalProps) {
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
      console.error('Error approving payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Verifikasi Pembayaran
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          {/* Payment details */}
          <div className="mb-4 bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">
              Konfirmasi bahwa pembayaran telah diterima:
            </p>
            
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">Order #{transaction.order.orderNumber}</span></p>
              <p><span className="font-medium">Jumlah:</span> Rp {Number(transaction.amount).toLocaleString('id')}</p>
              <p><span className="font-medium">Metode:</span> {transaction.paymentMethod}</p>
            </div>
            
            {transaction.paymentProof && (
              <div className="mt-2">
                <button
                  onClick={() => onViewProof && onViewProof(transaction.paymentProof)}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Image className="h-4 w-4 mr-1" />
                  Lihat Bukti Pembayaran
                </button>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Staff Verifikasi<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="staffName"
                  value={formData.staffName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.staffName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="Nama staff yang memverifikasi pembayaran"
                />
                {errors.staffName && (
                  <p className="mt-1 text-sm text-red-500">{errors.staffName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catatan (Opsional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Catatan tambahan tentang verifikasi"
                ></textarea>
              </div>
              
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <p>Notifikasi WhatsApp akan dikirim ke pelanggan saat Anda memverifikasi pembayaran ini.</p>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Memproses...
                    </span>
                  ) : (
                    'Verifikasi Pembayaran'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}