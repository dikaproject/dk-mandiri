'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Fish, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

const ProductSection = () => {
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
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white">
        <div className="wave-container">
          <div className="wave wave1" />
          <div className="wave wave2" />
          <div className="wave wave3" />
        </div>
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
              <TrendingUp className="h-8 w-8 text-cyan-600" />
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900">
                Best Selling Products
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our most popular fresh catches, delivered straight to your business
            </p>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((product, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                  <Image
                    src={`/products/${product.image}`}
                    alt={product.name}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Trending Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Fish className="h-4 w-4 text-cyan-600" />
                      <span className="text-sm font-medium text-cyan-700">Trending</span>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < product.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price and Sales */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-cyan-700">
                      {product.price}
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="text-sm font-medium">{product.soldThisMonth} sold</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300">
                    Order Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const products = [
  {
    name: "Ikan Dory",
    image: "dori.jpeg",
    price: "Rp 45.000/kg",
    rating: 5,
    reviews: 128,
    soldThisMonth: 256
  },
  {
    name: "Ikan Gurame",
    image: "gurame.jpg",
    price: "Rp 38.000/kg",
    rating: 4,
    reviews: 89,
    soldThisMonth: 178
  },
  {
    name: "Ikan Kakap",
    image: "kakap.png",
    price: "Rp 52.000/kg",
    rating: 5,
    reviews: 156,
    soldThisMonth: 312
  },
  {
    name: "Ikan Kerapu",
    image: "kerapu.jpg",
    price: "Rp 48.000/kg",
    rating: 4,
    reviews: 94,
    soldThisMonth: 189
  }
];

export default ProductSection;