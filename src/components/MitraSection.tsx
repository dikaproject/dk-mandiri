'use client';
import { motion } from 'framer-motion';
import { Handshake, Truck, BadgeDollarSign, Scale, Users2, Clock } from 'lucide-react';
import Link from 'next/link';

const MitraSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with wave effect */}
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
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900">
              Partner With DK-Mandiri
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join our network of successful businesses. We provide quality seafood products
              and reliable partnership opportunities.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative rounded-xl bg-white/50 backdrop-blur-sm p-8 hover:bg-white/80 transition-all duration-300 border border-cyan-100 hover:border-cyan-200 hover:shadow-lg"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-10 rounded-xl transition duration-300" />
                <benefit.icon className="h-10 w-10 text-cyan-600 mb-4" />
                <h3 className="text-xl font-semibold text-cyan-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            variants={itemVariants}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Ready to Grow Together?
                </h3>
                <p className="text-cyan-100">
                  Start your partnership journey with DK-Mandiri today and experience
                  the benefits of working with a trusted seafood supplier.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-cyan-700 hover:bg-cyan-50 transition-colors duration-300"
                >
                  Become a Partner
                  <Handshake className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const benefits = [
  {
    icon: Handshake,
    title: "Trusted Partnership",
    description: "Build a long-term relationship with a reliable seafood supplier committed to your success."
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description: "Enjoy timely and consistent delivery of fresh seafood products to your business."
  },
  {
    icon: BadgeDollarSign,
    title: "Competitive Pricing",
    description: "Access premium quality products at competitive wholesale prices."
  },
  {
    icon: Scale,
    title: "Quality Guarantee",
    description: "Receive consistently high-quality seafood that meets your standards."
  },
  {
    icon: Users2,
    title: "Dedicated Support",
    description: "Get personalized support from our experienced team whenever you need it."
  },
  {
    icon: Clock,
    title: "Flexible Terms",
    description: "Benefit from flexible partnership terms tailored to your business needs."
  }
];

export default MitraSection;