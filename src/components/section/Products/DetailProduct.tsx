'use client';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Truck, Clock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface DetailProductProps {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
}

const DetailProduct = ({
  name,
  price,
  description,
  image,
  rating,
  reviews,
  stock
}: DetailProductProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="wave-container">
          <div className="wave wave1" />
          <div className="wave wave2" />
          <div className="wave wave3" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/products"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-[400px] rounded-2xl overflow-hidden"
          >
            <Image
              src={`/products/${image}`}
              alt={name}
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{name}</h1>
            
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
              <span className="text-gray-600 dark:text-gray-400">
                ({reviews} reviews)
              </span>
            </div>

            <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">{price}</p>

            <p className="text-gray-600 dark:text-gray-300">{description}</p>

            <div className="flex items-center gap-6">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400"
                >
                  -
                </button>
                <span className="px-4 py-2 text-gray-900 dark:text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400"
                >
                  +
                </button>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Truck className="h-5 w-5" />
                <span>Free delivery within 20km</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Clock className="h-5 w-5" />
                <span>Same day delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DetailProduct;