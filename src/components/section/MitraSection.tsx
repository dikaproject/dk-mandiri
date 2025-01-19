'use client';
import { motion } from 'framer-motion';
import { HandshakeIcon, ScaleIcon, TruckIcon, WalletIcon, ShieldCheckIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';

const MitraSection = () => {
  return (
    <section className="relative py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="wave-container">
          <div className="wave wave1" />
          <div className="wave wave2" />
          <div className="wave wave3" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-blue-900 dark:from-cyan-400 dark:to-blue-500">
            Become Our Partner
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join DK-Mandiri network of successful businesses and grow together with us
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <benefit.icon className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 mb-16 border border-cyan-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Partnership Requirements
          </h2>
          <ul className="space-y-4">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-3">
                <ShieldCheckIcon className="h-6 w-6 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-1" />
                <span className="text-gray-600 dark:text-gray-300">{req}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
          >
            Apply Now
            <HandshakeIcon className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const benefits = [
  {
    icon: HandshakeIcon,
    title: "Trusted Partnership",
    description: "Join a network of successful businesses and build long-term relationships"
  },
  {
    icon: ScaleIcon,
    title: "Quality Products",
    description: "Access premium quality seafood products at competitive prices"
  },
  {
    icon: TruckIcon,
    title: "Reliable Delivery",
    description: "Enjoy timely and consistent delivery services"
  },
  {
    icon: WalletIcon,
    title: "Competitive Pricing",
    description: "Get wholesale prices and special partner discounts"
  },
  {
    icon: UsersIcon,
    title: "Dedicated Support",
    description: "Receive personalized support from our experienced team"
  },
  {
    icon: ShieldCheckIcon,
    title: "Quality Guarantee",
    description: "All products are guaranteed fresh and high quality"
  }
];

const requirements = [
  "Valid business license or relevant permits",
  "Minimum monthly purchase commitment",
  "Proper storage facilities for seafood products",
  "Clean and maintained business premises",
  "Strong commitment to quality service",
  "Good business reputation in the community"
];

export default MitraSection;