'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Fish, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Handle redirect
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 5000);

    // Handle countdown
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-white relative overflow-hidden">
      {/* Wave Animation Background */}
      <div className="absolute inset-0">
        <div className="wave-container">
          <div className="wave wave1" />
          <div className="wave wave2" />
          <div className="wave wave3" />
        </div>
      </div>

      {/* Floating Fish */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            x: ['100vw', '-100vw'],
            y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        >
          <Fish className="text-blue-400/30 w-12 h-12" />
        </motion.div>
      ))}

      <div className="relative z-10 text-center space-y-8 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900 mb-4">
            404
          </h1>
          <h2 className="text-2xl text-gray-700 mb-8">
            Oops! Looks like you&apos;re lost at sea
          </h2>
          <p className="text-gray-600 mb-8">
            Redirecting to home in {countdown} seconds...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-x-4"
        >
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
          >
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-50 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}