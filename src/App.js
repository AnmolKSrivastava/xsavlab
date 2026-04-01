import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import CaseStudies from './components/CaseStudies';
import TrustSection from './components/TrustSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import QuantumBackground from './components/QuantumBackground';

function App() {
  const [selectedService, setSelectedService] = useState('cybersecurity');

  const handleScheduleConsultation = (service = 'cybersecurity') => {
    setSelectedService(service);
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-dark-navy text-white overflow-x-hidden relative">
      {/* Quantum animated background */}
      <QuantumBackground />
      
      {/* Main content - positioned above background */}
      <div className="relative z-10">
        <Navbar onScheduleClick={handleScheduleConsultation} />
      <Hero onScheduleClick={handleScheduleConsultation} />
      <About />
      <Services onScheduleClick={handleScheduleConsultation} />
      <HowItWorks />
      <CaseStudies />
      <TrustSection />
      <Contact preSelectedService={selectedService} />
      <Footer />
      </div>
    </div>
  );
}

export default App;
