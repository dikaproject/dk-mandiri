"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import WhatsAppIcon from "../icons/WhatsAppIcon";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setNotification({
        type: "success",
        message: "Message sent successfully! We will contact you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
        console.log(error);
      setNotification({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    }
    setIsLoading(false);
    setTimeout(() => setNotification({ type: null, message: "" }), 5000);
  };

  return (
    <section className="relative min-h-screen py-36 overflow-hidden">
      {/* Background with enhanced waves */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="wave-container opacity-50">
          <div className="wave wave1" />
          <div className="wave wave2" />
          <div className="wave wave3" />
        </div>
      </div>

      {/* Floating Elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:block"
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
            opacity: 0.1,
          }}
        >
          <MapPin className="w-8 h-8 text-cyan-500" />
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-blue-900 dark:from-cyan-400 dark:to-blue-500">
          Hubungi kami
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Ada pertanyaan? Kami akan senang mendengarnya dari Anda. Kirimkan pesan kepada kami dan kami akan merespons sesegera mungkin.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Map and Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Interactive Map */}
            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <a
                  href="https://maps.app.goo.gl/Hh8krzguaxbPQSzS9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-cyan-600/90 px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.7239088919964!2d109.3782886109085!3d-7.712745576376623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6537d1169a0801%3A0x3ac07a4105d5b273!2sDk%20mandiri%20seafood!5e0!3m2!1sen!2sid!4v1737220904852!5m2!1sen!2sid"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                >
                  <info.icon className="h-6 w-6 text-cyan-600 dark:text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {info.details}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="p-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-cyan-100 dark:border-gray-700 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Notification */}
              <AnimatePresence>
                {notification.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-lg ${
                      notification.type === "success"
                        ? "bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {notification.type === "success" ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      {notification.message}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Send Message"
                )}
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

const socialLinks = [
  {
    icon: Instagram,
    link: "https://instagram.com/dika_art_project",
  },
  {
    icon: WhatsAppIcon,
    link: "https://wa.me/6281227848422", // Replace with actual WhatsApp number
  },
];

export default ContactSection;
