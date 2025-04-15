'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCart, updateCartItem, removeFromCart, clearCart } from '@/services/cart';
import { formatToIDR } from '@/utils/formatter';
import { CartSummary } from '@/types/cart';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [cartData, setCartData] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch cart data
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (authLoading) return;
        if (!user) {
          router.push('/login?redirect=/cart');
          return;
        }

        setIsLoading(true);
        const data = await getCart();
        setCartData(data);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        setError('Failed to load your cart. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [user, authLoading, router]);

  // Handle weight changes
  const handleWeightChange = async (id: string, newWeight: number) => {
    if (!cartData) return;
    
    const item = cartData.items.find(item => item.id === id);
    if (!item) return;
    
    // Don't allow below minimum order weight
    if (newWeight < item.product.minOrderWeight) {
      toast.error(`Minimum order weight is ${item.product.minOrderWeight}g`);
      return;
    }

    // Don't allow above available stock
    if (newWeight > item.product.weightInStock) {
      toast.error(`Only ${item.product.weightInStock}g available in stock`);
      return;
    }

    try {
      setUpdatingItems(prev => ({ ...prev, [id]: true }));
      
      // Update cart item
      await updateCartItem(id, { weight: newWeight });
      
      // Update local state
      setCartData(prevCart => {
        if (!prevCart) return null;
        
        const updatedItems = prevCart.items.map(item => {
          if (item.id === id) {
            const newTotalPrice = (item.product.price / 1000) * newWeight;
            return {
              ...item,
              weight: newWeight,
              totalPrice: newTotalPrice
            };
          }
          return item;
        });
        
        return {
          ...prevCart,
          items: updatedItems,
          subtotal: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
        };
      });
      
      toast.success('Cart updated');
    } catch (error) {
      console.error('Failed to update cart item:', error);
      toast.error('Failed to update cart item');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [id]: false }));
    }
  };

  // Handle item removal
  const handleRemoveItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) return;
    
    try {
      setUpdatingItems(prev => ({ ...prev, [id]: true }));
      await removeFromCart(id);
      
      // Update local state
      setCartData(prevCart => {
        if (!prevCart) return null;
        
        const updatedItems = prevCart.items.filter(item => item.id !== id);
        
        return {
          ...prevCart,
          items: updatedItems,
          totalItems: updatedItems.length,
          subtotal: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
        };
      });
      
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  // Handle cart clear
  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) return;
    
    try {
      setIsLoading(true);
      await clearCart();
      setCartData({
        items: [],
        totalItems: 0,
        subtotal: 0
      });
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    router.push('/checkout');
  };

  // Loading state
  if (isLoading || authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <Loader2 size={40} className="animate-spin text-cyan-600" />
        </div>
        <Footer />
      </>
    );
  }

  // User not logged in
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md w-full text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Login Required</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please log in to view your shopping cart.
            </p>
            <Link href="/login?redirect=/cart">
              <button className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300">
                Log In
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md w-full text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Empty cart
  if (!cartData || cartData.items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link href="/product">
                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {cartData.totalItems} {cartData.totalItems === 1 ? 'Item' : 'Items'}
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear Cart
                  </button>
                </div>
                
                {/* Cart item list */}
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cartData.items.map((item) => (
                    <motion.li 
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6 flex flex-col sm:flex-row"
                    >
                      {/* Product image */}
                      <div className="relative h-24 w-24 rounded-md overflow-hidden mb-4 sm:mb-0">
                        <Image
                          src={item.product.imageUrl || '/images/placeholder.jpg'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      
                      {/* Product info */}
                      <div className="sm:ml-6 flex-1">
                        <div className="flex justify-between mb-2">
                          <Link href={`/product/${item.product.id}`} className="hover:underline">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {item.product.name}
                            </h3>
                          </Link>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-500 hover:text-red-500"
                            disabled={updatingItems[item.id]}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          {formatToIDR(item.product.price)}/kg
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          {/* Weight controls */}
                          <div className="flex items-center">
                            <button
                              onClick={() => handleWeightChange(item.id, item.weight - 100)}
                              disabled={updatingItems[item.id] || item.weight <= item.product.minOrderWeight}
                              className="h-8 w-8 flex items-center justify-center rounded-l-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <div className="relative">
                              <input
                                type="number"
                                min={item.product.minOrderWeight}
                                max={item.product.weightInStock}
                                value={item.weight}
                                onChange={(e) => handleWeightChange(item.id, parseInt(e.target.value) || 0)}
                                className="h-8 w-20 px-2 text-center border-y border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                              />
                              <div className="absolute right-3 top-2 text-xs text-gray-500 dark:text-gray-400">g</div>
                            </div>
                            <button
                              onClick={() => handleWeightChange(item.id, item.weight + 100)}
                              disabled={updatingItems[item.id] || item.weight >= item.product.weightInStock}
                              className="h-8 w-8 flex items-center justify-center rounded-r-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {/* Item price */}
                          <div className="text-right">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {formatToIDR(item.totalPrice)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {(item.weight / 1000).toFixed(1)} kg × {formatToIDR(item.product.price)}/kg
                            </div>
                          </div>
                        </div>
                        
                        {/* Update indicator */}
                        {updatingItems[item.id] && (
                          <div className="mt-2 text-xs text-cyan-600 dark:text-cyan-400 flex items-center">
                            <Loader2 className="animate-spin h-3 w-3 mr-1" />
                            Updating...
                          </div>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 sticky top-20">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatToIDR(cartData.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-600 dark:text-gray-400">Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{formatToIDR(cartData.subtotal)}</span>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                  
                  <Link href="/product">
                    <button className="w-full py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 mt-2">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}