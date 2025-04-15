import HeroSection from '@/components/HeroSection';
import MitraSection from '@/components/MitraSection';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProductSection from '@/components/ProductSection';
import HowToOrder from '@/components/HowToOrder';
import Contact from '@/components/Contact';
import ChatAssistant from '@/components/ChatAssistant';
import type { Metadata } from 'next';
import { JsonLd } from 'react-schemaorg';

// Metadata untuk SEO
export const metadata: Metadata = {
  title: 'DK Mandiri Seafood | Supplier Ikan Segar Terpercaya di Cilacap',
  description: 'DK Mandiri Seafood menyediakan ikan segar berkualitas premium dari nelayan lokal. Kami melayani pengiriman ikan segar di Cilacap dan sekitarnya dengan harga terbaik.',
  keywords: [
    'ikan segar cilacap',
    'ikan laut segar',
    'seafood premium',
    'supplier ikan cilacap',
    'jual ikan segar',
    'ikan fresh nusawungu',
    'DK Mandiri Seafood',
    'pengiriman ikan cilacap',
    'grosir ikan murah',
    'ikan berkualitas cilacap',
  ],
  alternates: {
    canonical: 'https://dkmandiri.id',
  },
  openGraph: {
    type: 'website',
    url: 'https://dkmandiri.id',
    title: 'DK Mandiri Seafood - Supplier Ikan Segar Terpercaya di Cilacap',
    description: 'Ikan segar berkualitas premium langsung dari nelayan lokal di Cilacap. Pengiriman cepat dan harga terbaik.',
    siteName: 'DK Mandiri Seafood',
    images: [
      {
        url: 'https://dkmandiri.id/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DK Mandiri Seafood - Ikan Segar Dari Laut',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dkmandiriseafood',
    title: 'DK Mandiri - Supplier Ikan Segar Terpercaya',
    description: 'Ikan segar berkualitas premium langsung dari nelayan lokal.',
    images: ['https://dkmandiri.id/images/twitter-image.jpg'],
  },
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
};

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Schema.org structured data */}
      <div dangerouslySetInnerHTML={{
        __html: `
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "DK Mandiri Seafood",
              "image": "https://dkmandiri.id/images/logo.png",
              "url": "https://dkmandiri.id",
              "telephone": "+6281227848422",
              "priceRange": "Rp25.000 - Rp150.000",
              "description": "Supplier ikan segar berkualitas premium dari nelayan lokal. Melayani pengiriman ikan segar di Cilacap dan sekitarnya.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jl. Suryanegara, Mertangga, Jetis",
                "addressLocality": "Nusawungu",
                "addressRegion": "Cilacap",
                "postalCode": "53283",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -7.712745,
                "longitude": 109.378289
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
                ],
                "opens": "08:00",
                "closes": "20:00"
              },
              "sameAs": [
                "https://facebook.com/dkmandiriseafood",
                "https://instagram.com/dkmandiriseafood"
              ]
            }
          </script>
        `
      }} />
      
      {/* Main content */}
      <main>
        <HeroSection />
        <ProductSection />
        <MitraSection />
        <HowToOrder />
      </main>
      <Footer />
      <ChatAssistant />
    </>
  );
}