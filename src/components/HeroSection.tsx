'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Fish, Timer, Award } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        {/* Ocean-themed Background with Custom Waves */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-white">
          <div className="wave-container">
            <div className="wave wave1" />
            <div className="wave wave2" />
            <div className="wave wave3" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/20 via-transparent to-transparent"></div>
        </div>

        {/* Floating Bubbles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1],
                y: ['100%', '0%'],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 10,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative inline-block"
            >
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-400 opacity-30 blur"></div>
              <h1 className="relative text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900 py-2">
                Fresh From The Ocean
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-blue-950 max-w-3xl mx-auto leading-relaxed"
            >
              Premium quality seafood, sourced directly from local fishermen.
              Fresh, sustainable, and delivered to your doorstep.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium overflow-hidden rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white transition-all hover:scale-105"
              >
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                <span className="relative">Our Products</span>
                <Fish className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium overflow-hidden rounded-lg border-2 border-cyan-600 text-cyan-700 transition-all hover:bg-cyan-50"
              >
                <span className="relative">Contact Us</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>

            {/* Features Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  className="group relative rounded-xl bg-white/50 backdrop-blur-sm p-6 hover:bg-white/80 transition-all duration-300 border border-cyan-100 hover:border-cyan-200"
                >
                  <div className="relative">
                    <feature.icon className="h-8 w-8 text-cyan-600 mb-4" />
                    <h3 className="text-xl font-semibold text-cyan-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-cyan-700">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
};

const features = [
  {
    icon: Fish,
    title: "Fresh Quality",
    description: "Premium seafood sourced directly from local fishermen"
  },
  {
    icon: Timer,
    title: "Daily Catch",
    description: "Fresh fish caught and delivered on the same day"
  },
  {
    icon: Award,
    title: "Best Quality",
    description: "Guaranteed freshness and premium selection"
  }
];

export default HeroSection;