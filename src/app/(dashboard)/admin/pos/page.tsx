'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
  Search, 
  Package, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  Printer,
  Phone,
  User,
  CreditCard,
  Banknote,
  Receipt,
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatToIDR, formatWeight, unformatWeight } from '@/utils/formatter';
import { getAllProducts } from '@/services/product';
import { createTransaction, sendReceipt } from '@/services/transaction';
import { Product } from '@/types/product';
import { toast } from 'react-hot-toast';

export default function POSPage() {
  const { user } = useAuth();
  const router = useRouter();
  const printRef = useRef(null);
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('');
  
  // Cart state
  const [cartItems, setCartItems] = useState<Array<{
    productId: string;
    name: string;
    weight: number; // in grams
    pricePerUnit: number; // price per kg
    costPerUnit: number; // cost per kg
    image?: string;
    categoryName?: string;
  }>>([]);
  
  // Customer and cashier info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [shippingMethod, setShippingMethod] = useState('pickup');
  const [cashierName, setCashierName] = useState(user?.username || '');
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(p => p.category?.id || '')))
    .filter(Boolean)
    .map(id => {
      const product = products.find(p => p.category?.id === id);
      return {
        id,
        name: product?.category?.name || ''
      };
    });
  
  // Filter products based on search term and category
  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filterCategory || product.category?.id === filterCategory;
      
      return matchesSearch && matchesCategory && product.isAvailable && product.weightInStock > 0;
    });
    
    setFilteredProducts(filtered);
  }, [searchTerm, filterCategory, products]);
  
  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.weight / 1000) * item.pricePerUnit;
  }, 0);
  
  // Add item to cart
  const addToCart = (product: Product) => {
    // Check if product has stock
    if (product.weightInStock <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    
    // Check if item exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // If exists, update weight
      const updatedItems = [...cartItems];
      const minOrderWeight = Number(product.minOrderWeight);
      updatedItems[existingItemIndex].weight += minOrderWeight;
      
      // Check if weight exceeds stock
      if (updatedItems[existingItemIndex].weight > Number(product.weightInStock)) {
        toast.error(`Only ${formatWeight(product.weightInStock)} available in stock`);
        return;
      }
      
      setCartItems(updatedItems);
    } else {
      // If doesn't exist, add new item with min order weight
      const primaryImage = product.images?.find(img => img.isPrimary)?.imageUrl || 
                          (product.images && product.images.length > 0 ? product.images[0].imageUrl : undefined);
      
      setCartItems([...cartItems, {
        productId: product.id,
        name: product.name,
        weight: Number(product.minOrderWeight),
        pricePerUnit: Number(product.price),
        costPerUnit: Number(product.costPrice),
        image: primaryImage,
        categoryName: product.category?.name
      }]);
    }
    
    toast.success(`${product.name} added to cart`);
  };
  
  // Update cart item weight
  const updateCartItemWeight = (index: number, newWeight: number) => {
    const updatedItems = [...cartItems];
    const productId = updatedItems[index].productId;
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Validate min order weight
    if (newWeight < Number(product.minOrderWeight)) {
      toast.error(`Minimum order weight is ${formatWeight(product.minOrderWeight)}`);
      return;
    }
    
    // Validate stock
    if (newWeight > Number(product.weightInStock)) {
      toast.error(`Only ${formatWeight(product.weightInStock)} available in stock`);
      return;
    }
    
    updatedItems[index].weight = newWeight;
    setCartItems(updatedItems);
  };
  
  // Remove item from cart
  const removeFromCart = (index: number) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);
  };
  
  // Reset cart and form
  const resetPOS = () => {
    setCartItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    setPaymentMethod('CASH');
    setOrderComplete(false);
    setReceiptData(null);
    // Don't reset cashier name to preserve it between transactions
  };
  
  // Create order and process transaction
  const processTransaction = async () => {
    // Validate cart
    if (cartItems.length === 0) {
      toast.error('Please add items to cart');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Generate order number (timestamp-based)
      const orderNumber = `POS${Date.now()}`;
      
      // Prepare order data
      const transactionData = {
        orderNumber,
        customerName,
        customerPhone,
        deliveryAddress: deliveryAddress || 'In-store purchase',
        paymentMethod,
        totalAmount: cartTotal,
        orderItems: cartItems.map(item => ({
          productId: item.productId,
          weight: item.weight,
          pricePerUnit: item.pricePerUnit,
          costPerUnit: item.costPerUnit
        })),
        shippingMethod,
        staffName: cashierName || user?.username // Use custom cashier name or fall back to logged in user
      };
      
      // Create transaction
      const response = await createTransaction(transactionData);
      
      // Handle success
      setReceiptData(response.transaction);
      setOrderComplete(true);
      toast.success('Transaction successful');
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Send WhatsApp receipt
  const sendWhatsAppReceipt = async () => {
    if (!receiptData || !customerPhone) {
      toast.error('Customer phone number is required to send receipt');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Call your API to send the receipt
      await sendReceipt(receiptData.id);
      
      toast.success('Receipt sent via WhatsApp successfully');
    } catch (error) {
      console.error('Failed to send receipt:', error);
      toast.error('Failed to send receipt. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Print receipt
  const printReceipt = () => {
    if (printRef.current) {
      // Open a new window for printing
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        toast.error('Please allow pop-ups to print receipts');
        return;
      }
      
      // Get the invoice content
      const printContent = printRef.current.innerHTML;
      
      // Create a complete HTML document with proper styling
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice #${receiptData.orderNumber}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background: white;
                color: black;
              }
              * {
                box-sizing: border-box;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                padding: 8px 12px;
                text-align: left;
              }
              th {
                background-color: #f9fafb;
                font-size: 0.75rem;
                text-transform: uppercase;
                color: #6b7280;
              }
              tr:nth-child(even) {
                background-color: #f9fafb;
              }
              .bg-blue-600 {
                background-color: #2563eb;
                color: white;
              }
              .text-blue-100 {
                color: #dbeafe;
              }
              .text-gray-500 {
                color: #6b7280;
              }
              .text-gray-800 {
                color: #1f2937;
              }
              .font-semibold {
                font-weight: 600;
              }
              .font-medium {
                font-weight: 500;
              }
              .rounded-lg {
                border-radius: 0.5rem;
              }
              .bg-gray-50 {
                background-color: #f9fafb;
              }
              .text-xs {
                font-size: 0.75rem;
              }
              .text-sm {
                font-size: 0.875rem;
              }
              .text-right {
                text-align: right;
              }
              .border-t {
                border-top: 1px solid #e5e7eb;
              }
              .font-bold {
                font-weight: 700;
              }
              @media print {
                body {
                  print-color-adjust: exact;
                  -webkit-print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `;
      
      // Write to the new window and print
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load before printing
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        // Optional: close the window after printing
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      };
    } else {
      toast.error('Unable to generate receipt for printing');
    }
  };
  
  // Render product grid
  const renderProductGrid = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={36} className="animate-spin text-blue-600" />
        </div>
      );
    }
    
    if (filteredProducts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Package size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {searchTerm || filterCategory ? 'Try adjusting your filters' : 'Please add products to inventory'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => addToCart(product)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative h-24 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images.find(img => img.isPrimary)?.imageUrl || product.images[0].imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package size={24} className="text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-60 text-xs text-white py-1 px-2">
                Stock: {formatWeight(product.weightInStock)}
              </div>
            </div>
            
            <div className="p-2">
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded mb-1">
                {product.category?.name || 'Uncategorized'}
              </span>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                {product.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                Rp {formatToIDR(product.price)}/kg
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Min: {formatWeight(product.minOrderWeight)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };
  
  // Render cart
  const renderCart = () => {
    if (cartItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <ShoppingCart size={48} className="mb-4" />
          <p>Cart is empty</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <div key={`${item.productId}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-200 dark:bg-gray-700">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package size={20} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.categoryName}</p>
                <p className="text-xs text-gray-600">
                  Rp {formatToIDR(item.pricePerUnit)}/kg
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center mr-3">
                <button 
                  onClick={() => updateCartItemWeight(index, Math.max(0, item.weight - 100))}
                  className="p-1 rounded-full bg-gray-200 dark:bg-gray-700"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="text"
                  value={formatWeight(item.weight)}
                  onChange={(e) => {
                    const rawValue = unformatWeight(e.target.value);
                    updateCartItemWeight(index, rawValue);
                  }}
                  className="w-20 mx-1 px-2 py-1 text-center text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
                />
                <button 
                  onClick={() => updateCartItemWeight(index, item.weight + 100)}
                  className="p-1 rounded-full bg-gray-200 dark:bg-gray-700"
                >
                  <Plus size={14} />
                </button>
              </div>
              
              <div className="text-right min-w-[80px] mr-2">
                <p className="font-semibold">
                  Rp {formatToIDR((item.weight / 1000) * item.pricePerUnit)}
                </p>
              </div>
              
              <button 
                onClick={() => removeFromCart(index)}
                className="p-1 text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between font-semibold text-lg mb-6">
            <span>Total</span>
            <span>Rp {formatToIDR(cartTotal)}</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                Customer Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Customer name (optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="pl-10 w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                WhatsApp Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="For receipt & notifications"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="pl-10 w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                Delivery Address (optional)
              </label>
              <textarea
                placeholder="Leave empty for in-store purchase"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={2}
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`flex items-center justify-center px-4 py-2 border rounded-lg ${
                    paymentMethod === 'CASH' 
                      ? 'bg-blue-100 border-blue-500 text-blue-800' 
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setPaymentMethod('CASH')}
                >
                  <Banknote size={16} className="mr-2" />
                  Cash
                </button>
                {/* All Bank Payment */}
                <button
                  type="button"
                  className={`flex items-center justify-center px-4 py-2 border rounded-lg ${
                    paymentMethod === 'BANK' 
                      ? 'bg-blue-100 border-blue-500 text-blue-800' 
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setPaymentMethod('BANK')}
                >
                  <Banknote size={16} className="mr-2" />
                  Bank
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center px-4 py-2 border rounded-lg ${
                    paymentMethod === 'CARD' 
                      ? 'bg-blue-100 border-blue-500 text-blue-800' 
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setPaymentMethod('CARD')}
                >
                  <CreditCard size={16} className="mr-2" />
                  Card
                </button>
                {/* QRIS Payment */}
                <button
                  type="button"
                  className={`flex items-center justify-center px-4 py-2 border rounded-lg ${
                    paymentMethod === 'QRIS' 
                      ? 'bg-blue-100 border-blue-500 text-blue-800' 
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setPaymentMethod('QRIS')}
                  >
                  <Receipt size={16} className="mr-2" />
                  Qris
                  </button>
                  
              </div>
            </div>
            
            <button
              onClick={processTransaction}
              disabled={cartItems.length === 0 || isProcessing}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Process Transaction
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render order complete with enhanced invoice
  const renderOrderComplete = () => {
    if (!receiptData) return null;
    
    const currentDate = new Date();
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(currentDate);
    
    return (
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center">
          <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Transaction Complete</h2>
          <p className="text-gray-600 dark:text-gray-400">Order #{receiptData.orderNumber}</p>
        </div>
        
        {/* Invoice container with print-friendly inner content */}
        <div className="w-full max-w-md rounded-lg shadow-lg mb-6 overflow-hidden dark:shadow-gray-800 border border-gray-200 dark:border-gray-700">
          {/* This outer div handles dark mode but won't affect printing */}
          <div className="dark:bg-gray-800">
            {/* This inner div is what gets printed and always stays light-themed */}
            <div ref={printRef} className="w-full bg-white p-0">
              {/* Invoice Header */}
              <div className="bg-blue-600 p-6 text-white">
                <div className="text-center">
                  <h3 className="text-2xl font-bold tracking-wide">INVOICE</h3>
                  <p className="text-blue-100 mt-1">Your Store Name</p>
                </div>
              </div>
              
              {/* Invoice Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs text-gray-500">Invoice Number</p>
                    <p className="font-semibold text-gray-800">#{receiptData.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Date & Time</p>
                    <p className="font-semibold text-gray-800">{formattedDate}</p>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <User size={14} className="mr-2" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-800">{customerName || 'Walk-in Customer'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-800">{customerPhone || '-'}</p>
                    </div>
                    {deliveryAddress && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="font-medium text-gray-800">{deliveryAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Order Items */}
                <h4 className="font-medium text-gray-700 mb-3">Items Purchased</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-xs uppercase">
                      <tr>
                        <th className="text-left py-3 px-4 text-gray-500">Item</th>
                        <th className="text-right py-3 px-4 text-gray-500">Qty</th>
                        <th className="text-right py-3 px-4 text-gray-500">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cartItems.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-3 px-4 text-gray-800">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.categoryName}</div>
                          </td>
                          <td className="text-right py-3 px-4 text-gray-800">
                            {formatWeight(item.weight)}
                          </td>
                          <td className="text-right py-3 px-4 text-gray-800">
                            Rp {formatToIDR((item.weight / 1000) * item.pricePerUnit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={2} className="py-3 px-4 text-right font-semibold text-gray-700">Total:</td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">Rp {formatToIDR(cartTotal)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                {/* Payment Info */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="font-semibold text-gray-800">{paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Staff</p>
                    <p className="font-semibold text-gray-800">{cashierName || user?.username}</p>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="border-t border-gray-200 pt-6 text-center">
                  <div className="mb-2">
                    <p className="text-gray-800 font-medium">Thank you for your purchase!</p>
                    <p className="text-sm text-gray-600">For questions or assistance, call: 0812-3456-7890</p>
                  </div>
                  
                  {/* Store Address */}
                  <div className="text-xs text-gray-500 mt-4">
                    <p>Your Store Name</p>
                    <p>Jl. Store Address No. 123, City</p>
                    <p>Email: store@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={printReceipt}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <Printer size={18} className="mr-2" />
            Print Receipt
          </button>
          
          {customerPhone && (
            <button
              onClick={sendWhatsAppReceipt}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
            >
              <Phone size={18} className="mr-2" />
              Send via WhatsApp
            </button>
          )}
          
          <button
            onClick={resetPOS}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-lg flex items-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            New Transaction
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            POS System
          </h1>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <strong className="mr-2">Cashier:</strong> 
              <input
                type="text"
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                placeholder={user?.username || 'Cashier name'}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-40"
              />
            </div>
          </div>
        </div>
        
        {orderComplete ? (
          renderOrderComplete()
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="w-full md:w-64">
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  {renderProductGrid()}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden h-full">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="font-bold text-lg flex items-center">
                    <ShoppingCart size={18} className="mr-2" />
                    Shopping Cart
                  </h2>
                  {cartItems.length > 0 && (
                    <button
                      onClick={() => setCartItems([])}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Clear
                    </button>
                  )}
                </div>
                
                <div className="p-4 h-full overflow-y-auto">
                  {renderCart()}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}