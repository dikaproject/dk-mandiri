'use client';
import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Upload, 
  X, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { getProductById, updateProduct, uploadProductImage, deleteProductImage, setPrimaryImage } from '@/services/product';
import { getAllCategories } from '@/services/category';
import { Category } from '@/types/category';
import { ProductImage, Product } from '@/types/product';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { formatToIDR, unformatFromIDR } from '@/utils/formatter';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    costPrice: '',       // Tambahkan cost price field
    weightInStock: '',
    minOrderWeight: '',
    categoryId: '',
    isAvailable: true
  });
  
  // For existing images
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  
  // For new image upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [primaryImageId, setPrimaryImageId] = useState<string | null>(null);
  const [newPrimaryImageIndex, setNewPrimaryImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();

  // Fetch product data and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [product, categoriesData] = await Promise.all([
          getProductById(id),
          getAllCategories()
        ]);
        
        // Set form data with formatted price
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          price: formatToIDR(product.price),
          costPrice: formatToIDR(product.costPrice),  // Format cost price
          weightInStock: product.weightInStock.toString(),
          minOrderWeight: product.minOrderWeight.toString(),
          categoryId: product.category?.id || '',
          isAvailable: product.isAvailable
        });
        
        // Set existing images
        setExistingImages(product.images || []);
        
        // Find primary image
        const primaryImage = product.images.find(img => img.isPrimary);
        if (primaryImage) {
          setPrimaryImageId(primaryImage.id);
        }
        
        // Set categories
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch product data:', error);
        toast.error('Failed to load product data');
        router.push('/admin/product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Function to calculate profit margin
  const calculateProfitMargin = () => {
    if (!formData.price || !formData.costPrice) return null;
    
    const sellingPrice = parseFloat(unformatFromIDR(formData.price));
    const costPrice = parseFloat(unformatFromIDR(formData.costPrice));
    
    if (isNaN(sellingPrice) || isNaN(costPrice) || costPrice === 0) return null;
    
    const profit = sellingPrice - costPrice;
    const margin = (profit / sellingPrice) * 100;
    
    return margin.toFixed(2);
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

    // Auto-select the first new image as primary if no existing primary and no new primary selected yet
    if (primaryImageId === null && newPrimaryImageIndex === null && existingImages.length === 0 && selectedFiles.length === 0) {
      setNewPrimaryImageIndex(0);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeNewImage = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index]);
    
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewImages];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviewImages(newPreviews);
    
    // Update primary image index if needed
    if (newPrimaryImageIndex === index) {
      setNewPrimaryImageIndex(newFiles.length > 0 ? 0 : null);
    } else if (newPrimaryImageIndex !== null && newPrimaryImageIndex > index) {
      setNewPrimaryImageIndex(newPrimaryImageIndex - 1);
    }
  };

  const handleDeleteExistingImage = async (imageId: string) => {
    try {
      setIsDeletingImage(true);
      await deleteProductImage(imageId);
      
      // Update state to remove the deleted image
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      
      // If the deleted image was the primary, reset primaryImageId
      if (primaryImageId === imageId) {
        setPrimaryImageId(null);
      }
      
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image');
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleSetExistingAsPrimary = async (imageId: string) => {
    try {
      setIsDeletingImage(true); // Reusing loading state
      await setPrimaryImage(imageId);
      
      // Update local state
      setPrimaryImageId(imageId);
      setNewPrimaryImageIndex(null); // Reset new primary selection
      
      // Update isPrimary flags on existing images
      setExistingImages(prev => prev.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      })));
      
      toast.success('Primary image updated');
    } catch (error) {
      console.error('Failed to set primary image:', error);
      toast.error('Failed to update primary image');
    } finally {
      setIsDeletingImage(false);
    }
  };

  const setNewImageAsPrimary = (index: number) => {
    setNewPrimaryImageIndex(index);
    setPrimaryImageId(null); // Reset existing primary selection
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

    // Only validate images if there are no existing images and no new images
    if (existingImages.length === 0 && selectedFiles.length === 0) {
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
      // Update product first
      await updateProduct(id, {
        name: formData.name.trim(),
        slug: formData.slug,
        description: formData.description.trim(),
        price: parseFloat(unformatFromIDR(formData.price)),
        costPrice: parseFloat(unformatFromIDR(formData.costPrice)),  // Update with cost price
        weightInStock: parseFloat(formData.weightInStock),
        minOrderWeight: parseFloat(formData.minOrderWeight),
        categoryId: formData.categoryId,
        isAvailable: formData.isAvailable
      });
      
      // Then upload new images if any
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map((file, index) => {
          return uploadProductImage(
            id, 
            file,
            // Set isPrimary if this is the selected new image and no existing image is primary
            index === newPrimaryImageIndex && primaryImageId === null
          );
        });
        
        await Promise.all(uploadPromises);
      }
      
      toast.success('Product updated successfully');
      router.push('/admin/product');
    } catch (error: any) {
      console.error('Failed to update product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate profit margin for display
  const profitMargin = calculateProfitMargin();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Loader2 size={30} className="animate-spin text-blue-600 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Loading product data...</p>
        </div>
      </div>
    );
  }

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
              Edit Product
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

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price (Rp) Per KG <span className="text-red-500">*</span>
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
                  Cost Price (Rp) Per KG <span className="text-red-500">*</span>
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

              {/* Stock */}
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

              {/* Weight */}
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

              {/* Current Images */}
              {existingImages.length > 0 && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Images
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Click on an image to set it as primary
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {existingImages.map((image) => (
                      <div 
                        key={image.id} 
                        className={`relative rounded-md overflow-hidden border-2 ${
                          primaryImageId === image.id 
                            ? 'border-blue-500 dark:border-blue-400' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => handleSetExistingAsPrimary(image.id)}
                      >
                        <div className="aspect-w-1 aspect-h-1 w-full">
                          <Image 
                            src={image.imageUrl} 
                            alt={`Product image ${image.id}`}
                            width={200}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={isDeletingImage}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExistingImage(image.id);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none disabled:opacity-50"
                        >
                          {isDeletingImage ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                        </button>
                        {primaryImageId === image.id && (
                          <div className="absolute bottom-1 left-1 p-1 bg-blue-500 text-white rounded-full">
                            <CheckCircle2 size={14} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {existingImages.length > 0 ? 'Add New Images' : 'Product Images'} 
                  {existingImages.length === 0 && <span className="text-red-500">*</span>}
                </label>
                
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span className="inline-flex items-center px-3 py-1.5">
                          <Upload size={16} className="mr-1" />
                          Browse files
                        </span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          ref={fileInputRef}
                          className="sr-only" 
                          multiple 
                          accept="image/png, image/jpeg, image/webp, image/gif"
                          onChange={handleFileChange} 
                        />
                      </label>
                      <p className="pl-1 pt-1.5">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, WebP or GIF up to 5MB
                    </p>
                  </div>
                </div>
                
                {errors.images && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.images}
                  </p>
                )}

                {/* Preview of new images */}
                {previewImages.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Images
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Click on an image to set it as primary
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {previewImages.map((preview, index) => (
                        <div 
                          key={index} 
                          className={`relative rounded-md overflow-hidden border-2 ${
                            newPrimaryImageIndex === index 
                              ? 'border-blue-500 dark:border-blue-400' 
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                          onClick={() => setNewImageAsPrimary(index)}
                        >
                          <div className="aspect-w-1 aspect-h-1 w-full">
                            <Image 
                              src={preview} 
                              alt={`New image ${index}`}
                              width={200}
                              height={200}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNewImage(index);
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                          >
                            <X size={12} />
                          </button>
                          {newPrimaryImageIndex === index && (
                            <div className="absolute bottom-1 left-1 p-1 bg-blue-500 text-white rounded-full">
                              <CheckCircle2 size={14} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                  'Update Product'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}