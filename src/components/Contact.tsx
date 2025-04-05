'use client';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Star } from 'lucide-react';
import { useState } from 'react';
import Head from 'next/head';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Implementasi pengiriman formulir
    console.log('Message sent!');
  };

  return (
    <section 
      className="relative py-20 overflow-hidden" 
      id="contact"
      aria-labelledby="contact-heading"
      itemScope 
      itemType="https://schema.org/Organization"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 
            id="contact-heading" 
            className="text-4xl font-bold text-gray-900 dark:text-gray-100"
            itemProp="name"
          >
            Hubungi Kami
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Hubungi kami untuk pengiriman makanan laut segar atau pertanyaan kemitraan
          </p>
          
          {/* Hidden SEO metadata */}
          <meta itemProp="url" content="https://dkmandiri.id" />
          <meta itemProp="logo" content="https://dkmandiri.id/images/logo.png" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Map & Info Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
            itemScope
            itemType="https://schema.org/LocalBusiness"
          >
            {/* Hidden SEO metadata */}
            <meta itemProp="name" content="DK Mandiri Seafood" />
            <meta itemProp="image" content="https://dkmandiri.id/images/storefront.jpg" />
            <meta itemProp="priceRange" content="Rp25.000 - Rp150.000" />
            
            {/* Google Maps */}
            <div 
              className="rounded-xl overflow-hidden shadow-lg"
              itemProp="hasMap" 
              itemScope 
              itemType="https://schema.org/Map"
            >
              <meta itemProp="url" content="https://maps.app.goo.gl/UPKjcaAdxg5zFBgr5" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.7239088919964!2d109.3782886109085!3d-7.712745576376623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6537d1169a0801%3A0x3ac07a4105d5b273!2sDk%20mandiri%20seafood!5e0!3m2!1sen!2sid!4v1737220904852!5m2!1sen!2sid"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi DK Mandiri Seafood di Cilacap"
                aria-label="Peta lokasi DK Mandiri Seafood"
              />
            </div>

            {/* Rating Card */}
            <div 
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              itemProp="aggregateRating" 
              itemScope 
              itemType="https://schema.org/AggregateRating"
            >
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-400 fill-current" aria-hidden="true" />
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100" itemProp="ratingValue">4.8</span>
                <span className="text-gray-600 dark:text-gray-300">(<span itemProp="reviewCount">200</span>+ Ulasan)</span>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div 
              className="grid grid-cols-2 gap-4"
              itemScope 
              itemType="https://schema.org/PostalAddress"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-100"
                >
                  <info.icon className="h-6 w-6 text-cyan-600 mb-3" aria-hidden="true" />
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{info.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {index === 0 ? (
                      <span itemProp="streetAddress">{info.details}</span>
                    ) : index === 1 ? (
                      <a 
                        href={`tel:${info.details.replace(/\s+/g, '')}`} 
                        className="hover:text-cyan-600 transition-colors"
                        itemProp="telephone"
                      >
                        {info.details}
                      </a>
                    ) : index === 2 ? (
                      <a 
                        href={`mailto:${info.details}`} 
                        className="hover:text-cyan-600 transition-colors"
                        itemProp="email"
                      >
                        {info.details}
                      </a>
                    ) : (
                      <span>{info.details}</span>
                    )}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-cyan-100"
          >
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              aria-label="Form kontak DK Mandiri"
            >
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="message">
                  Pesan
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                  aria-required="true"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
                aria-label="Kirim pesan"
              >
                Kirim Pesan
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const contactInfo = [
  {
    icon: MapPin,
    title: "Alamat",
    details: "Jl. Suryanegara, Mertangga, Jetis, Kec. Nusawungu, Kabupaten Cilacap"
  },
  {
    icon: Phone,
    title: "Nomor Telepon",
    details: "+62 812-2784-8422" 
  },
  {
    icon: Mail,
    title: "Email",
    details: "dikagilang2007@gmail.com"
  },
  {
    icon: Clock,
    title: "Jam Operasional",
    details: "Senin - Minggu, 08:00 - 20:00"
  }
];

export default Contact;