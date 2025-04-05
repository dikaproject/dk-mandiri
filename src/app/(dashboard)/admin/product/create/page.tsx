'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Upload, 
  X, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { createProduct, uploadProductImage } from '@/services/product';
import { getAllCategories } from '@/services/category';
import { Category } from '@/types/category';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { formatToIDR, unformatFromIDR } from '@/utils/formatter';

export default function CreateProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    costPrice: '',     // Added cost price field
    weightInStock: '', 
    minOrderWeight: '', 
    categoryId: '',
    isAvailable: true
  });
  
  // For image upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
        // Set the first category as default if available
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'costPrice') {  // Handle both price fields
      // Remove existing formatting first
      const unformatted = unformatFromIDR(value);
      
      // Only allow numbers and decimal point for price
      if (!/^[0-9]*\.?[0-9]*$/.test(unformatted) && unformatted !== '') {
        return;
      }
      
      // Apply formatting
      setFormData(prev => ({ 
        ...prev, 
        [name]: formatToIDR(unformatted)
      }));
      return;
    }
    
    // Handle other numeric inputs
    if (name === 'weightInStock' || name === 'minOrderWeight') {
      if (!/^[0-9]*\.?[0-9]*$/.test(value) && value !== '') {
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Validate files
    const validFiles = newFiles.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Only JPG, PNG, WebP and GIF are allowed.`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Set selected files
    setSelectedFiles([...selectedFiles, ...validFiles]);

    // Generate preview URLs for the images
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);

    // Auto-select the first image as primary if none selected yet
    if (primaryImageIndex === null && selectedFiles.length === 0) {
      setPrimaryImageIndex(0);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index]);
    
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewImages];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviewImages(newPreviews);
    
    // Update primary image index if needed
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(newFiles.length > 0 ? 0 : null);
    } else if (primaryImageIndex !== null && primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const setPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
      isValid = false;
    }

    if (!formData.price || parseFloat(unformatFromIDR(formData.price)) <= 0) {
      newErrors.price = 'Valid selling price is required';
      isValid = false;
    }

    if (!formData.costPrice || parseFloat(unformatFromIDR(formData.costPrice)) <= 0) {
      newErrors.costPrice = 'Valid cost price is required';
      isValid = false;
    }

    // Validate that cost price is not greater than selling price
    if (formData.price && formData.costPrice) {
      const sellingPrice = parseFloat(unformatFromIDR(formData.price));
      const costPrice = parseFloat(unformatFromIDR(formData.costPrice));
      
      if (costPrice > sellingPrice) {
        newErrors.costPrice = 'Cost price cannot be greater than selling price';
        isValid = false;
      }
    }

    if (!formData.weightInStock || parseFloat(formData.weightInStock) <= 0) {
      newErrors.weightInStock = 'Valid stock weight is required';
      isValid = false;
    }
  
    if (!formData.minOrderWeight || parseFloat(formData.minOrderWeight) <= 0) {
      newErrors.minOrderWeight = 'Valid minimum order weight is required';
      isValid = false;
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
      isValid = false;
    }

    if (selectedFiles.length === 0) {
      newErrors.images = 'At least one image is required';
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
      // Create product first
      const product = await createProduct({
        name: formData.name.trim(),
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description.trim(),
        price: parseFloat(unformatFromIDR(formData.price)),
        costPrice: parseFloat(unformatFromIDR(formData.costPrice)), // Add cost price
        weightInStock: parseFloat(formData.weightInStock),
        minOrderWeight: parseFloat(formData.minOrderWeight),
        categoryId: formData.categoryId,
        isAvailable: formData.isAvailable
      });
      
      // Then upload images
      const uploadPromises = selectedFiles.map((file, index) => {
        return uploadProductImage(
          product.id, 
          file,
          index === primaryImageIndex
        );
      });

      await Promise.all(uploadPromises);
      
      toast.success('Product created successfully');
      router.push('/admin/product');
    } catch (error: any) {
      console.error('Failed to create product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate profit margin
  const calculateProfitMargin = () => {
    if (!formData.price || !formData.costPrice) return null;
    
    const sellingPrice = parseFloat(unformatFromIDR(formData.price));
    const costPrice = parseFloat(unformatFromIDR(formData.costPrice));
    
    if (isNaN(sellingPrice) || isNaN(costPrice) || costPrice === 0) return null;
    
    const profit = sellingPrice - costPrice;
    const margin = (profit / sellingPrice) * 100;
    
    return margin.toFixed(2);
  };

  const profitMargin = calculateProfitMargin();

  return (
    <div className="p-6 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Products
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Product
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slug URL
                </label>
                <div className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">
                  <span className="text-sm">{formData.slug || (formData.name ? generateSlug(formData.name) + '...' : 'Generated from product name')}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The URL-friendly version of the name that will be used in product URLs. Generated automatically.
                </p>
              </div>

              {/* Selling Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Selling Price (Rp) per KG <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full px-3 py-2 border ${
                    errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Cost Price */}
              <div>
                <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cost Price (Rp) per KG <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="costPrice"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full px-3 py-2 border ${
                    errors.costPrice ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.costPrice && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.costPrice}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Purchase price (not visible to customers)
                </p>
              </div>

              {/* Profit Margin (calculated) */}
              {profitMargin && (
                <div className="col-span-2 md:col-span-2">
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-900 rounded-md p-3">
                    <p className="text-sm text-green-800 dark:text-green-200 flex items-center">
                      <span className="font-medium">Profit Margin:</span>
                      <span className="ml-2">{profitMargin}%</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Weight in Stock */}
              <div>
                <label htmlFor="weightInStock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock Weight (grams) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="weightInStock"
                  name="weightInStock"
                  value={formData.weightInStock}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-3 py-2 border ${
                    errors.weightInStock ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.weightInStock && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.weightInStock}
                  </p>
                )}
              </div>
              
              {/* Min Order Weight */}
              <div>
                <label htmlFor="minOrderWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Order Weight (grams) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="minOrderWeight"
                  name="minOrderWeight"
                  value={formData.minOrderWeight}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-3 py-2 border ${
                    errors.minOrderWeight ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.minOrderWeight && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.minOrderWeight}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.categoryId}
                  </p>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Available for sale
                </label>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>

              {/* Image Upload - remains the same */}
              {/* ... Keep the existing image upload code ... */}
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm flex items-center justify-center min-w-[120px] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  'Create Product'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}