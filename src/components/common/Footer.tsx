'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Fish, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer 
      className="bg-gray-900 text-white relative overflow-hidden"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      {/* Animated fish */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            animate={{
              x: ['-10%', '110%'],
              y: [
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
              ],
              rotate: [0, Math.random() * 30 - 15],
            }}
            transition={{
              duration: Math.random() * 20 + 30,
              repeat: Infinity,
              ease: 'linear',
            }}
            aria-hidden="true"
          >
            <Fish className="text-cyan-500 w-16 h-16" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-3">
                <Fish className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">DK Mandiri</h2>
                <p className="text-cyan-300 text-sm">Seafood</p>
              </div>
            </div>
            <p className="text-gray-300 mt-4">
              Supplier ikan segar berkualitas premium dari nelayan lokal. Kami melayani pengiriman ikan segar di Cilacap dan sekitarnya dengan harga terbaik.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://facebook.com/dkmandiriseafood"
                aria-label="Facebook DK Mandiri Seafood"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com/dkmandiriseafood"
                aria-label="Instagram DK Mandiri Seafood"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com/dkmandiriseafood"
                aria-label="Twitter DK Mandiri Seafood"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">Navigasi</h3>
            <nav aria-label="Navigasi footer">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-cyan-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">Layanan Kami</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4" itemScope itemType="https://schema.org/LocalBusiness">
            <meta itemProp="name" content="DK Mandiri Seafood" />
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">Kontak Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-cyan-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <span className="text-gray-300" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    <span itemProp="streetAddress">Jl. Suryanegara, Mertangga, Jetis</span>,
                    <span itemProp="addressLocality">Kec. Nusawungu</span>,
                    <span itemProp="addressRegion">Kabupaten Cilacap</span>,
                    <span itemProp="postalCode">53283</span>
                  </span>
                </div>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />
                <a 
                  href="tel:+6281227848422" 
                  className="text-gray-300 hover:text-cyan-300 transition-colors"
                  itemProp="telephone"
                >
                  +62 812-2784-8422
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />
                <a 
                  href="mailto:dikagilang2007@gmail.com" 
                  className="text-gray-300 hover:text-cyan-300 transition-colors"
                  itemProp="email"
                >
                  dikagilang2007@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {year} DK Mandiri Seafood. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-cyan-300 text-sm transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-cyan-300 text-sm transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Structured data for organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "DK Mandiri Seafood",
            "url": "https://dkmandiri.id",
            "logo": "https://dkmandiri.id/images/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+6281227848422",
              "contactType": "customer service",
              "availableLanguage": ["Indonesian", "English"]
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Jl. Suryanegara, Mertangga, Jetis",
              "addressLocality": "Nusawungu",
              "addressRegion": "Cilacap",
              "postalCode": "53283",
              "addressCountry": "ID"
            },
            "sameAs": [
              "https://facebook.com/dkmandiriseafood",
              "https://instagram.com/dkmandiriseafood",
              "https://twitter.com/dkmandiriseafood"
            ]
          })
        }}
      />
    </footer>
  );
};

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/about' },
  { label: 'Produk', href: '/product' },
  { label: 'Kemitraan', href: '/partners' },
  { label: 'Kontak', href: '/contact' }
];

const services = [
  'Ikan Segar Premium',
  'Pengiriman Cepat',
  'Kemitraan Supplier',
  'Pemesanan Online',
  'Penjualan Grosir & Eceran'
];

export default Footer;