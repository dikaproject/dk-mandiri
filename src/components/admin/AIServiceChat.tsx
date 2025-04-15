'use client';

import { useState, useRef, useEffect } from 'react';
import { sendAdminChatMessage } from '@/services/aiservice';
import { toast } from 'react-hot-toast';
import { Loader2, Send, Bot, User, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
}

export default function AIServiceChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting message
  useEffect(() => {
    // Add initial greeting only if there are no messages yet
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          content: "Halo! Saya AI Assistant DK Mandiri. Saya dapat membantu Anda mengelola website, membuat produk baru, atau menjawab pertanyaan. Apa yang bisa saya bantu hari ini?",
          isAI: true,
          timestamp: new Date()
        }
      ]);
    }
  }, []); 

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendAdminChatMessage(input);
      
      // Add AI response message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Handle action if present (like creating a product)
      if (response.actionData) {
        handleActionData(response.actionData);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Gagal mengirim pesan. Silakan coba lagi.');
      
      // Add error message from AI
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: "Maaf, terjadi kesalahan saat memproses permintaan Anda.",
        isAI: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionData = async (actionData: any) => {
    if (actionData.action === "CREATE_PRODUCT" && actionData.success) {
      setProcessingAction(true);
      
      // Add processing message
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        content: "⚙️ Generate Product Otomatis DK Mandiri AI Pintar...",
        isAI: true,
        timestamp: new Date()
      }]);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add success message
      setMessages(prev => [...prev, {
        id: (Date.now() + 3).toString(),
        content: `✅ Produk berhasil dibuat: ${actionData.product.name}\n\nCatatan: Image default telah ditambahkan. Silahkan edit gambar produk dengan gambar yang sesuai.`,
        isAI: true,
        timestamp: new Date()
      }]);
      
      toast.success('Produk berhasil dibuat!');
      setProcessingAction(false);
      
      // Option to navigate to edit product page
      setTimeout(() => {
        const confirm = window.confirm('Apakah Anda ingin mengedit produk yang baru dibuat?');
        if (confirm) {
          router.push(`/admin/products/edit/${actionData.product.id}`);
        }
      }, 1000);
    }
  };

  const formattedDate = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${isExpanded ? 'h-[500px] w-[400px]' : 'h-12 w-12'}`}>
      {/* Chat toggle button */}
      {!isExpanded ? (
        <button 
          onClick={() => setIsExpanded(true)} 
          className="h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center"
        >
          <Bot size={20} />
        </button>
      ) : (
        <>
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Bot size={20} className="mr-2" />
              <h3 className="font-medium">DK Mandiri AI Assistant</h3>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-white hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${msg.isAI 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-gray-800 dark:text-gray-100' 
                    : 'bg-blue-600 text-white'}`}
                  >
                    <div className="flex items-center mb-1">
                      {msg.isAI ? (
                        <Bot size={16} className="mr-1" />
                      ) : (
                        <User size={16} className="mr-1" />
                      )}
                      <span className="text-xs opacity-70">{formattedDate(msg.timestamp)}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}
            {processingAction && (
              <div className="flex justify-center">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg p-2 px-3 text-xs animate-pulse">
                  Memproses aksi...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <form onSubmit={handleSend} className="border-t dark:border-gray-700 p-3 flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || processingAction}
              placeholder="Tanyakan sesuatu..."
              className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-full py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || processingAction}
              className="ml-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}