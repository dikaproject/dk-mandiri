'use client';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Store,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useState } from 'react';

const HowToOrder = () => {
  const [activeTab, setActiveTab] = useState<'online' | 'offline'>('online');

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
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900">
              How to Order
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose your preferred way to order
            </p>
          </motion.div>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('online')}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'online'
                  ? 'bg-cyan-600 text-white shadow-lg scale-105'
                  : 'bg-white/50 text-cyan-600 hover:bg-white/80'
              }`}
            >
              <Truck className="h-5 w-5" />
              <span>Online Delivery</span>
            </button>
            <button
              onClick={() => setActiveTab('offline')}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'offline'
                  ? 'bg-cyan-600 text-white shadow-lg scale-105'
                  : 'bg-white/50 text-cyan-600 hover:bg-white/80'
              }`}
            >
              <Store className="h-5 w-5" />
              <span>Store Pickup</span>
            </button>
          </div>

          {/* Content */}
          <motion.div
            variants={itemVariants}
            className="max-w-2xl mx-auto"
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-2xl bg-white/50 backdrop-blur-sm p-8 border border-cyan-100 shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  {activeTab === 'online' ? (
                    <Truck className="h-8 w-8 text-cyan-600" />
                  ) : (
                    <Store className="h-8 w-8 text-cyan-600" />
                  )}
                  <h3 className="text-2xl font-semibold text-cyan-900">
                    {activeTab === 'online' ? 'Online Delivery' : 'Store Pickup'}
                  </h3>
                </div>

                <div className="space-y-4">
                  {(activeTab === 'online' ? onlineSteps : offlineSteps).map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-cyan-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-cyan-700">
                    {activeTab === 'online' ? (
                      <>
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm font-medium">
                          Delivery available within 20km radius for freshness guarantee
                        </p>
                      </>
                    ) : (
                      <>
                        <Clock className="h-5 w-5" />
                        <p className="text-sm font-medium">
                          Please pick up within 1-2 hours of ordering
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const onlineSteps = [
  {
    title: "Add to Cart",
    description: "Select your desired fresh fish products and add them to cart"
  },
  {
    title: "Enter Delivery Address",
    description: "Provide your delivery address within our 20km service radius"
  },
  {
    title: "Choose Payment Method",
    description: "Select COD, QRIS, or bank transfer as your payment method"
  },
  {
    title: "Receive Order Updates",
    description: "Get automatic updates via WhatsApp including your invoice"
  }
];

const offlineSteps = [
  {
    title: "Place Your Order",
    description: "Select products and provide your name and WhatsApp number"
  },
  {
    title: "Receive Order ID",
    description: "Get your unique order ID and pickup instructions via WhatsApp"
  },
  {
    title: "Visit Our Store",
    description: "Come to our store within 1-2 hours of ordering"
  },
  {
    title: "Collect Your Order",
    description: "Show your order ID and collect your fresh fish"
  }
];

export default HowToOrder;