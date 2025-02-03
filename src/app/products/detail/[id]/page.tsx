'use client';
import { useParams } from 'next/navigation';
// import PageWrapper from '@/components/PageWrapper';
import DetailProduct from '@/components/section/Products/DetailProduct';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import products from '@/data/products';

export default function ProductDetailPage() {
  const { id } = useParams();
  // Convert id to string if it's an array
  const productId = Array.isArray(id) ? id[0] : id;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <>
       <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Product not found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The product you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </div>
        </div>
        <Footer />
        </>
       
    );
  }

  return (
    <>
     <Navbar />
      <DetailProduct {...product} />
      <Footer />
    </>
     
  );
}
