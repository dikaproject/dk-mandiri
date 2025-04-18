'use client';
import { motion } from 'framer-motion';
import { Fish, Award, Users } from 'lucide-react';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <section className="relative py-36 overflow-hidden ">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
</div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-blue-900 dark:from-cyan-400 dark:to-blue-500">
            Tentang DK Mandiri
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Mitra terpercaya Anda dalam penyediaan makanan laut premium sejak tahun 2010
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Cerita Kami</h2>
            <p className="text-gray-600 dark:text-gray-300">
            Berawal dari sebuah kios kecil di pasar ikan, DK Mandiri telah berkembang menjadi salah satu pemasok makanan laut yang paling tepercaya di wilayah ini. Komitmen kami terhadap kualitas dan kesegaran telah membuat kami mendapatkan kepercayaan dari berbagai perusahaan dan pelanggan perorangan.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-cyan-100 dark:border-gray-700">
                  <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] rounded-2xl overflow-hidden"
          >
            <Image
              src="/about.png"
              alt="DK-Mandiri Facility"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group relative rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 border border-cyan-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <feature.icon className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const stats = [
  { value: '5000+', label: 'Pelanggan yang bahagia' },
  { value: '500+', label: 'Pesanan Bulanan' },
  { value: '14+', label: 'Pengalaman bertahun-tahun' },
  { value: '95%', label: 'Tingkat Kepuasan' }
];

const features = [
  {
    icon: Fish,
    title: 'Kualitas Segar',
    description: 'Kami memastikan semua produk makanan laut kami memenuhi standar kualitas tertinggi.'
  },
  {
    icon: Award,
    title: 'Layanan Terbaik',
    description: 'Dukungan khusus dan pengiriman yang dapat diandalkan untuk semua pelanggan kami.'
  },
  {
    icon: Users,
    title: 'Mengutamakan Komunitas',
    description: 'Mendukung nelayan lokal dan praktik penangkapan ikan yang berkelanjutan.'
  }
];

export default AboutSection;