'use client';
import React, { useState, useRef, useEffect } from 'react';
import { sendMessage, ChatMessage } from '@/services/assistant';

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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 dark:from-cyan-700 dark:to-blue-700 dark:hover:from-cyan-600 dark:hover:to-blue-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
      >
        {isChatOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isChatOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 text-white px-4 py-3 flex items-center">
            <div className="h-8 w-8 rounded-full bg-cyan-500 dark:bg-cyan-600 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-sm">DK Mandiri Assistant <span className="text-xs bg-yellow-500 text-yellow-900 px-1.5 py-0.5 rounded-full ml-1">BETA 0.1</span></h3>
              <p className="text-xs text-blue-100 dark:text-cyan-100">Online</p>
            </div>
          </div>
          
          {/* Beta warning message */}
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-700 px-3 py-2 text-xs text-yellow-800 dark:text-yellow-300">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>AI DK Mandiri masih tahap versi 0.1 beta. Data bisa tidak akurat.</span>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 text-white rounded-br-none' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  <span className={`text-xs mt-1 block ${
                    msg.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="bg-gray-400 dark:bg-gray-500 rounded-full h-2 w-2 animate-bounce"></div>
                    <div className="bg-gray-400 dark:bg-gray-500 rounded-full h-2 w-2 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="bg-gray-400 dark:bg-gray-500 rounded-full h-2 w-2 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-2">
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ketik pesan..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 dark:from-cyan-700 dark:to-blue-700 dark:hover:from-cyan-600 dark:hover:to-blue-600 text-white rounded-r-lg px-4 py-2 disabled:opacity-50 transition-colors duration-200"
                disabled={isLoading || !input.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;