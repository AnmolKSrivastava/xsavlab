import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import CaseStudies from './components/CaseStudies';
import TrustSection from './components/TrustSection';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-dark-navy text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <HowItWorks />
      <CaseStudies />
      <TrustSection />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
