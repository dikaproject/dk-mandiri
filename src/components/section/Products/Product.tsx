'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Tag, Scale } from 'lucide-react';
import { Product } from '@/types/product';
import { formatToIDR } from '@/utils/formatter';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
          <Image
            src={product.primaryImage || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
            unoptimized
          />
          
          {/* Category badge */}
          {product.category && (
            <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="flex items-center gap-1">
                <Tag size={14} className="text-cyan-600" />
                <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                  {product.category.name}
                </span>
              </div>
            </div>
          )}
          
          {/* Min order weight badge */}
          <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <Scale size={14} className="text-cyan-600" />
              <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                Min {product.minOrderWeight}g
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{product.name}</h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-cyan-700 dark:text-cyan-400">
              {formatToIDR(product.price)}<span className="text-sm font-normal">/kg</span>
            </span>
            
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 transition-transform group-hover:scale-110">
              <ShoppingCart size={18} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}