'use client';

import React from 'react'; // Added React import
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { formatToIDR } from '@/utils/formatter';
import { Loader2, Download, FileText, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';

export default function ReceiptPage({ params }: { params: { id: string } }) {
  const { id } = React.use(params);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const validateTokenAndFetchData = async () => {
      if (!token) {
        setError('Token tidak valid');
        setLoading(false);
        return;
      }

      try {
        // Validasi token dan dapatkan data receipt
        const response = await api.get(`/transaction/${id}/validate-receipt?token=${token}`);
        
        if (response.data.valid) {
          setValidToken(true);
          setReceiptData(response.data.transaction);
        } else {
          setError('Link sudah kadaluarsa atau tidak valid');
        }
      } catch (error) {
        console.error('Error validating receipt token:', error);
        setError('Terjadi kesalahan. Mohon coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    validateTokenAndFetchData();
  }, [id, token]);

  const pdfUrl = receiptData?.pdfFilename 
  ? `${process.env.NEXT_PUBLIC_API_IMAGE || 'https://dkmandiri.id/api'}/uploads/receipts/${receiptData.pdfFilename}`
  : null;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Memuat Receipt...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Error</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
            <div className="mt-6">
              <Link href="/" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Kembali ke Halaman Utama
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!validToken || !receiptData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
            <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Link Tidak Valid</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Link receipt ini telah kadaluarsa atau tidak valid.
            </p>
            <div className="mt-6">
              <Link href="/" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Kembali ke Halaman Utama
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-sm p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bukti Pembayaran</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                Transaction #{id.slice(0, 8).toUpperCase()} - {new Date(receiptData.date).toLocaleDateString('id-ID')}
              </p>
            </div>
            <div className="flex space-x-2">
              <a 
                href={pdfUrl} 
                download={`receipt-${id.slice(0, 8)}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Download PDF
              </a>
            </div>
          </div>
        </div>
        
        {/* PDF Viewer */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 rounded-b-xl overflow-hidden">
          <div className="p-4 bg-gray-50 dark:bg-gray-900">
            <div className="relative h-[700px] w-full border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <iframe 
  src={`${pdfUrl}#view=FitH`}
  className="absolute inset-0 w-full h-full"
/>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dokumen ini sah dan dikeluarkan secara digital oleh DK Mandiri
              </p>
            </div>
            
            <div className="text-center mt-6">
              <Link 
                href="/" 
                className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 font-medium text-sm"
              >
                Kembali ke Halaman Utama
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 