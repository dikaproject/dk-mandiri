'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
  Tag
} from 'lucide-react';
import { getAllProducts, deleteProduct } from '@/services/product';
import { Product } from '@/types/product';
import { toast } from 'react-hot-toast';

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const itemsPerPage = 8;
  const router = useRouter();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(p => p.category?.id || '')))
    .filter(Boolean)
    .map(id => {
      const product = products.find(p => p.category?.id === id);
      return {
        id,
        name: product?.category?.name || ''
      };
    });

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || product.category?.id === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Delete product
  const handleDeleteClick = (id: string) => {
    setDeleteConfirm(id);
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="p-6 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Products
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/admin/product/create')}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Plus size={16} className="mr-1" />
            Add Product
          </motion.button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="w-full md:w-64">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={18} className="text-gray-400" />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="pl-10 w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 size={36} className="animate-spin text-blue-600" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700"
                  >
                    <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images.find(img => img.isPrimary)?.imageUrl || product.images[0].imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package size={48} className="text-gray-400" />
                        </div>
                      )}
                      <div 
                        className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${
                          product.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.isAvailable ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                    
                    <div className="p-4">
                    <div className="flex items-center justify-between">
  <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
    {product.category?.name || 'Uncategorized'}
  </span>
  <span className="text-sm text-gray-500 dark:text-gray-400">
    Stock: {product.weightInStock}g
  </span>
</div>
<h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white line-clamp-1">
  {product.name}
</h3>
<p className="mt-1 text-gray-600 dark:text-gray-300 text-lg font-semibold">
  Rp {product.price.toLocaleString()}/kg
</p>
<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
  Min order: {product.minOrderWeight}g
</p>
                      
                      <div className="mt-4 flex items-center justify-between">
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center space-x-2 w-full">
                            <span className="text-gray-500 dark:text-gray-400 text-xs mr-1">Delete?</span>
                            <button
                              onClick={() => handleConfirmDelete(product.id)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-800 dark:hover:text-red-400 text-xs font-medium"
                            >
                              {isDeleting ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                "Yes"
                              )}
                            </button>
                            <button
                              onClick={handleCancelDelete}
                              className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-400 text-xs font-medium"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => router.push(`/admin/product/edit/${product.id}`)}
                              className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 flex items-center"
                            >
                              <Edit size={16} className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product.id)}
                              className="text-red-600 hover:text-red-800 dark:hover:text-red-400 flex items-center"
                            >
                              <Trash2 size={16} className="mr-1" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {searchTerm || filterCategory ? 'Try adjusting your filters' : 'Start by adding a product'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredProducts.length > itemsPerPage && (
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                      page === currentPage 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}