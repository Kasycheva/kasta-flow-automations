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
import Seo from '../components/Seo';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo />
      <Navbar />
      <Hero />
      <Ticker />
      <Services />
      <Calculator />
      <Support />
      <Cases />
      <FAQ />
      <Contact />
      <Footer />
      <CookieBanner />
      <ChatWidget />
    </div>
  );
};

export default Index;
