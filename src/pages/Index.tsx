import '../lib/i18n';
import Navbar from '../components/sections/Navbar';
import Hero from '../components/sections/Hero';
import Ticker from '../components/sections/Ticker';
import Services from '../components/sections/Services';
import Calculator from '../components/sections/Calculator';
import Support from '../components/sections/Support';
import Cases from '../components/sections/Cases';
import FAQ from '../components/sections/FAQ';
import Contact from '../components/sections/Contact';
import Footer from '../components/sections/Footer';
import CookieBanner from '../components/widgets/CookieBanner';
import ChatWidget from '../components/widgets/ChatWidget';
import StackSection from '../components/ui/StackSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Ticker />
      <StackSection zIndex={11}><Services /></StackSection>
      <StackSection zIndex={12}><Calculator /></StackSection>
      <StackSection zIndex={13}><Support /></StackSection>
      <StackSection zIndex={14}><Cases /></StackSection>
      <StackSection zIndex={15}><FAQ /></StackSection>
      <StackSection zIndex={16}><Contact /></StackSection>
      <Footer />
      <CookieBanner />
      <ChatWidget />
    </div>
  );
};

export default Index;
