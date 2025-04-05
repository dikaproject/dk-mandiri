import HeroSection from '@/components/HeroSection';
import MitraSection from '@/components/MitraSection';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProductSection from '@/components/ProductSection';
import HowToOrder from '@/components/HowToOrder';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
    <Navbar />
      <HeroSection />
      <ProductSection />
      <MitraSection />
      <HowToOrder />
      <Contact />
      <Footer />
    </> 
  );
}