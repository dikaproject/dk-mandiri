'use client'

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { sendMessage } from '@/services/assistant';
import { Sparkles, MessageCircle, User, Bot, Trash2, SendHorizontal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SuggestedQuery {
  text: string;
  icon: React.ReactNode;
}

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

  // Suggested queries for user to try
  const suggestedQueries: SuggestedQuery[] = [
    { 
      text: 'Apa saja jenis ikan populer?',
      icon: <Sparkles className="w-4 h-4 mr-2" />
    },
    { 
      text: 'Apakah ikan bawal segar?',
      icon: <MessageCircle className="w-4 h-4 mr-2" /> 
    },
    { 
      text: 'Berapa harga udang windu?',
      icon: <MessageCircle className="w-4 h-4 mr-2" />
    },
    { 
      text: 'Tips menyimpan ikan agar tetap segar',
      icon: <Sparkles className="w-4 h-4 mr-2" />
    },
  ];

  // Enhanced scroll function with better reliability
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  // Update the chat container height based on viewport
  useEffect(() => {
    const updateHeight = () => {
      if (chatContainerRef.current) {
        const viewportHeight = window.innerHeight;
        const offset = 340; // Adjust based on your header/footer/input heights
        const newHeight = Math.max(400, viewportHeight - offset);
        chatContainerRef.current.style.height = `${newHeight}px`;
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Scroll to bottom when messages change with a small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
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
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    // Update messages and scroll
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Immediate scroll after adding user message
    setTimeout(() => scrollToBottom(), 50);
    
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
      setTimeout(() => scrollToBottom(), 100);
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
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="bg-blue-600 p-3 rounded-full mb-4">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
              DK Mandiri AI Assistant
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mt-2 max-w-2xl">
              Tanya apa saja tentang produk, harga terkini, rekomendasi pembelian, atau informasi seputar ikan dan udang!
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300">
            {/* Chat container with messages */}
            <div 
              ref={chatContainerRef} 
              className="p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-sm"
              style={{ 
                height: '500px',
                scrollBehavior: 'smooth', 
                overscrollBehavior: 'contain'
              }}
            >
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-none'
                      } px-4 py-3 shadow-sm`}
                    >
                      <div className="mr-2 mt-1">
                        {message.role === 'user' ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-sm">
                            {message.role === 'user' ? 'Anda' : 'DK Mandiri AI'}
                          </span>
                          <span className="ml-2 text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <div 
                          className="whitespace-pre-wrap prose-sm dark:prose-invert"
                          dangerouslySetInnerHTML={{ 
                            __html: message.content
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\n/g, '<br>')
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start mb-4 justify-start"
                >
                  <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center">
                    <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                    <span className="ml-2 text-sm">Mengetik...</span>
                  </div>
                </motion.div>
              )}
              
              {/* Div for scrolling to end */}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Tulis pesan Anda..."
                  disabled={isLoading}
                  className="w-full pl-4 pr-12 py-3 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 transition-all duration-300"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-5 w-5" />
                  )}
                </button>
              </form>
              
              {/* Suggested queries */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {suggestedQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setSuggestedQuery(query.text)}
                    disabled={isLoading}
                    className="flex items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full text-sm transition-all duration-300"
                  >
                    {query.icon}
                    {query.text}
                  </button>
                ))}
                
                {/* Clear button */}
                <button
                  onClick={handleClearChat}
                  disabled={isLoading || messages.length <= 1}
                  className="flex items-center bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-800 dark:text-red-300 px-3 py-1.5 rounded-full text-sm transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Chat
                </button>
              </div>
            </div>
          </div>
          
          {/* Info section */}
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tentang DK Mandiri AI Assistant
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              DK Mandiri AI Assistant didesain untuk membantu Anda mendapatkan informasi tentang produk-produk ikan dan udang dari DK Mandiri. Asistensi ini masih dalam tahap pengembangan dan terus ditingkatkan untuk memberikan pengalaman yang lebih baik.
            </p>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-2">
              Apa yang dapat ditanyakan:
            </h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Informasi tentang berbagai jenis ikan dan udang</li>
              <li>Harga terkini untuk produk-produk tertentu</li>
              <li>Tips penyimpanan dan pengolahan makanan laut</li>
              <li>Rekomendasi produk berdasarkan kebutuhan</li>
              <li>Informasi tentang nutrisi dan manfaat makanan laut</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AssistantPage;