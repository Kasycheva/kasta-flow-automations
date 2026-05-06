import '../lib/i18n';
import { lazy, Suspense } from 'react';
import Navbar from '../components/sections/Navbar';
import Hero from '../components/sections/Hero';
import Ticker from '../components/sections/Ticker';
import Services from '../components/sections/Services';
import Seo from '../components/Seo';

const Calculator = lazy(() => import('../components/sections/Calculator'));
const Support = lazy(() => import('../components/sections/Support'));
const Cases = lazy(() => import('../components/sections/Cases'));
const FAQ = lazy(() => import('../components/sections/FAQ'));
const Contact = lazy(() => import('../components/sections/Contact'));
const Footer = lazy(() => import('../components/sections/Footer'));
const ChatWidget = lazy(() => import('../components/widgets/ChatWidget'));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo />
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Services />
        <Suspense fallback={<div style={{ minHeight: '600px' }} />}>
          <Calculator />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
          <Support />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: '600px' }} />}>
          <Cases />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
          <FAQ />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: '600px' }} />}>
          <Contact />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: '200px' }} />}>
          <Footer />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </div>
  );
};

export default Index;
