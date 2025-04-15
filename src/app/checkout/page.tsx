'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Loader2, ShoppingCart, MapPin, Plus, Truck, AlertTriangle, CreditCard } from 'lucide-react';
import { getCart } from '@/services/cart';
import { createOrder } from '@/services/order';
import { getUserAddresses } from '@/services/address';
import { Address } from '@/types/address';
import { CartSummary } from '@/types/cart';
import { formatToIDR } from '@/utils/formatter';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import AddAddressModal from '@/components/section/Checkout/AddAddressModal';

const SHIPPING_METHODS = [
    {
        id: 'pickup',
        name: 'Ambil Sendiri',
        description: 'Ambil pesanan langsung di toko kami',
        price: 0
    },
    {
        id: 'short_delivery',
        name: 'Pengiriman Dekat ( radius 1-5km )',
        description: 'Pengiriman dalam area sekitar nusawungu',
        price: 0
    },
    {
        id: 'local_delivery',
        name: 'Pengiriman Lokal ( radius 5-10km )',
        description: 'Pengiriman dalam area sekitar nusawungu( radius 5-10km )',
        price: 10000
    },
    {
        id: 'sumpiuh_delivery',
        name: 'Pengiriman Lokal Sumpiuh ( radius 15-25km )',
        description: 'Pengiriman dalam area sekita nusawungu, kroya, sumpiuh ( radius 15-25km )',
        price: 15000
    },
    {
        id: 'kroya_delivery',
        name: 'Pengiriman Lokal Kroya ( radius 15-25km )',
        description: 'Pengiriman dalam area sekitar kroya ( radius 15-25km )',
        price: 20000
    },
    {
        id: 'shipping',
        name: 'Pengiriman Radius 35km - 50km',
        description: 'Pengiriman ke Area cilacap kota, Banyumas, Purbalingga. ( max radius 55km )',
        price: 50000
    }
];

// Add payment method options constant
const PAYMENT_METHODS = [
    {
        id: 'midtrans',
        name: 'Pembayaran Online',
        description: 'Bayar dengan e-wallet, kartu kredit, atau virtual account melalui gateway Midtrans',
        image: '/midtrans.webp',
    },
    {
        id: 'manual',
        name: 'Transfer Bank Manual',
        description: 'Transfer ke rekening bank kami dan upload bukti pembayaran',
        image: '/bank-transfer.webp',
    },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    // State
    const [cartData, setCartData] = useState<CartSummary | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('pickup');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('');

    // Fetch cart and addresses
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (authLoading) return;
                if (!user) {
                    router.push('/login?redirect=/checkout');
                    return;
                }

                setIsLoading(true);
                const [cartResponse, addressesResponse] = await Promise.all([
                    getCart(),
                    getUserAddresses()
                ]);

                setCartData(cartResponse);
                setAddresses(addressesResponse);

                // Select first address as default if available
                if (addressesResponse.length > 0) {
                    setSelectedAddressId(addressesResponse[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch checkout data:', error);
                setError('Failed to load checkout data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, authLoading, router]);

    // Calculate total amount with shipping
    const calculateTotal = () => {
        if (!cartData) return 0;

        const shippingMethod = SHIPPING_METHODS.find(method => method.id === selectedShippingMethod);
        const shippingCost = shippingMethod?.price || 0;

        return cartData.subtotal + shippingCost;
    };

    // Handle address added
    const handleAddressAdded = (newAddress: Address) => {
        setAddresses([...addresses, newAddress]);
        setSelectedAddressId(newAddress.id);
        setIsModalOpen(false);
        toast.success('Alamat berhasil ditambahkan');
    };

    // Handle place order
    const handlePlaceOrder = async () => {
        try {
            if (!cartData || cartData.items.length === 0) {
                toast.error('Keranjang Anda kosong');
                return;
            }

            if (selectedShippingMethod !== 'pickup' && !selectedAddressId) {
                toast.error('Pilih alamat pengiriman');
                return;
            }
            
            // Make sure payment method is selected
            if (!paymentMethod) {
                toast.error('Pilih metode pembayaran');
                return;
            }

            setIsSubmitting(true);

            // Dapatkan biaya pengiriman dari metode yang dipilih
            const selectedMethod = SHIPPING_METHODS.find(method => method.id === selectedShippingMethod);
            const shippingCost = selectedMethod?.price || 0;
            
            const orderData = {
              shippingMethod: selectedShippingMethod,
              deliveryAddressId: selectedShippingMethod === 'pickup' ? null : selectedAddressId,
              paymentMethod: paymentMethod,
              shippingCost: shippingCost // Tambahkan biaya pengiriman
            };
            
            const response = await createOrder(orderData);

            // Redirect to payment page with snap token and payment type
            router.push(`/payment/${response.order.id}?token=${response.snapToken || ''}&type=${paymentMethod}`);
        } catch (error) {
            console.error('Failed to place order:', error);
            toast.error('Gagal membuat pesanan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
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
                                    <ArrowLeft className="ml-2 h-4 w-4" />
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
                    <div className="mb-6">
                        <Link href="/cart">
                            <button className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300">
                                <ArrowLeft size={16} className="mr-1" />
                                Kembali ke Keranjang
                            </button>
                        </Link>
                    </div>

                    <h1 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Delivery Address Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <MapPin className="h-5 w-5 text-cyan-600 mr-2" />
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Alamat Pengiriman
                                        </h2>
                                    </div>

                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 flex items-center"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Tambah Alamat Baru
                                    </button>
                                </div>

                                <div className="p-6">
                                    {addresses.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {addresses.map((address) => (
                                                    <div
                                                        key={address.id}
                                                        onClick={() => setSelectedAddressId(address.id)}
                                                        className={`border rounded-lg p-4 cursor-pointer ${selectedAddressId === address.id
                                                            ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-900/20'
                                                            : 'border-gray-200 dark:border-gray-700'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <input
                                                                type="radio"
                                                                name="address"
                                                                checked={selectedAddressId === address.id}
                                                                onChange={() => setSelectedAddressId(address.id)}
                                                                className="mt-1"
                                                            />
                                                            <div>
                                                                {address.recipientName && (
                                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                                        {address.recipientName}
                                                                    </p>
                                                                )}
                                                                {address.phone && (
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {address.phone}
                                                                    </p>
                                                                )}
                                                                <p className="font-medium text-gray-900 dark:text-white mt-1">
                                                                    {address.fullAddress}
                                                                </p>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {address.district}, {address.city}, {address.province}, {address.postalCode}
                                                                </p>
                                                                {address.isPrimary && (
                                                                    <span className="inline-block mt-1 text-xs font-medium text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/40 px-2 py-0.5 rounded">
                                                                        Alamat Utama
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">Anda belum menambahkan alamat pengiriman</p>
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Tambah Alamat Baru
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Shipping Method Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center">
                                        <Truck className="h-5 w-5 text-cyan-600 mr-2" />
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Metode Pengiriman
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {SHIPPING_METHODS.map((method) => (
                                            <div
                                                key={method.id}
                                                onClick={() => setSelectedShippingMethod(method.id)}
                                                className={`border rounded-lg p-4 cursor-pointer ${selectedShippingMethod === method.id
                                                    ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-900/20'
                                                    : 'border-gray-200 dark:border-gray-700'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <input
                                                        type="radio"
                                                        name="shipping"
                                                        checked={selectedShippingMethod === method.id}
                                                        onChange={() => setSelectedShippingMethod(method.id)}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <p className="font-medium text-gray-900 dark:text-white">{method.name}</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {method.price === 0 ? 'Gratis' : formatToIDR(method.price)}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">{method.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Section - Replace with actual payment method options */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
  <div className="flex items-center">
    <CreditCard className="h-5 w-5 text-cyan-600 mr-2" />
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
      Metode Pembayaran
    </h2>
  </div>
</div>

<div className="p-6">
  <div className="space-y-4">
    {PAYMENT_METHODS.map((method) => (
      <div 
        key={method.id}
        className={`border rounded-lg p-4 cursor-pointer ${
          paymentMethod === method.id 
            ? 'border-cyan-600 bg-cyan-50 dark:border-cyan-500 dark:bg-cyan-900/20' 
            : 'border-gray-200 dark:border-gray-700'
        }`}
        onClick={() => setPaymentMethod(method.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 relative mr-3">
              <Image 
                src={method.image} 
                alt={method.name} 
                width={40} 
                height={40} 
                className="object-contain" 
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{method.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
              
              {method.id === 'midtrans' && (
                <div className="text-xs mt-1 text-cyan-700 dark:text-cyan-400">
                  *Biaya layanan 3.5% akan ditambahkan
                </div>
              )}
            </div>
          </div>
          <div>
            <input 
              type="radio" 
              checked={paymentMethod === method.id} 
              onChange={() => setPaymentMethod(method.id)} 
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500" 
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 sticky top-20">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ringkasan Pesanan</h2>

                                {/* Items Summary */}
                                <div className="mb-4 max-h-60 overflow-y-auto">
                                    {cartData.items.map((item) => (
                                        <div key={item.id} className="flex py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                                <div className="relative h-full w-full">
                                                    <Image
                                                        src={item.product.imageUrl || '/images/placeholder.jpg'}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex justify-between">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatToIDR(item.totalPrice)}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {(item.weight / 1000).toFixed(1)} kg × {formatToIDR(item.product.price)}/kg
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartData.totalItems} item)</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{formatToIDR(cartData.subtotal)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Ongkos Kirim</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {SHIPPING_METHODS.find(method => method.id === selectedShippingMethod)?.price === 0
                                                ? 'Gratis'
                                                : formatToIDR(SHIPPING_METHODS.find(method => method.id === selectedShippingMethod)?.price || 0)}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">{formatToIDR(calculateTotal())}</span>
                                    </div>

                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={isSubmitting || (selectedShippingMethod !== 'pickup' && !selectedAddressId) || !paymentMethod || addresses.length === 0}
                                        className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin mr-2" />
                                                Memproses...
                                            </>
                                        ) : (
                                            'Lanjut ke Pembayaran'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Address Modal */}
            <AddAddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddressAdded={handleAddressAdded}
            />

            <Footer />
        </>
    );
}