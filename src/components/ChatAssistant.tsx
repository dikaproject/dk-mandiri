'use client';
import React, { useState, useRef, useEffect } from 'react';
import { sendMessage, ChatMessage } from '@/services/assistant';
import { motion, AnimatePresence } from 'framer-motion';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Halo! Saya adalah DK Mandiri AI Assistant. Saya dapat membantu Anda dengan informasi tentang ikan, harga terkini, dan tren pasar. Apa yang ingin Anda ketahui hari ini?\n\n*Catatan: AI DK Mandiri masih tahap versi 0.1 beta dimana data bisa tidak akurat. Jika ada pertanyaan lebih lanjut, silakan hubungi kontak DK Mandiri Resmi di footer.*',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isChatOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await sendMessage(input);
      
      if (response.success) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsChatOpen(false)}
          />
        )}
      </AnimatePresence>
      
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mb-4 w-[85vw] sm:w-[350px] max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
            >
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 text-white p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">DK Mandiri Assistant</h3>
                    <div className="flex items-center">
                      <span className="h-1.5 w-1.5 bg-green-400 rounded-full mr-1"></span>
                      <p className="text-xs text-blue-100">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs bg-yellow-500 text-yellow-900 px-1.5 py-0.5 rounded-full mr-2 font-medium">BETA 0.1</span>
                  <button 
                    onClick={() => setIsChatOpen(false)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-700 px-3 py-2 text-xs text-yellow-800 dark:text-yellow-300">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>AI DK Mandiri masih dalam tahap pengembangan.</span>
                </div>
              </div>
              
              <div 
                ref={messagesContainerRef}
                className="flex-1 p-3 overflow-y-auto max-h-[40vh] sm:max-h-[300px] bg-gray-50 dark:bg-gray-900 scroll-smooth"
              >
                {messages.map((msg, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`
                        max-w-[85%] rounded-2xl px-4 py-3 shadow-sm
                        ${msg.role === 'user' 
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 text-white rounded-br-none' 
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700'
                        }
                      `}
                    >
                      <div className="text-sm whitespace-pre-line break-words">
                        {msg.content.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < msg.content.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className={`text-xs mt-1.5 flex justify-end ${
                        msg.role === 'user' ? 'text-blue-100/80' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start mb-4"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 rounded-bl-none border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-1.5">
                        <motion.div 
                          className="bg-blue-600 dark:bg-blue-500 rounded-full h-2.5 w-2.5"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0 }}
                        />
                        <motion.div 
                          className="bg-blue-600 dark:bg-blue-500 rounded-full h-2.5 w-2.5"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                        />
                        <motion.div 
                          className="bg-blue-600 dark:bg-blue-500 rounded-full h-2.5 w-2.5"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-2">
                <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-600 transition-all duration-200">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ketik pesan..."
                    className="flex-1 px-3 py-2 focus:outline-none bg-transparent text-gray-800 dark:text-gray-100 text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className={`
                      px-3 py-2 transition-all duration-200 text-white
                      ${input.trim() && !isLoading ? 'bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 hover:from-cyan-700 hover:to-blue-700 dark:hover:from-cyan-600 dark:hover:to-blue-600' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}
                    `}
                    disabled={isLoading || !input.trim()}
                    aria-label="Kirim pesan"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={input.trim() ? 'transform -rotate-45' : ''}>
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
                <div className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400">
                  Tekan Enter untuk mengirim
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleChat}
          className={`
            bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 
            dark:from-cyan-700 dark:to-blue-700 dark:hover:from-cyan-600 dark:hover:to-blue-600 
            text-white rounded-full p-3 shadow-lg flex items-center justify-center
            transition-all duration-300 hover:scale-105
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isChatOpen ? { rotate: 180 } : { rotate: 0 }}
          aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
        >
          {isChatOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default ChatAssistant;