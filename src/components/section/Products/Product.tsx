'use client';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Fish } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
}

const ProductCard = ({ id, name, price, image, rating, reviews, stock }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/products/detail/${id}`}>
        <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
          <Image
            src={`/products/${image}`}
            alt={name}
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
          {stock < 10 && (
            <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-white">Low Stock</span>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <Fish className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Fresh</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
          
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              ({reviews} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">
              {price}
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm font-medium">
                Stock: {stock}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;