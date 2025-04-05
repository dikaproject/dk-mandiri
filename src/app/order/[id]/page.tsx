'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Loader2, AlertTriangle, ArrowLeft, Truck, ExternalLink, Clock } from 'lucide-react';
import { getOrderDetails } from '@/services/order';
import { formatToIDR } from '@/utils/formatter';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    let color = '';
    let label = '';

    switch (status) {
        case 'PENDING':
            color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
            label = 'Menunggu Pembayaran';
            break;
        case 'PROCESSING':
            color = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
            label = 'Diproses';
            break;
        case 'SHIPPED':
            color = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
            label = 'Dikirim';
            break;
        case 'DELIVERED':
            color = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
            label = 'Selesai';
            break;
        case 'CANCELLED':
            color = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
            label = 'Dibatalkan';
            break;
        default:
            color = 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500';
            label = status;
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {label}
        </span>
    );
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const { id } = React.use(params);
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    // Fetch order details
    useEffect(() => {
      const fetchOrderDetails = async () => {
        try {
          if (authLoading) return;
          if (!user) {
            router.push(`/login?redirect=/order/${id}`);
            return;
          }
  
          setIsLoading(true);
          const data = await getOrderDetails(id);
          setOrderDetails(data);
        } catch (error) {
          console.error('Failed to fetch order details:', error);
          setError('Failed to load order details. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchOrderDetails();
    }, [id, user, authLoading, router]);

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

    if (!orderDetails) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md w-full text-center">
                        <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-6" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order not found</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn't find the order you're looking for.</p>
                        <Link href="/orders">
                            <button className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300">
                                View All Orders
                            </button>
                        </Link>
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

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="mb-6">
                        <Link href="/orders">
                            <button className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300">
                                <ArrowLeft size={16} className="mr-1" />
                                Kembali ke Daftar Pesanan
                            </button>
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-wrap justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Pesanan #{orderDetails.orderNumber}
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Tanggal Pesanan: {new Date(orderDetails.orderDate).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <StatusBadge status={orderDetails.status} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Order Items */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="font-medium text-gray-900 dark:text-white">Item yang Dipesan</h2>
                                    </div>

                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
  {orderDetails.items.map((item: any) => (
    <li key={item.id} className="p-4 flex items-start gap-4">
      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.imageUrl || '/images/placeholder.jpg'} // Ubah dari item.product.imageUrl
          alt={item.productName} // Ubah dari item.product.name
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">
          {item.productName} {/* Ubah dari item.product.name */}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {(item.weight / 1000).toFixed(1)} kg × {formatToIDR(item.pricePerUnit)}/kg {/* Ubah dari item.product.price */}
        </p>
      </div>
      
      <div className="text-right">
        <p className="font-medium text-gray-900 dark:text-white">
          {formatToIDR(item.totalPrice)}
        </p>
      </div>
    </li>
  ))}
</ul>
                                </div>

                                {/* Shipping Info */}
                                {orderDetails.shippingInfo && (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700 flex items-center">
                                            <Truck className="h-5 w-5 text-cyan-600 mr-2" />
                                            <h2 className="font-medium text-gray-900 dark:text-white">Informasi Pengiriman</h2>
                                        </div>

                                        <div className="p-4">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {orderDetails.shippingInfo.method}
                                            </p>

                                            {orderDetails.deliveryAddress ? (
                                                <div className="mt-2">
                                                    <p className="text-gray-900 dark:text-white">
                                                        {orderDetails.deliveryAddress.recipientName || orderDetails.user.name}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {orderDetails.deliveryAddress.phone || orderDetails.user.phone || '-'}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                        {orderDetails.deliveryAddress.fullAddress}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {orderDetails.deliveryAddress.district}, {orderDetails.deliveryAddress.city}, {orderDetails.deliveryAddress.province}, {orderDetails.deliveryAddress.postalCode}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                                    Pickup di toko
                                                </p>
                                            )}

                                            {orderDetails.shippingInfo.trackingNumber && (
                                                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                    <p className="text-sm text-blue-600 dark:text-blue-400">
                                                        <span className="font-medium">No. Resi:</span> {orderDetails.shippingInfo.trackingNumber}
                                                    </p>
                                                    {orderDetails.shippingInfo.courier && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            Kurir: {orderDetails.shippingInfo.courier}
                                                        </p>
                                                    )}
                                                    {orderDetails.shippingInfo.trackingUrl && (
                                                        <a
                                                            href={orderDetails.shippingInfo.trackingUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 mt-2"
                                                        >
                                                            Lacak Pengiriman
                                                            <ExternalLink size={14} className="ml-1" />
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Payment Info */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
  <div className="p-4 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700">
    <h2 className="font-medium text-gray-900 dark:text-white">Informasi Pembayaran</h2>
  </div>
  
  <div className="p-4">
    {orderDetails.payment ? (
    <div>
      <div className="flex justify-between mb-2">
        <p className="text-gray-600 dark:text-gray-400">Metode Pembayaran</p>
        <p className="font-medium text-gray-900 dark:text-white">{orderDetails.payment.method}</p>
      </div>
      
      <div className="flex justify-between mb-2">
        <p className="text-gray-600 dark:text-gray-400">Status Pembayaran</p>
        {orderDetails.payment.proofImage ? (
        <p className="font-medium text-yellow-600 dark:text-yellow-400">
          Menunggu Verifikasi Admin
        </p>
        ) : (
        <p className={`font-medium ${
          orderDetails.payment.status === 'PAID' || orderDetails.payment.status === 'SUCCESS'
            ? 'text-green-600 dark:text-green-400' 
            : 'text-yellow-600 dark:text-yellow-400'
        }`}>
          {orderDetails.payment.status === 'PAID' || orderDetails.payment.status === 'SUCCESS' 
            ? 'Sudah Dibayar' 
            : 'Menunggu Pembayaran'}
        </p>
        )}
      </div>
      
      {orderDetails.payment.paidAt && (
        <div className="flex justify-between">
        <p className="text-gray-600 dark:text-gray-400">Tanggal Pembayaran</p>
        <p className="font-medium text-gray-900 dark:text-white">
          {new Date(orderDetails.payment.paidAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        </div>
      )}
      
      {/* Payment proof image if manual payment */}
      {orderDetails.payment?.proofImage && (
  <div className="mt-4">
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Bukti Pembayaran:</p>
    <div className="relative h-48 w-full rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${orderDetails.payment.proofImage}`}
        alt="Bukti Pembayaran"
        fill
        className="object-contain"
      />
    </div>
  </div>
)}
    </div>
    ) : (
      // If payment info not available yet
      <div className="flex items-center justify-center py-4">
        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
        <p className="text-yellow-600 dark:text-yellow-400">Menunggu Informasi Pembayaran</p>
      </div>
    )}
  </div>
</div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="font-medium text-gray-900 dark:text-white">Ringkasan Pesanan</h2>
                                    </div>

                                    <div className="p-4">
                                        <div className="space-y-2">
                                        <div className="flex justify-between">
  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
  <span className="text-gray-900 dark:text-white">{formatToIDR(orderDetails.subtotal)}</span>
</div>

<div className="flex justify-between">
  <span className="text-gray-600 dark:text-gray-400">Ongkos Kirim</span>
  <span className="text-gray-900 dark:text-white">{formatToIDR(orderDetails.shippingCost)}</span>
</div>

{orderDetails.serviceCharge > 0 && (
  <div className="flex justify-between">
    <span className="text-gray-600 dark:text-gray-400">Biaya Layanan (3.5%)</span>
    <span className="text-gray-900 dark:text-white">{formatToIDR(orderDetails.serviceCharge)}</span>
  </div>
)}

<div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
  <div className="flex justify-between">
    <span className="font-bold text-gray-900 dark:text-white">Total</span>
    <span className="font-bold text-gray-900 dark:text-white">{formatToIDR(orderDetails.totalAmount)}</span>
  </div>
</div>
                                        </div>

                                        {/* Order Timeline */}
                                        <div className="mt-6">
                                            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Status Pesanan</h3>
                                            <div className="space-y-4">
                                                {orderDetails.statusHistory?.map((history: any, index: number) => (
                                                    <div key={index} className="flex">
                                                        <div className="mr-3 flex flex-col items-center">
                                                            <div className={`rounded-full h-3 w-3 ${history.current ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                            {index < (orderDetails.statusHistory.length - 1) && (
                                                                <div className="h-full w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                                                            )}
                                                        </div>
                                                        <div className="pb-4">
                                                            <p className={`text-sm font-medium ${history.current ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                {history.status === 'PENDING' ? 'Menunggu Pembayaran' :
                                                                    history.status === 'PROCESSING' ? 'Diproses' :
                                                                        history.status === 'SHIPPED' ? 'Dikirim' :
                                                                            history.status === 'DELIVERED' ? 'Selesai' :
                                                                                history.status === 'CANCELLED' ? 'Dibatalkan' : history.status}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {new Date(history.timestamp).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                            {history.note && (
                                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                                    {history.note}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Order Actions */}
                                        {orderDetails.status === 'PENDING' && !orderDetails.payment?.status === 'PAID' && (
                                            <div className="mt-4">
                                                <Link href={`/payment/${orderDetails.id}`}>
                                                    <button className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300">
                                                        Lanjutkan Pembayaran
                                                    </button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
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