'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { sendAdminChatMessage } from '@/services/aiservice';
import { toast } from 'react-hot-toast';
import { Loader2, Bot, User, PlusCircle, Edit, Trash, Info, FileText, Sparkles, CheckCircle2, Send, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TextareaAutosize from 'react-textarea-autosize';
import useSWR from 'swr';

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
}

interface QuickPrompt {
  title: string;
  icon: React.ReactNode;
  prompt: string;
  mode?: 'create' | 'edit';
  category?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
}

export default function AIServicePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  const [smartMode, setSmartMode] = useState<'off' | 'create' | 'edit'>('off');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  
  // Load products for edit mode
  const { data: products } = useSWR<Product[]>(smartMode === 'edit' ? '/api/products' : null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!products || !searchTerm) return [];
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Limit search results
  }, [products, searchTerm]);

  // Quick prompts for common actions
  const quickPrompts: QuickPrompt[] = [
    {
      title: 'Buat Produk Ikan',
      icon: <PlusCircle size={16} className="mr-1" />,
      prompt: 'Tolong bantu saya menambahkan produk baru untuk ikan bawal dengan harga jual 30000 dan harga modal 22000 di kategori ikan laut. Stoknya 5000 gram.',
      mode: 'create',
      category: 'Ikan Laut'
    },
    {
      title: 'Buat Produk Udang',
      icon: <PlusCircle size={16} className="mr-1" />,
      prompt: 'Buat produk udang windu dengan harga jual 85000 dan harga modal 65000 di kategori udang. Stoknya 3000 gram.',
      mode: 'create',
      category: 'Udang'
    },
    {
      title: 'Tutorial Edit Produk',
      icon: <Edit size={16} className="mr-1" />,
      prompt: 'Bagaimana cara edit produk yang sudah ada?'
    },
    {
      title: 'Tutorial Pesanan',
      icon: <FileText size={16} className="mr-1" />,
      prompt: 'Bagaimana cara mengubah status pesanan menjadi sedang dikirim?'
    }
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          content: "Selamat datang di DK Mandiri AI Service! Saya dapat membantu Anda dengan berbagai tugas administratif seperti:\n\n• Membuat produk baru otomatis\n• Memberikan tutorial penggunaan sistem\n• Menjawab pertanyaan tentang fitur admin\n• Membantu troubleshooting masalah\n\nApa yang bisa saya bantu hari ini?",
          isAI: true,
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  // Focus textarea on mode change
  useEffect(() => {
    if (smartMode !== 'off') {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [smartMode]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input || !input.trim() || isLoading) return;

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
      // Kirim permintaan dengan informasi mode
      const response = await sendAdminChatMessage(input, {
        smartMode: smartMode !== 'off' ? smartMode : undefined
      });
      
      // Add AI response message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Handle action if present (like creating or editing a product)
      if (response.actionData) {
        handleActionData(response.actionData);
      }
      
      // Jika menggunakan smart mode, reset setelah selesai
      if (smartMode !== 'off') {
        setSmartMode('off');
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
      // Focus back on textarea
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleActionData = async (actionData: any) => {
    setProcessingAction(true);

    // Handle CREATE_PRODUCT failure
    if (actionData.action === "CREATE_PRODUCT" && !actionData.success) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        content: "❌ **Gagal membuat produk**\n\n" + (actionData.error || "Terjadi kesalahan saat mencoba membuat produk."),
        isAI: true,
        timestamp: new Date()
      }]);
      
      toast.error(actionData.error || "Gagal membuat produk");
    }
    // Handle CREATE_PRODUCT success
    else if (actionData.action === "CREATE_PRODUCT" && actionData.success) {
      // Add processing message with animation
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        content: "⚙️ Generate Product Otomatis DK Mandiri AI Pintar...",
        isAI: true,
        timestamp: new Date()
      }]);
      
      // Simulate processing delay with step-by-step updates
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev, {
        id: (Date.now() + 3).toString(),
        content: "📝 Menyiapkan data produk...",
        isAI: true,
        timestamp: new Date()
      }]);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev, {
        id: (Date.now() + 4).toString(),
        content: "📊 Menghasilkan slug dan informasi produk...",
        isAI: true,
        timestamp: new Date()
      }]);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev, {
        id: (Date.now() + 5).toString(),
        content: "🖼️ Menambahkan placeholder image...",
        isAI: true,
        timestamp: new Date()
      }]);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add success message with product details
      const productDetails = `
✅ **Produk berhasil dibuat!**

**Detail Produk:**
- **Nama:** ${actionData.product.name}
- **Harga Jual:** Rp ${parseInt(actionData.product.price).toLocaleString('id')}
- **Harga Modal:** Rp ${parseInt(actionData.product.costPrice).toLocaleString('id')}
- **Stok:** ${actionData.product.weightInStock} gram
- **Min. Order:** ${actionData.product.minOrderWeight} gram
- **Kategori ID:** ${actionData.product.categoryId}

**ID Produk:** ${actionData.product.id}

**Catatan:** Image default telah ditambahkan. Silahkan edit gambar produk dengan gambar yang sesuai.`;
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 6).toString(),
        content: productDetails,
        isAI: true,
        timestamp: new Date()
      }]);
      
      toast.success('Produk berhasil dibuat!', {
        icon: '✅',
        duration: 5000
      });
    } 
    // Handle UPDATE_PRODUCT failure
    else if (actionData.action === "UPDATE_PRODUCT" && !actionData.success) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        content: "❌ **Gagal memperbarui produk**\n\n" + (actionData.error || "Terjadi kesalahan saat mencoba memperbarui produk."),
        isAI: true,
        timestamp: new Date()
      }]);
      
      toast.error(actionData.error || "Gagal memperbarui produk");
    }
    // Handle UPDATE_PRODUCT success
    else if (actionData.action === "UPDATE_PRODUCT" && actionData.success) {
      // Animasi untuk update produk
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        content: "⚙️ Memperbarui Product DK Mandiri AI Pintar...",
        isAI: true,
        timestamp: new Date()
      }]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add success message with updated product details
      const productDetails = `
✅ **Produk berhasil diperbarui!**

**Detail Produk Terbaru:**
- **Nama:** ${actionData.product.name}
- **Harga Jual:** Rp ${parseInt(actionData.product.price).toLocaleString('id')}
- **Harga Modal:** Rp ${parseInt(actionData.product.costPrice).toLocaleString('id')}
- **Stok:** ${actionData.product.weightInStock} gram
- **Min. Order:** ${actionData.product.minOrderWeight} gram

**ID Produk:** ${actionData.product.id}`;
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 3).toString(),
        content: productDetails,
        isAI: true,
        timestamp: new Date()
      }]);
      
      toast.success('Produk berhasil diperbarui!', {
        icon: '✅',
        duration: 5000
      });
    }
    
    setProcessingAction(false);
    
    // Add action buttons after processing - only for success cases
    if ((actionData.action === "CREATE_PRODUCT" || actionData.action === "UPDATE_PRODUCT") && actionData.success) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 7).toString(),
        content: `**Aksi selanjutnya:**

[Lihat Produk](/admin/product) | [Edit Produk](/admin/product/edit/${actionData.product.id})`,
        isAI: true,
        timestamp: new Date()
      }]);
    } else if (actionData.action === "UPDATE_PRODUCT" && !actionData.success) {
      // Add helpful tips for user
      setMessages(prev => [...prev, {
        id: (Date.now() + 7).toString(),
        content: `**Tips:**\nPastikan Anda memberikan ID produk yang valid atau nama produk yang detail untuk mengedit. Anda juga bisa mencari produk terlebih dahulu di [halaman produk](/admin/product).`,
        isAI: true,
        timestamp: new Date()
      }]);
    }
  };

  const toggleSmartMode = (mode: 'create' | 'edit') => {
    const newMode = smartMode === mode ? 'off' : mode;
    setSmartMode(newMode);
    
    if (newMode === 'edit') {
      // Better instructions for edit mode
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: `🔮 **Mode AI Pintar Edit Produk diaktifkan!**\n\nUntuk mengedit produk, berikan informasi berikut:\n\n1️⃣ **ID atau nama lengkap produk** yang ingin diubah\n2️⃣ **Detail yang ingin diubah**, misalnya:\n- Nama: [nama baru]\n- Harga Jual: [harga baru]\n- Harga Modal: [modal baru]\n- Stok: [jumlah gram]\n\n**Contoh:** Edit produk dengan ID abc123 (Ikan Nila). Ubah harga jual menjadi 35000 dan stok menjadi 4500 gram.\n\n**Tips:** Gunakan pencarian produk di atas untuk menemukan ID produk yang valid.`,
        isAI: true,
        timestamp: new Date()
      }]);
    } else if (newMode === 'create') {
      // Create mode message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: `🔮 **Mode AI Pintar Pembuatan Produk diaktifkan!**\n\nSilahkan berikan detail produk baru dengan format seperti:\n\n- Nama: [nama produk]\n- Kategori: [nama kategori]\n- Harga Jual: [nominal]\n- Harga Modal: [nominal]\n- Stok: [gram]\n- Min. Order: [gram]\n- Deskripsi: [deskripsi produk]`,
        isAI: true,
        timestamp: new Date()
      }]);
    }
  };

  const handleQuickPrompt = (prompt: QuickPrompt) => {
    // Safety check
    if (!prompt || !prompt.prompt) return;
    
    // Fill the input field with the prompt text
    setInput(prompt.prompt);
    
    // If prompt has a mode, activate smart mode
    if (prompt.mode) {
      setSmartMode(prompt.mode);
    }
    
    // Focus the textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const formattedDate = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle keydown for submitting with Ctrl+Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && input && input.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0 flex items-center">
            <Bot className="mr-2 text-blue-600 dark:text-blue-400" size={24} />
            DK Mandiri AI Service
          </h1>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => toggleSmartMode('create')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                smartMode === 'create' 
                  ? 'bg-green-600 text-white dark:bg-green-500 dark:text-gray-900' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Sparkles className={`mr-1.5 h-4 w-4 ${smartMode === 'create' ? 'text-white dark:text-gray-900' : 'text-yellow-500 dark:text-yellow-400'}`} />
              Mode Buat Produk
            </button>
            
            <button
              onClick={() => toggleSmartMode('edit')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                smartMode === 'edit' 
                  ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-900' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Edit className={`mr-1.5 h-4 w-4 ${smartMode === 'edit' ? 'text-white dark:text-gray-900' : 'text-blue-500 dark:text-blue-400'}`} />
              Mode Edit Produk
            </button>
          </div>
        </div>
        
        {smartMode !== 'off' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              smartMode === 'create' 
                ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400' 
                : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400'
            }`}
          >
            <div className="flex items-center">
              <Sparkles className={`h-5 w-5 mr-2 ${
                smartMode === 'create' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-blue-600 dark:text-blue-400'
              }`} />
              <h2 className={`font-semibold ${
                smartMode === 'create' 
                  ? 'text-green-800 dark:text-green-300' 
                  : 'text-blue-800 dark:text-blue-300'
              }`}>
                Mode AI Pintar {smartMode === 'create' ? 'Pembuatan' : 'Edit'} Produk Aktif
              </h2>
            </div>
            <p className={`mt-2 text-sm ${
              smartMode === 'create' 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              {smartMode === 'create' 
                ? 'Berikan detail lengkap produk baru dan AI akan membuatkan produk secara otomatis.' 
                : 'Tentukan ID produk dan detail yang ingin diubah, AI akan memperbarui informasi produk.'}
            </p>
          </motion.div>
        )}

        {/* Product Search for Edit Mode */}
        {smartMode === 'edit' && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cari produk untuk diedit:
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Ketik nama produk..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            {searchTerm && filteredProducts && filteredProducts.length > 0 && (
              <div className="mt-2 space-y-1">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setInput(`Edit produk dengan ID ${product.id} (${product.name}). Ubah harga menjadi [harga baru], stok menjadi [stok baru gram].`);
                      setSearchTerm('');
                      textareaRef.current?.focus();
                    }}
                    className="flex items-center justify-between w-full text-left text-sm p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                  >
                    <span className="text-gray-800 dark:text-gray-200">{product.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">ID: {product.id}</span>
                  </button>
                ))}
              </div>
            )}
            
            {searchTerm && (!filteredProducts || filteredProducts.length === 0) && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Tidak ada produk yang ditemukan.
              </p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Quick prompts */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Prompt Cepat</h2>
              
              <div className="space-y-3">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    disabled={isLoading || processingAction}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all flex items-center"
                  >
                    {prompt.icon}
                    <span className="dark:text-gray-300">{prompt.title}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 text-sm mb-2">Tips Penggunaan</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Klik prompt cepat untuk mengisi area pesan, lalu sesuaikan sesuai kebutuhan Anda. Tekan <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">Ctrl+Enter</kbd> untuk mengirim pesan.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right column: Chat interface */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-[650px]">
              {/* Chat header */}
              <div className={`p-3 flex items-center justify-between ${
                smartMode === 'create' 
                  ? 'bg-green-600 dark:bg-green-500' 
                  : smartMode === 'edit' 
                    ? 'bg-blue-600 dark:bg-blue-500' 
                    : 'bg-blue-600 dark:bg-blue-600'
              } text-white dark:text-gray-100`}>
                <div className="flex items-center">
                  <Bot size={18} className="mr-2" />
                  <h3 className="font-medium">
                    {smartMode === 'off' 
                      ? 'Chat dengan AI Assistant' 
                      : `Mode AI Pintar: ${smartMode === 'create' ? 'Pembuatan Produk' : 'Edit Produk'}`}
                  </h3>
                </div>
                
                {smartMode !== 'off' && (
                  <button 
                    onClick={() => setSmartMode('off')}
                    className="text-white hover:text-gray-200 bg-white/20 rounded p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4 bg-gray-50 dark:bg-gray-900">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[85%] rounded-lg p-3 ${
                        msg.isAI 
                          ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100' 
                          : 'bg-blue-600 dark:bg-blue-500 text-white'
                      }`}
                      >
                        <div className="flex items-center mb-1">
                          {msg.isAI ? (
                            <Bot size={16} className="mr-1 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <User size={16} className="mr-1" />
                          )}
                          <span className="text-xs opacity-70">{formattedDate(msg.timestamp)}</span>
                        </div>
                        <div className="whitespace-pre-wrap text-sm prose dark:prose-invert max-w-none" 
                          dangerouslySetInnerHTML={{ 
                            __html: msg.content
                              .replace(/⚙️/g, '<span class="dark:text-blue-300">⚙️</span>')
                              .replace(/📝/g, '<span class="dark:text-green-300">📝</span>')
                              .replace(/📊/g, '<span class="dark:text-yellow-300">📊</span>')
                              .replace(/🖼️/g, '<span class="dark:text-purple-300">🖼️</span>')
                              .replace(/✅/g, '<span class="dark:text-green-300">✅</span>')
                              .replace(/🔮/g, '<span class="dark:text-purple-300">🔮</span>')
                              .replace(/❌/g, '<span class="dark:text-red-300">❌</span>')
                              .replace(/1️⃣/g, '<span class="dark:text-yellow-300">1️⃣</span>')
                              .replace(/2️⃣/g, '<span class="dark:text-yellow-300">2️⃣</span>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
                              .replace(/\n/g, '<br/>') 
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-lg p-3 flex items-center space-x-2">
                      <Bot size={16} className="text-blue-600 dark:text-blue-400" />
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Mengetik...</span>
                    </div>
                  </motion.div>
                )}
                
                {processingAction && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                  >
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg p-2 px-4 text-sm animate-pulse flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sedang memproses... Mohon tunggu
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input area */}
              <form onSubmit={handleSend} className="border-t dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
                <div className="flex flex-col space-y-2">
                  <div className="relative">
                    <TextareaAutosize
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading || processingAction}
                      placeholder={smartMode !== 'off' 
                        ? `Ketik detail ${smartMode === 'create' ? 'produk baru' : 'perubahan produk'}...` 
                        : "Ketik pesan atau perintah..."
                      }
                      className={`w-full px-4 py-3 pr-12 rounded-lg border resize-none focus:ring-2 focus:outline-none text-gray-900 dark:text-white ${
                        smartMode === 'create' 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 focus:ring-green-500' 
                          : smartMode === 'edit'
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 focus:ring-blue-500'
                            : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      }`}
                      minRows={1}
                      maxRows={5}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input || !input.trim() || processingAction}
                      className={`absolute right-2 bottom-2 p-2 rounded-md focus:outline-none focus:ring-2 ${
                        smartMode === 'create' 
                          ? 'text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 focus:ring-green-500 disabled:text-green-400/50 dark:disabled:text-green-400/50' 
                          : smartMode === 'edit'
                            ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:ring-blue-500 disabled:text-blue-400/50 dark:disabled:text-blue-400/50'
                            : 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:ring-blue-500 disabled:text-blue-400/50 dark:disabled:text-blue-400/50'
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 px-1">
                    <div>
                      <span className="mr-1">Tekan</span>
                      <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Enter</kbd>
                      <span className="ml-1">untuk mengirim</span>
                    </div>
                    {input && input.length > 0 && (
                      <div>{input.length} karakter</div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}