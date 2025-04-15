import AboutSection from '@/components/section/AboutSection';
// import PageWrapper from '@/components/PageWrapper';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ChatAssistant from '@/components/ChatAssistant';

export default function About() {
  return (
    <>
    <Navbar />
      <AboutSection />
        <Footer />
        <ChatAssistant />
    </>
        
  );
}