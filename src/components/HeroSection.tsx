'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Fish, Timer, Award } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const HeroSection = () => {
    // State to store bubble positions
    const [bubbles, setBubbles] = useState<Array<{
      left: string;
      delay: number;
      duration: number;
    }>>([]);

    // Generate bubbles only on the client side
    useEffect(() => {
      const newBubbles = [...Array(20)].map(() => ({
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 10,
        duration: Math.random() * 10 + 15
      }));
      setBubbles(newBubbles);
    }, []);

    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        {/* Ocean-themed Background with Custom Waves - Updated dark mode gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        </div>

        {/* Updated floating bubbles for dark mode */}
        <div className="absolute inset-0 overflow-hidden">
          {bubbles.map((bubble, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 bg-gradient-to-r from-cyan-400 to-blue-400 dark:from-cyan-600 dark:to-blue-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1],
                y: ['100%', '0%'],
              }}
              transition={{
                duration: bubble.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: bubble.delay,
              }}
              style={{
                left: bubble.left,
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
              {/* Updated blur gradient for dark mode */}
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-400 opacity-30 blur dark:from-cyan-600 dark:to-blue-600 dark:opacity-20"></div>
              <h1 className="relative text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900 dark:from-cyan-400 dark:to-blue-500 py-2">
                Ikan Segar Dari Laut
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-blue-950 dark:text-gray-100 max-w-3xl mx-auto leading-relaxed"
            >
              Hidangan laut berkualitas premium, bersumber langsung dari nelayan lokal. Segar, lestari, dan diantarkan langsung ke depan pintu rumah Anda.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link
                href="/product"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium overflow-hidden rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white transition-all hover:scale-105"
              >
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                <span className="relative">Produk Kami</span>
                <Fish className="ml-2 h-5 w-5" />
              </Link>
                <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium overflow-hidden rounded-lg border-2 border-cyan-600 dark:border-cyan-400 text-cyan-700 dark:text-cyan-400 transition-all hover:bg-cyan-50 dark:hover:bg-cyan-900/30"
                >
                <span className="relative transition-colors">Hubungi Kami</span>
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
                  className="group relative rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="relative">
                    <feature.icon className="h-8 w-8 text-cyan-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
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
    title: "Kualitas Segar",
    description: "Hidangan laut premium yang bersumber langsung dari nelayan lokal"
  },
  {
    icon: Timer,
    title: "Tangkapan Harian",
    description: "Ikan segar yang ditangkap dan dikirim pada hari yang sama"
  },
  {
    icon: Award,
    title: "Kualitas Terbaik",
    description: "Kesegaran terjamin dan pilihan premium"
  }
];

export default HeroSection;