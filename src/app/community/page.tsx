import Community from '@/components/section/Community';
import PageWrapper from '@/components/PageWrapper';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function CommunityPage() {
  return (
    <PageWrapper>
        <Navbar />
      <Community />
        <Footer />
    </PageWrapper>
  );
}