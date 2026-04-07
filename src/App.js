import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Section Components
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';
import HowItWorks from './components/sections/HowItWorks';
import CaseStudies from './components/sections/CaseStudies';
import TrustSection from './components/sections/TrustSection';
import ReviewSubmissionForm from './components/sections/ReviewSubmissionForm';
import Contact from './components/sections/Contact';
import FeaturedVentures from './components/sections/FeaturedVentures';
import LatestBlogPosts from './components/sections/LatestBlogPosts';

// UI Components
import QuantumBackground from './components/ui/QuantumBackground';
import ScrollToTop from './components/ui/ScrollToTop';

// Pages
import VenturesPage from './pages/VenturesPage';
import BlogListing from './pages/BlogListing';
import BlogPost from './pages/BlogPost';
import CareersPage from './pages/CareersPage';
import JobDetailPage from './pages/JobDetailPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Home Page Component
function HomePage({ selectedService, handleScheduleConsultation }) {
  return (
    <>
      <Navbar onScheduleClick={handleScheduleConsultation} />
      <Hero onScheduleClick={handleScheduleConsultation} />
      <About />
      <Services onScheduleClick={handleScheduleConsultation} />
      <FeaturedVentures />
      <LatestBlogPosts />
      <HowItWorks />
      <CaseStudies />
      <TrustSection />
      <ReviewSubmissionForm />
      <Contact preSelectedService={selectedService} />
      <Footer />
    </>
  );
}

function App() {
  const [selectedService, setSelectedService] = useState('cybersecurity');

  // Scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleScheduleConsultation = (service = 'cybersecurity') => {
    setSelectedService(service);
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-dark-navy text-white overflow-x-hidden relative">
        {/* Quantum animated background */}
        <QuantumBackground />
        
        {/* Main content - positioned above background */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" 
              element={
                <HomePage 
                  selectedService={selectedService} 
                  handleScheduleConsultation={handleScheduleConsultation} 
                />
              } 
            />
            <Route path="/blog" element={<BlogListing />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:jobId" element={<JobDetailPage />} />
            <Route path="/ventures" element={<VenturesPage />} />
            <Route path="/ventures/:category" element={<VenturesPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
        
        {/* Scroll to top button */}
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;
