import AboutSection from '@/components/section/AboutSection';
import PageWrapper from '@/components/PageWrapper';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function About() {
  return (
    <PageWrapper>
        <Navbar />
      <AboutSection />
        <Footer />
    </PageWrapper>
  );
}