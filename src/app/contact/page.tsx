import ContactSection from '@/components/section/ContactSection';
// import PageWrapper from '@/components/PageWrapper';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ChatAssistant from '@/components/ChatAssistant';

export default function ContactPage() {
  return (
    <>
    <Navbar />
      <ContactSection />
        <Footer />
        <ChatAssistant />
    </>
        
  );
}