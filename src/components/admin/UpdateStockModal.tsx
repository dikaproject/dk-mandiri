'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Package, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateProductStock } from '@/services/product';
import { Button } from '@/components/ui/button';

interface UpdateStockModalProps {
  isOpen: boolean;
  product: {
    id: string;
    name: string;
    weightInStock: number;
  } | null;
  onClose: () => void;
  onSuccess: (productId: string, newStock: number) => void;
}

export default function UpdateStockModal({ isOpen, product, onClose, onSuccess }: UpdateStockModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockValue, setStockValue] = useState<string>('');
  const [addToExisting, setAddToExisting] = useState(false);

  // Reset form when modal opens with new product or mode changes
  useEffect(() => {
    if (isOpen && product) {
      if (!addToExisting) {
        setStockValue(product.weightInStock.toString());
      } else {
        setStockValue('');
      }
    }
  }, [isOpen, product, addToExisting]);

  if (!isOpen || !product) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure only numbers are entered
    if (/^[0-9]*$/.test(value) || value === '') {
      setStockValue(value);
    }
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddToExisting(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stockValue) {
      toast.error('Please enter a valid stock amount');
      return;
    }
    
    const newStockValue = parseInt(stockValue, 10);
    if (isNaN(newStockValue) || newStockValue < 0) {
      toast.error('Please enter a valid stock amount');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate final stock value based on mode - PERBAIKAN DISINI
      const finalStock = addToExisting 
        ? Number(product.weightInStock) + Number(newStockValue) // Pastikan keduanya adalah Number
        : newStockValue;
      
      // Tambahkan log untuk debugging
      console.log('Current stock:', product.weightInStock, 'typeof:', typeof product.weightInStock);
      console.log('Adding:', newStockValue, 'typeof:', typeof newStockValue);
      console.log('Final stock:', finalStock, 'typeof:', typeof finalStock);
      
      await updateProductStock(product.id, finalStock);
      onSuccess(product.id, finalStock);
      toast.success('Stock updated successfully');
      onClose();
    } catch (error) {
      console.error('Failed to update stock:', error);
      toast.error('Failed to update stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate new total properly
  const calculateNewTotal = () => {
    const inputValue = parseInt(stockValue, 10);
    if (!isNaN(inputValue) && inputValue >= 0) {
      // Ensure we're doing addition with numbers, not string concatenation
      return Number(product.weightInStock) + Number(inputValue);
    }
    return product.weightInStock;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Package className="mr-2 h-5 w-5 text-blue-500" />
            Update Stock Quantity
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Current stock: {product.weightInStock}g
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="addMode"
                checked={addToExisting}
                onChange={handleModeChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="addMode" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {addToExisting ? 'Add to existing stock' : 'Set exact stock value'}
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {addToExisting ? 'Quantity to add (grams)' : 'New stock quantity (grams)'}
              </label>
              <input
                type="text"
                value={stockValue}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder={addToExisting ? "Enter amount to add" : "Enter new stock amount"}
              />
            </div>
            
            {addToExisting && stockValue !== '' && !isNaN(parseInt(stockValue, 10)) && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                New total will be: {Number(product.weightInStock) + Number(parseInt(stockValue, 10))}g
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || stockValue === ''}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Update Stock
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}