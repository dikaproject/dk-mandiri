'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Fish, ShoppingCart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getTrendingProducts } from '@/services/product';
import { Product } from '@/types/product';
import { formatToIDR } from '@/utils/formatter';
import Link from 'next/link';

const ProductSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getTrendingProducts(4);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch trending products', err);
        setError('Failed to load trending products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  const formatSoldWeight = (grams: number = 0): string => {
    if (grams === 0) return '0g';
    if (grams < 1000) return `${grams}g`;
    if (grams < 10000) return `${(grams / 1000).toFixed(1)}kg`;
    return '10kg+';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="relative py-20 overflow-hidden" id="products" aria-labelledby="products-heading">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8 text-cyan-600" aria-hidden="true" />
              <h2 
                id="products-heading" 
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900"
              >
                Produk Terlaris
              </h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hasil tangkapan segar kami yang paling populer, dikirim langsung ke rumah Anda atau restoran
            </p>
          </motion.div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12" aria-live="polite" aria-busy="true">
              <Loader2 size={40} className="animate-spin text-cyan-600" />
              <span className="sr-only">Memuat produk terlaris...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8" aria-live="assertive">
              {error}
            </div>
          ) : products.length > 0 ? (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              itemScope
              itemType="https://schema.org/ItemList"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="group relative rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300"
                  itemScope
                  itemType="https://schema.org/Product"
                  itemProp="itemListElement"
                  role="article"
                  aria-label={`${product.name} - ${formatToIDR(product.price)}/kg`}
                >
                  {/* SEO Metadata */}
                  <meta itemProp="position" content={`${index + 1}`} />
                  <meta itemProp="sku" content={product.id} />
                  <meta itemProp="mpn" content={product.slug} />
                  <meta itemProp="price" content={`${product.price}`} />
                  <meta itemProp="priceCurrency" content="IDR" />
                  <meta itemProp="availability" content={product.isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
                  
                  {/* Product Image */}
                  <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                    <Image
                      src={product.primaryImage || '/products/placeholder.jpg'}
                      alt={`Ikan ${product.name} segar dari DK Mandiri Seafood`}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                      itemProp="image"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      unoptimized
                    />
                    {/* Trending Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <div className="flex items-center gap-1">
                        <Fish className="h-4 w-4 text-cyan-600" aria-hidden="true" />
                        <span className="text-sm font-medium text-cyan-700">Trending</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100" itemProp="name">{product.name}</h3>

                    {/* Total Sold Information */}
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="h-4 w-4 text-green-600" aria-hidden="true" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Terjual: <span className="font-medium text-green-600">{formatSoldWeight(product.totalSold)}</span>
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({product.totalOrders || 0} orders)
                      </span>
                    </div>

                    {/* Price and Sales */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-cyan-700" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <span itemProp="price">{formatToIDR(product.price)}</span><span itemProp="priceCurrency" content="IDR">/kg</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="h-4 w-4" aria-hidden="true" />
                        <span className="text-sm font-medium">{formatSoldWeight(product.soldThisMonth)} bulan ini</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href={`/product/${product.slug}`} aria-label={`Pesan ${product.name} sekarang`}>
                      <button className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300">
                        Order Now
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-8 text-center"
              aria-live="polite"
            >
              <div className="flex flex-col items-center space-y-4">
                <Fish className="h-16 w-16 text-cyan-600/30" aria-hidden="true" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Produk Terlaris Akan Segera Hadir!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                  Kami sedang mempersiapkan produk-produk terbaik dan paling populer untuk Anda.
                  Sementara itu, jelajahi <Link href="/products" className="text-cyan-600 hover:underline">katalog lengkap kami</Link> untuk menemukan hasil laut segar berkualitas premium.
                </p>
                <div className="mt-4">
                  <Link href="/products">
                    <button className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300">
                      Lihat Semua Produk
                    </button>
                  </Link>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Semua produk kami dipilih langsung dari nelayan lokal untuk menjamin kesegaran
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductSection;