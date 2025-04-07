import { Metadata } from 'next';
import Community from '@/components/section/Community';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'Community Reviews | DK Mandiri Seafood',
  description: 'Read and share customer reviews of DK Mandiri Seafood\'s products and services.',
};

export default function CommunityPage() {
  return (
    <>
     <Navbar />
      <Community />
      <Footer />
    </>
  );
}