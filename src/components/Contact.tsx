'use client';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Star } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    console.log(setFormData)
    console.log('Message sent!');
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900">
            Contact Us
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get in touch with us for fresh seafood delivery or partnership inquiries
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Map & Info Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Google Maps */}
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.7239088919964!2d109.3782886109085!3d-7.712745576376623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6537d1169a0801%3A0x3ac07a4105d5b273!2sDk%20mandiri%20seafood!5e0!3m2!1sen!2sid!4v1737220904852!5m2!1sen!2sid"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Rating Card */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-100">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-gray-900">4.8</span>
                <span className="text-gray-600">(200+ Reviews)</span>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-100"
                >
                  <info.icon className="h-6 w-6 text-cyan-600 mb-3" />
                  <h3 className="font-medium text-gray-900">{info.title}</h3>
                  <p className="text-gray-600">{info.details}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-8 border border-cyan-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
              >
                Send Message
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
    title: "Address",
    details: "Jl. Raya Purwokerto, Kecamatan, Kabupaten"
  },
  {
    icon: Phone,
    title: "Phone",
    details: "+62 123 456 789"
  },
  {
    icon: Mail,
    title: "Email",
    details: "info@dkmandiri.com"
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Mon - Sat: 8AM - 5PM"
  }
];

export default Contact;