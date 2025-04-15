'use client'
import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { sendMessage, ChatMessage } from '@/services/assistant';
import { motion, AnimatePresence } from 'framer-motion';

const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Halo! Saya adalah DK Mandiri AI Assistant. Saya dapat membantu Anda dengan informasi tentang ikan, harga terkini, dan tren pasar. Apa yang ingin Anda ketahui hari ini?\n\n*Catatan: AI DK Mandiri masih tahap versi 0.1 beta dimana data bisa tidak akurat. Jika ada pertanyaan lebih lanjut, silakan hubungi langsung kontak DK Mandiri Resmi di footer.*',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when page loads
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
    setInput('');
    setIsLoading(true);
    
    try {
      // Call API
      const response = await sendMessage(input);
      
      // Add assistant response
      if (response.success) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Handle error
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Halo! Saya adalah DK Mandiri AI Assistant. Saya dapat membantu Anda dengan informasi tentang ikan, harga terkini, dan tren pasar. Apa yang ingin Anda ketahui hari ini?\n\n*Catatan: AI DK Mandiri masih tahap versi 0.1 beta dimana data bisa tidak akurat. Jika ada pertanyaan lebih lanjut, silakan hubungi langsung kontak DK Mandiri Resmi di footer.*',
      timestamp: new Date()
    }]);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const setSuggestedQuery = (query: string) => {
    setInput(query);
    inputRef.current?.focus();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 pb-24 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Beta warning banner */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 text-sm text-yellow-800 dark:text-yellow-300 shadow-sm"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span><strong>Peringatan:</strong> AI DK Mandiri masih tahap versi 0.1 beta dimana data bisa tidak akurat. Jika ada pertanyaan lebih lanjut, silakan hubungi langsung kontak DK Mandiri Resmi di footer.</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80"
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 text-white px-6 py-5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                  <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#pattern)" />
                  <defs>
                    <pattern id="pattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
                      <rect width="100%" height="100%" fill="none" />
                      <circle cx="20" cy="20" r="2" fill="currentColor" />
                    </pattern>
                  </defs>
                </svg>
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">DK Mandiri Assistant <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-0.5 rounded-full ml-2 font-medium">BETA 0.1</span></h2>
                    <p className="text-sm text-blue-50">Siap menjawab pertanyaan Anda tentang produk ikan kami</p>
                  </div>
                </div>
                <button 
                  onClick={handleClearChat}
                  className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 text-sm transition duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Bersihkan Obrolan
                </button>
              </div>
            </div>
            
            {/* Chat messages */}
            <div ref={chatContainerRef} className="p-6 h-[500px] overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-sm">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-6 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 flex items-center justify-center text-white mr-3 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                    )}
                    <div 
                      className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 text-white rounded-br-none' 
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                      <span className={`text-xs mt-2 block ${
                        msg.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    {msg.role === 'user' && (
                      <div className="h-9 w-9 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white ml-3 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start mb-6"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 flex items-center justify-center text-white mr-3 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <div className="bg-blue-400 dark:bg-blue-500 rounded-full h-2.5 w-2.5 animate-pulse"></div>
                      <div className="bg-blue-400 dark:bg-blue-500 rounded-full h-2.5 w-2.5 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="bg-blue-400 dark:bg-blue-500 rounded-full h-2.5 w-2.5 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800 transition-all duration-300">
              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ketik pesan Anda di sini..."
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-xl px-4 py-3.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-600 transition-all duration-200"
                  disabled={isLoading}
                  ref={inputRef}
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 dark:from-blue-700 dark:to-cyan-600 dark:hover:from-blue-800 dark:hover:to-cyan-700 text-white rounded-r-xl px-6 py-3.5 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-500/20 dark:shadow-blue-700/30"
                  disabled={isLoading || !input.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
              
              {/* Suggested queries */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSuggestedQuery('Berapa harga ikan kerapu terkini?')}
                  className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 text-sm px-4 py-2 rounded-full transition-all duration-200 shadow-sm border border-blue-100 dark:border-blue-700/50"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Harga ikan kerapu
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestedQuery('Ikan apa yang paling laris bulan ini?')}
                  className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 text-sm px-4 py-2 rounded-full transition-all duration-200 shadow-sm border border-blue-100 dark:border-blue-700/50"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    Ikan terlaris
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestedQuery('Apakah DK Mandiri menyediakan pengiriman untuk supplier?')}
                  className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 text-sm px-4 py-2 rounded-full transition-all duration-200 shadow-sm border border-blue-100 dark:border-blue-700/50"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    Info pengiriman
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
          
          {/* Features section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center transition-all duration-300">
              <span className="relative inline-block">
                <span className="relative z-10">Fitur AI Assistant</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 -z-10 rounded"></span>
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-2xl flex items-center justify-center mb-5 shadow-inner transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100 transition-all duration-300">Info Harga Real-time</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-all duration-300 leading-relaxed">Dapatkan informasi harga ikan terkini langsung dari database kami yang selalu diperbarui.</p>
              </div>
              
              {/* Feature 2 */}
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-2xl flex items-center justify-center mb-5 shadow-inner transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100 transition-all duration-300">Analisis Tren Pasar</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-all duration-300 leading-relaxed">Ketahui jenis ikan yang sedang diminati pasar dan trending berdasarkan data penjualan terkini.</p>
              </div>
              
              {/* Feature 3 */}
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-2xl flex items-center justify-center mb-5 shadow-inner transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100 transition-all duration-300">Bantuan 24/7</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-all duration-300 leading-relaxed">Dapatkan jawaban untuk pertanyaan Anda tentang produk ikan, pemesanan, dan layanan kapan saja.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AssistantPage;