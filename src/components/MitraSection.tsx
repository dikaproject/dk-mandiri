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
    <section 
      className="relative py-20 overflow-hidden" 
      id="partnership" 
      aria-labelledby="partnership-heading"
      itemScope 
      itemType="https://schema.org/Service"
    >
      {/* Background with wave effect */}
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
              id="partnership-heading" 
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900"
              itemProp="name"
            >
              Bermitra dengan DK-Mandiri
            </h2>
            <p 
              className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              itemProp="description"
            >
              Bergabunglah dengan jaringan bisnis kami yang sukses. Kami menyediakan produk makanan laut berkualitas dan peluang kemitraan yang dapat diandalkan.
            </p>
            {/* Hidden SEO elements */}
            <meta itemProp="serviceType" content="Seafood Supplier Partnership" />
            <meta itemProp="provider" content="DK Mandiri Seafood" />
            <meta itemProp="areaServed" content="Cilacap, Jawa Tengah, Indonesia" />
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                itemScope
                itemType="https://schema.org/ListItem"
                itemProp="itemListElement"
              >
                <meta itemProp="position" content={`${index + 1}`} />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-10 rounded-xl transition duration-300" />
                <benefit.icon className="h-10 w-10 text-cyan-600 mb-4" aria-hidden="true" />
                <h3 
                  className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3"
                  itemProp="name"
                >
                  {benefit.title}
                </h3>
                <p 
                  className="text-gray-600 dark:text-gray-300"
                  itemProp="description"
                >
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            variants={itemVariants}
            className="relative rounded-2xl overflow-hidden"
            itemScope
            itemType="https://schema.org/Action"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h3 
                  className="text-2xl md:text-3xl font-bold text-white"
                  itemProp="name"
                >
                  Siap Tumbuh Bersama?
                </h3>
                <p className="text-cyan-100">
                  Mulailah perjalanan kemitraan Anda dengan DK-Mandiri hari ini dan rasakan manfaat bekerja sama dengan pemasok makanan laut tepercaya.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-cyan-700 hover:bg-cyan-50 transition-colors duration-300"
                  itemProp="url"
                  aria-label="Hubungi DK Mandiri untuk menjadi mitra"
                >
                  Menjadi Mitra
                  <Handshake className="ml-2 h-5 w-5" aria-hidden="true" />
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
    title: "Kemitraan Terpercaya",
    description: "Bangun hubungan jangka panjang dengan pemasok makanan laut yang andal dan berkomitmen untuk kesuksesan Anda."
  },
  {
    icon: Truck,
    title: "Pengiriman yang Dapat Diandalkan",
    description: "Nikmati pengiriman produk makanan laut segar yang tepat waktu dan konsisten untuk bisnis Anda."
  },
  {
    icon: BadgeDollarSign,
    title: "Harga Kompetitif",
    description: "Akses produk berkualitas premium dengan harga grosir yang kompetitif."
  },
  {
    icon: Scale,
    title: "Jaminan Kualitas",
    description: "Dapatkan hidangan laut berkualitas tinggi yang memenuhi standar Anda secara konsisten."
  },
  {
    icon: Users2,
    title: "Dukungan Khusus",
    description: "Dapatkan dukungan personal dari tim kami yang berpengalaman kapan pun Anda membutuhkannya."
  },
  {
    icon: Clock,
    title: "Ketentuan Fleksibel",
    description: "Dapatkan manfaat dari persyaratan kemitraan yang fleksibel yang disesuaikan dengan kebutuhan bisnis Anda."
  }
];

export default MitraSection;