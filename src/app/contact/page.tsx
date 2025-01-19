import ContactSection from '@/components/section/ContactSection';
import PageWrapper from '@/components/PageWrapper';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function ContactPage() {
  return (
    <PageWrapper>
        <Navbar />
      <ContactSection />
        <Footer />
    </PageWrapper>
  );
}