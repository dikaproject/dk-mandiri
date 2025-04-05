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
    <section 
      className="relative py-20 overflow-hidden" 
      id="order-process"
      aria-labelledby="order-process-heading"
      itemScope 
      itemType="https://schema.org/HowTo"
    >
      {/* Hidden SEO metadata */}
      <meta itemProp="name" content="Cara Memesan Ikan Segar dari DK Mandiri Seafood" />
      <meta itemProp="description" content="Panduan lengkap cara memesan ikan segar dari DK Mandiri Seafood, tersedia pengiriman online dan pengambilan di toko." />
      <meta itemProp="totalTime" content="PT30M" />
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            <h2 
              id="order-process-heading" 
              className="text-4xl font-bold text-gray-900 dark:text-gray-100"
              itemProp="name"
            >
              Bagaimana cara memesan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" itemProp="description">
              Pilih cara yang Anda inginkan untuk memesan
            </p>
          </motion.div>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-4" role="tablist" aria-label="Metode pemesanan">
            <button
              onClick={() => setActiveTab('online')}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'online'
                  ? 'bg-cyan-600 text-white shadow-lg scale-105'
                  : 'bg-white/50 dark:bg-gray-800/50 text-cyan-600 dark:text-cyan-400 hover:bg-white/80 dark:hover:bg-gray-700/80'
              }`}
              role="tab"
              aria-selected={activeTab === 'online'}
              aria-controls="online-panel"
              id="online-tab"
            >
              <Truck className="h-5 w-5" aria-hidden="true" />
              <span>Pengiriman Online</span>
            </button>
            <button
              onClick={() => setActiveTab('offline')}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'offline'
                  ? 'bg-cyan-600 text-white shadow-lg scale-105'
                  : 'bg-white/50 dark:bg-gray-800/50 text-cyan-600 dark:text-cyan-400 hover:bg-white/80 dark:hover:bg-gray-700/80'
              }`}
              role="tab"
              aria-selected={activeTab === 'offline'}
              aria-controls="offline-panel"
              id="offline-tab"
            >
              <Store className="h-5 w-5" aria-hidden="true" />
              <span>Pengambilan Di Toko</span>
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
            id={`${activeTab}-panel`}
            role="tabpanel"
            aria-labelledby={`${activeTab}-tab`}
          >
            <div className="rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  {activeTab === 'online' ? (
                    <Truck className="h-8 w-8 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
                  ) : (
                    <Store className="h-8 w-8 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
                  )}
                  <h3 className="text-2xl font-semibold text-cyan-900 dark:text-cyan-100">
                    {activeTab === 'online' ? 'Online Delivery' : 'Store Pickup'}
                  </h3>
                </div>

                <div className="space-y-4" itemProp="step" itemScope itemType="https://schema.org/HowToSection">
                  {(activeTab === 'online' ? onlineSteps : offlineSteps).map((step, index) => (
                    <div 
                      key={index} 
                      className="flex gap-4"
                      itemProp={index === 0 ? "itemListElement" : undefined} 
                      itemScope={index === 0} 
                      itemType={index === 0 ? "https://schema.org/HowToStep" : undefined}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 
                          className="font-medium text-gray-900 dark:text-gray-100"
                          itemProp={index === 0 ? "name" : undefined}
                        >
                          {step.title}
                        </h4>
                        <p 
                          className="text-gray-600 dark:text-gray-300"
                          itemProp={index === 0 ? "text" : undefined}
                        >
                          {step.description}
                        </p>
                        {index === 0 && (
                          <meta itemProp="position" content="1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-cyan-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-cyan-700">
                    {activeTab === 'online' ? (
                      <>
                        <AlertCircle className="h-5 w-5" aria-hidden="true" />
                        <p className="text-sm font-medium">
                          Pengiriman tersedia dalam radius 20 km untuk jaminan kesegaran
                        </p>
                      </>
                    ) : (
                      <>
                        <Clock className="h-5 w-5" aria-hidden="true" />
                        <p className="text-sm font-medium">
                          Silakan ambil dalam waktu 1-2 jam setelah pemesanan
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
    title: "Tambahkan ke Keranjang",
    description: "Pilih produk ikan segar yang Anda inginkan dan tambahkan ke keranjang"
  },
  {
    title: "Masukkan Alamat Pengiriman",
    description: "Cantumkan alamat pengiriman Anda dalam radius layanan 20 km kami"
  },
  {
    title: "Pilih Metode Pembayaran",
    description: "Pilih COD, QRIS, atau transfer bank sebagai metode pembayaran Anda"
  },
  {
    title: "Menerima Pembaruan Pesanan",
    description: "Dapatkan pembaruan otomatis melalui WhatsApp termasuk faktur/Struk Pembelian Anda"
  }
];

const offlineSteps = [
  {
    title: "Lakukan Pemesanan Anda",
    description: "Pilih produk dan berikan nama serta nomor WhatsApp Anda"
  },
  {
    title: "Menerima ID Pesanan",
    description: "Dapatkan ID pesanan unik Anda dan instruksi pengambilan melalui WhatsApp"
  },
  {
    title: "Kunjungi Toko Kami",
    description: "Datanglah ke toko kami dalam waktu 1-2 jam setelah pemesanan"
  },
  {
    title: "Ambil Pesanan Anda",
    description: "Tunjukkan ID pesanan Anda dan ambil ikan segar Anda"
  }
];

export default HowToOrder;