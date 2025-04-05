import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '../components/context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dk-mandiri-preview.vercel.app/'),
  title: {
    default: "DK Mandiri Seafood | Supplier Ikan Segar Terpercaya di Cilacap",
    template: "%s | DK Mandiri Seafood"
  },
  description: "DK Mandiri Seafood - Supplier ikan segar berkualitas di Cilacap. Menyediakan berbagai jenis ikan segar, ikan laut, dan seafood dengan harga terbaik di Nusawungu, Cilacap.",
  keywords: [
    "jual ikan murah cilacap",
    "ikan segar nusawungu",
    "seafood fresh nusawungu",
    "ikan mentah nusawungu cilacap",
    "supplier ikan cilacap",
    "ikan segar jetis nusawungu",
    "jual ikan nusawungu",
    "ikan laut segar cilacap",
    "supplier seafood cilacap",
    "ikan grosir nusawungu"
  ],
  authors: [{ name: "DK Mandiri Seafood" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://dk-mandiri-preview.vercel.app/',
    siteName: 'DK Mandiri Seafood',
    title: 'DK Mandiri Seafood - Supplier Ikan Segar Terpercaya di Cilacap',
    description: 'Supplier ikan segar berkualitas di Cilacap. Menyediakan berbagai jenis ikan segar dan seafood dengan harga terbaik.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DK Mandiri Seafood',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DK Mandiri Seafood - Supplier Ikan Segar Terpercaya di Cilacap',
    description: 'Supplier ikan segar berkualitas di Cilacap. Menyediakan berbagai jenis ikan segar dan seafood dengan harga terbaik.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://dk-mandiri-preview.vercel.app/',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
                duration: 5000,
                style: {
                  background: '#333',
                  color: '#fff',
                }
              }}
            />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
