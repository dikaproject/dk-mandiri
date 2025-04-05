'use client'
import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { sendMessage, ChatMessage } from '@/services/assistant';

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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
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

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-24 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Beta warning banner */}
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-300">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span><strong>Peringatan:</strong> AI DK Mandiri masih tahap versi 0.1 beta dimana data bisa tidak akurat. Jika ada pertanyaan lebih lanjut, silakan hubungi langsung kontak DK Mandiri Resmi di footer.</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-colors duration-200">
            {/* Chat header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 text-white px-6 py-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-cyan-500 dark:bg-cyan-600 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-xl">DK Mandiri Assistant <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-0.5 rounded-full ml-2">BETA 0.1</span></h2>
                  <p className="text-sm text-cyan-100">Siap menjawab pertanyaan Anda tentang produk ikan kami</p>
                </div>
              </div>
            </div>
            
            {/* Chat messages */}
            <div className="p-6 h-[500px] overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-6 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 flex items-center justify-center text-white mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] rounded-lg px-5 py-3 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 text-white rounded-br-none' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
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
                    <div className="h-8 w-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-6">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 flex items-center justify-center text-white mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-5 py-3 rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="bg-gray-400 dark:bg-gray-500 rounded-full h-2 w-2 mt-2 animate-bounce"></div>
                      <div className="bg-gray-400 dark:bg-gray-500 rounded-full h-2 w-2 mt-2 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="bg-gray-400 dark:bg-gray-500 rounded-full h-2 w-2 mt-2 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ketik pesan Anda di sini..."
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-600 transition-colors duration-200"
                  disabled={isLoading}
                  ref={inputRef}
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 dark:from-cyan-700 dark:to-blue-700 dark:hover:from-cyan-800 dark:hover:to-blue-800 text-white rounded-r-lg px-6 py-3 disabled:opacity-50 transition-all duration-200"
                  disabled={isLoading || !input.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
              
              {/* Suggested queries */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setInput('Berapa harga ikan kerapu terkini?')}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm px-3 py-1 rounded-full transition-colors duration-200"
                >
                  Harga ikan kerapu
                </button>
                <button
                  type="button"
                  onClick={() => setInput('Ikan apa yang paling laris bulan ini?')}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm px-3 py-1 rounded-full transition-colors duration-200"
                >
                  Ikan terlaris
                </button>
                <button
                  type="button"
                  onClick={() => setInput('Apakah DK Mandiri menyediakan pengiriman untuk supplier?')}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm px-3 py-1 rounded-full transition-colors duration-200"
                >
                  Info pengiriman
                </button>
              </div>
            </form>
          </div>
          
          {/* Features section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center transition-colors duration-200">Fitur AI Assistant</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/40 rounded-full flex items-center justify-center mb-4 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600 dark:text-cyan-400">
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
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 transition-colors duration-200">Info Harga Real-time</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">Dapatkan informasi harga ikan terkini langsung dari database kami yang selalu diperbarui.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/40 rounded-full flex items-center justify-center mb-4 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600 dark:text-cyan-400">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 transition-colors duration-200">Analisis Tren Pasar</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">Ketahui jenis ikan yang sedang diminati pasar dan trending berdasarkan data penjualan terkini.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/40 rounded-full flex items-center justify-center mb-4 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600 dark:text-cyan-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 transition-colors duration-200">Bantuan 24/7</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">Dapatkan jawaban untuk pertanyaan Anda tentang produk ikan, pemesanan, dan layanan kapan saja.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AssistantPage;