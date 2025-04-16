'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Scale, ShoppingCart, ArrowLeft, Loader2, InfoIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProductBySlug } from '@/services/product';
import { addToCart } from '@/services/cart';
import { Product } from '@/types/product';
import { formatToIDR } from '@/utils/formatter';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useAuth } from '@/context/AuthContext';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [weight, setWeight] = useState<number>(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await getProductBySlug(slug);
        setProduct(data);
        setSelectedImage(data.primaryImage || null);
        
        // Set default weight to minimum order weight
        setWeight(data.minOrderWeight);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Produk tidak ditemukan atau terjadi kesalahan.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [slug]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeight = parseInt(e.target.value);
    if (isNaN(newWeight) || newWeight < 0) {
      setWeight(0);
    } else {
      setWeight(newWeight);
    }
  };

  const decrementWeight = (amount: number) => {
    const newWeight = weight - amount;
    // Jangan langsung batasi dengan minOrderWeight, tapi gunakan validasi terpisah
    setWeight(Math.max(newWeight, 0));
  };
  
  // 2. Perbaikan fungsi incrementWeight
  const incrementWeight = (amount: number) => {
    const newWeight = weight + amount;
    // Jangan langsung batasi dengan weightInStock, tapi gunakan validasi terpisah
    setWeight(newWeight);
  };

  const isWeightValid = () => {
    if (!product) return false;
    return weight >= product.minOrderWeight && weight <= product.weightInStock;
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu untuk menambahkan ke keranjang');
      router.push('/login');
      return;
    }
    
    if (!product || !isWeightValid()) {
      toast.error('Berat tidak valid');
      return;
    }
    
    try {
      setIsAddingToCart(true);
      await addToCart({
        productId: product.id,
        weight: weight
      });
      
      toast.success('Produk berhasil ditambahkan ke keranjang');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Gagal menambahkan ke keranjang');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <Loader2 size={40} className="animate-spin text-cyan-600" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center">
          <div className="text-red-500 text-center mb-4">{error || 'Produk tidak ditemukan'}</div>
          <button
            onClick={() => router.push('/product')}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Produk
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const totalPrice = (product.price / 1000) * weight;

  return (
    <>
      <Navbar />
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/product')}
              className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              <ArrowLeft size={16} className="mr-1" />
              Kembali ke Daftar Produk
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative h-80 w-full rounded-lg overflow-hidden">
                  <Image
                    src={selectedImage || product.primaryImage || '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                
                {/* Thumbnail Images */}
                {(product.additionalImages?.length || 0) > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {/* Primary Image Thumbnail */}
                    {product.primaryImage && (
                      <div 
                        className={`relative h-16 w-16 rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === product.primaryImage ? 'border-cyan-500' : 'border-transparent'}`}
                        onClick={() => setSelectedImage(product.primaryImage || null)}
                      >
                        <Image
                          src={product.primaryImage}
                          alt={`${product.name} - primary`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Additional Images Thumbnails */}
                    {product.additionalImages?.map((imgUrl, idx) => (
                      <div 
                        key={idx}
                        className={`relative h-16 w-16 rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === imgUrl ? 'border-cyan-500' : 'border-transparent'}`}
                        onClick={() => setSelectedImage(imgUrl)}
                      >
                        <Image
                          src={imgUrl}
                          alt={`${product.name} - ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div className="flex flex-col space-y-6">
                {/* Product Name and Category */}
                <div>
                  {product.category && (
                    <span className="text-sm text-cyan-600 dark:text-cyan-400 mb-2">
                      {product.category.name}
                    </span>
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {product.name}
                  </h1>
                </div>
                
                {/* Price */}
                <div>
                  <span className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">
                    {formatToIDR(product.price)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 ml-1">per kg</span>
                </div>
                
                {/* Description */}
                <div className="prose dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                </div>
                
                {/* Stock Info */}
                <div className="bg-cyan-50 dark:bg-cyan-900/30 rounded-lg p-4 flex items-start">
                  <InfoIcon className="text-cyan-600 dark:text-cyan-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-medium text-cyan-800 dark:text-cyan-300">Informasi Stok</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Tersedia: <span className="font-medium">{(product.weightInStock / 1000).toFixed(1)} kg</span>
                      <br />
                      Minimal pemesanan: <span className="font-medium">{(product.minOrderWeight / 1000).toFixed(1)} kg</span>
                    </p>
                  </div>
                </div>
                
                {/* Weight Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pilih Berat (gram)
                  </label>
                  
                  <div className="flex items-center">
                    <button
                      onClick={() => decrementWeight(100)}
                      className="h-10 w-10 flex items-center justify-center rounded-l-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      // Hanya disable jika weight setelah pengurangan akan di bawah 0
                      disabled={weight <= 100}
                    >
                      -
                    </button>
                    
                    <input
                      type="number"
                      value={weight}
                      onChange={handleWeightChange}
                      min={product.minOrderWeight}
                      max={product.weightInStock}
                      step={100}
                      className="h-10 w-24 px-2 text-center border-y border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    
                    <button
                      onClick={() => incrementWeight(100)}
                      className="h-10 w-10 flex items-center justify-center rounded-r-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      // Jangan gunakan weightInStock sebagai batasan langsung
                      disabled={product && (weight + 100) > product.weightInStock}
                    >
                      +
                    </button>
                    
                    <div className="ml-3 flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <Scale size={16} />
                      <span className="text-sm">{(weight / 1000).toFixed(1)} kg</span>
                    </div>
                  </div>
                  
                  {product && weight < product.minOrderWeight && (
                    <p className="text-red-500 text-sm">
                      Minimal pemesanan {product.minOrderWeight} gram ({(product.minOrderWeight / 1000).toFixed(1)} kg)
                    </p>
                  )}
                  
                  {product && weight > product.weightInStock && (
                    <p className="text-red-500 text-sm">
                      Stok yang tersedia hanya {product.weightInStock} gram ({(product.weightInStock / 1000).toFixed(1)} kg)
                    </p>
                  )}
                </div>
                
                {/* Total Price */}
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  Total: {formatToIDR(totalPrice)}
                </div>
                
                {/* Add to Cart Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!isWeightValid() || isAddingToCart}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium
                    ${isWeightValid() 
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                      : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    }`}
                >
                  {isAddingToCart ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={20} />
                  )}
                  Tambahkan ke Keranjang
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}