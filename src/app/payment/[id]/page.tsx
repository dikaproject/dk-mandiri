'use client';

import React from 'react'; // Added React import
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Loader2, AlertTriangle, ArrowLeft, Copy, FileImage, Check } from 'lucide-react';
import { getOrderDetails, uploadPaymentProof } from '@/services/order';
import { formatToIDR } from '@/utils/formatter';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

// Declare midtrans snap global to avoid TypeScript errors
declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: any) => void;
    };
  }
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  
  // Unwrap the params Promise using React.use()
  const { id } = React.use(params);
  const orderId = id;
  
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const snapToken = searchParams.get('token');
  const paymentType = searchParams.get('type') || ''; // Don't default to midtrans

  // Load midtrans script
  useEffect(() => {
    if (paymentType === 'midtrans' && snapToken) {
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
      script.onload = () => {
        if (window.snap) {
          window.snap.pay(snapToken, {
            onSuccess: function(result: any) {
              toast.success('Pembayaran berhasil!');
              router.push(`/order/${orderId}`);
            },
            onPending: function(result: any) {
              toast.success('Pembayaran dalam proses!');
              router.push(`/order/${orderId}`);
            },
            onError: function(result: any) {
              toast.error('Pembayaran gagal!');
            },
            onClose: function() {
              toast.info('Anda menutup popup pembayaran tanpa menyelesaikan pembayaran');
            }
          });
        }
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [snapToken, orderId, router, paymentType]);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (authLoading) return;
        if (!user) {
          router.push('/login?redirect=/payment/' + orderId);
          return;
        }

        setIsLoading(true);
        const details = await getOrderDetails(orderId);
        setOrderDetails(details);
        
        // Tambahkan validasi payment
        if (!details.payment || !details.payment.id) {
          setError('Data pembayaran tidak tersedia. Silakan hubungi admin.');
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        setError('Failed to load order details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, user, authLoading, router]);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle copy to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  // Handle manual payment submission
  const handleManualPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentFile) {
      toast.error('Silakan upload bukti pembayaran');
      return;
    }
  
    // Pastikan payment ID tersedia
    if (!orderDetails?.payment?.id) {
      toast.error('Data transaksi tidak valid');
      return;
    }
  
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('paymentProof', paymentFile); // Pastikan nama field sesuai dengan yang diharapkan backend
      
      // Gunakan transaction ID, bukan order ID
      await uploadPaymentProof(orderDetails.payment.id, formData);
      toast.success('Bukti pembayaran berhasil diunggah');
      router.push(`/order/${orderId}`);
    } catch (error) {
      console.error('Failed to upload payment proof:', error);
      toast.error('Gagal mengunggah bukti pembayaran');
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

  // If using midtrans and we've loaded the script, show a loading screen
  if (paymentType === 'midtrans' && snapToken) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center">
          <Loader2 size={40} className="animate-spin text-cyan-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            Memuat halaman pembayaran Midtrans...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  // If no payment type is set, show error
  if (!paymentType) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md w-full text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invalid Payment Information</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">No payment method was selected. Please try again.</p>
            <Link href={`/order/${orderId}`}>
              <button className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300">
                View Order Details
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Assume manual payment if not using midtrans
  return (
    <>
      <Navbar />
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6">
            <Link href={`/order/${orderId}`}>
              <button className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300">
                <ArrowLeft size={16} className="mr-1" />
                Kembali ke Detail Pesanan
              </button>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pembayaran</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Order #{orderDetails?.orderNumber}
              </p>
            </div>

            <div className="p-6">
              <div className="mb-6 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Pembayaran</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatToIDR(orderDetails?.totalAmount || 0)}
                </p>
              </div>

              {/* Manual Payment Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-medium text-lg text-gray-900 dark:text-white mb-3">Transfer Bank</h2>
                  <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
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

                <div>
                  <h2 className="font-medium text-lg text-gray-900 dark:text-white mb-3">QRIS</h2>
                  <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg flex flex-col items-center">
                    <div className="bg-white p-2 rounded-lg mb-3">
                      <Image 
                        src="/qris-intech.jpg" 
                        alt="QRIS Code" 
                        width={200} 
                        height={200}
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Scan QR code di atas menggunakan aplikasi e-wallet atau mobile banking Anda
                    </p>
                  </div>
                </div>

                <form onSubmit={handleManualPaymentSubmit} className="space-y-4">
                  <div>
                    <h2 className="font-medium text-lg text-gray-900 dark:text-white mb-3">
                      Upload Bukti Pembayaran
                    </h2>
                    
                    <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                    <div className="mb-4">
  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
    Setelah melakukan pembayaran, mohon upload bukti transfer disini:
  </p>

  {!previewUrl ? (
    <label className="block w-full cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-cyan-500 dark:hover:border-cyan-500 transition-all">
      <FileImage className="mx-auto h-12 w-12 text-gray-400 mb-2" />
      <span className="text-sm font-medium text-gray-900 dark:text-white">Klik untuk upload bukti pembayaran</span>
      <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG, atau PDF (max 5MB)</span>
      <input 
        type="file" 
        className="hidden" 
        accept="image/jpeg,image/png,application/pdf"
        onChange={handleFileChange}
        required
      />
    </label>
  ) : (
    <div className="relative border rounded-lg overflow-hidden">
      <Image 
        src={previewUrl} 
        alt="Payment proof preview"
        width={400}
        height={300}
        className="w-full h-auto object-contain"
      />
      <button 
        type="button"
        onClick={() => {
          setPreviewUrl(null);
          setPaymentFile(null);
        }}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )}
</div>
                      
<button
  type="submit"
  disabled={!paymentFile || isSubmitting}
  className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
>
  {isSubmitting ? (
    <>
      <Loader2 size={20} className="animate-spin mr-2" />
      Mengunggah...
    </>
  ) : (
    'Konfirmasi Pembayaran'
  )}
</button>
                    </div>
                  </div>
                </form>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                  <p>Butuh bantuan? Hubungi kami di:</p>
                  <p className="font-medium text-cyan-600 dark:text-cyan-400">+62 812-2784-8422 / +62 812-2679-5993 (WhatsApp)</p>
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