'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { Loader2, AlertTriangle, ArrowLeft, Truck, ExternalLink, Clock, Check, Copy } from 'lucide-react';
import { getOrderDetails } from '@/services/order';
import { formatToIDR } from '@/utils/formatter';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import axios from 'axios';

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

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    // Unwrap params with React.use() if it's a Promise
    const resolvedParams = params instanceof Promise ? use(params) : params;
    const { id } = resolvedParams;
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
  
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
          
          // Check if it's an authentication error (403)
          if (axios.isAxiosError(error) && error.response?.status === 403) {
            setError('You do not have permission to view this order.');
            toast.error('You do not have permission to view this order');
          } else {
            setError('Failed to load order details. Please try again.');
            toast.error('Failed to load order details');
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrderDetails();
    }, [id, user, authLoading, router]);

    // Handle copy to clipboard
    const copyToClipboard = (text: string, field: string) => {
      navigator.clipboard.writeText(text);
      setCopied(field);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(null), 2000);
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
                        <Link href="/profile">
                            <button className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300">
                                Return to Profile
                            </button>
                        </Link>
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
                        <Link href="/profile">
                            <button className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300">
                                Back to Profile
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
            <Toaster position="top-right" />
            <div className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="mb-6">
                        <Link href="/profile">
                            <button className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300">
                                <ArrowLeft size={16} className="mr-1" />
                                Kembali ke Profil
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
                                                        src={item.imageUrl || '/images/placeholder.jpg'}
                                                        alt={item.productName}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                                        {item.productName}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {(item.weight / 1000).toFixed(1)} kg × {formatToIDR(item.pricePerUnit)}/kg
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

                                {/* Delivery Address */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="font-medium text-gray-900 dark:text-white">Alamat Pengiriman</h2>
                                    </div>

                                    <div className="p-4">
                                        <p className="text-gray-900 dark:text-white">{orderDetails.deliveryAddress}</p>
                                    </div>
                                </div>

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
                                                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${orderDetails.payment.proofImage}`}
                                                            alt="Bukti Pembayaran"
                                                            fill
                                                            className="object-contain"
                                                            unoptimized
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        ) : (
                                            <div className="flex items-center justify-center py-4">
                                                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                                                <p className="text-yellow-600 dark:text-yellow-400">Menunggu Informasi Pembayaran</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bank Transfer Information (If pending) */}
                                {orderDetails.status === 'PENDING' && orderDetails.payment?.method === 'manual' && (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700">
                                            <h2 className="font-medium text-gray-900 dark:text-white">Informasi Rekening</h2>
                                        </div>
                                        
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center">
                                                    <Image 
                                                        src="/Bank-Mandiri.png" 
                                                        alt="Bank Mandiri" 
                                                        width={80} 
                                                        height={30}
                                                        className="h-8 w-auto"
                                                    />
                                                    <span className="ml-2 font-medium text-gray-900 dark:text-white">Bank Mandiri</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">No. Rekening</span>
                                                    <div className="flex items-center">
                                                        <span className="font-medium text-gray-900 dark:text-white mr-2">1370009876543</span>
                                                        <button 
                                                            onClick={() => copyToClipboard('1370009876543', 'account')}
                                                            className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
                                                        >
                                                            {copied === 'account' ? <Check size={16} /> : <Copy size={16} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">Atas Nama</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">SARYO</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Shipping Info */}
                                {orderDetails.shipping && (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700 flex items-center">
                                            <Truck className="h-5 w-5 text-cyan-600 mr-2" />
                                            <h2 className="font-medium text-gray-900 dark:text-white">Informasi Pengiriman</h2>
                                        </div>

                                        <div className="p-4">
                                            <div className="grid gap-4">
                                                <div className="flex justify-between">
                                                    <p className="text-gray-600 dark:text-gray-400">Status Pengiriman</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {orderDetails.shipping.deliveryStatus}
                                                    </p>
                                                </div>
                                                
                                                {orderDetails.shipping.staffName && (
                                                    <div className="flex justify-between">
                                                        <p className="text-gray-600 dark:text-gray-400">Kurir</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {orderDetails.shipping.staffName}
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {orderDetails.shipping.deliveryDate && (
                                                    <div className="flex justify-between">
                                                        <p className="text-gray-600 dark:text-gray-400">Estimasi Pengiriman</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {new Date(orderDetails.shipping.deliveryDate).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {orderDetails.shipping.notes && (
                                                    <div>
                                                        <p className="text-gray-600 dark:text-gray-400 mb-1">Catatan:</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {orderDetails.shipping.notes}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
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

                                        {/* Order Status Timeline */}
                                        {orderDetails.statusHistory && orderDetails.statusHistory.length > 0 && (
                                            <div className="mt-6">
                                                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Status Pesanan</h3>
                                                <div className="space-y-4">
                                                    {orderDetails.statusHistory.map((history: any, index: number) => (
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
                                        )}

                                        {/* Order Actions */}
                                        {orderDetails.status === 'PENDING' && (!orderDetails.payment || 
                                            (orderDetails.payment.status !== 'PAID' && 
                                             orderDetails.payment.status !== 'SUCCESS')) && (
                                            <div className="mt-6">
                                                <Link href={`/payment/${orderDetails.id}`}>
                                                    <button className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300">
                                                        Lanjutkan Pembayaran
                                                    </button>
                                                </Link>
                                            </div>
                                        )}

                                        {/* Support Information */}
                                        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                                            <p>Butuh bantuan? Hubungi kami di:</p>
                                            <p className="font-medium text-cyan-600 dark:text-cyan-400">
                                                +62 812-2784-8422 / +62 812-2679-5993
                                            </p>
                                        </div>
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