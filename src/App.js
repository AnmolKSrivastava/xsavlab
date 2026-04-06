import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import CaseStudies from './components/CaseStudies';
import TrustSection from './components/TrustSection';
import ReviewSubmissionForm from './components/ReviewSubmissionForm';
import Contact from './components/Contact';
import Footer from './components/Footer';
import QuantumBackground from './components/QuantumBackground';
import ScrollToTop from './components/ScrollToTop';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import VenturesPage from './components/VenturesPage';
import BlogListing from './components/BlogListing';
import BlogPost from './components/BlogPost';
import FeaturedVentures from './components/FeaturedVentures';
import LatestBlogPosts from './components/LatestBlogPosts';
import CareersPage from './components/CareersPage';
import JobDetailPage from './components/JobDetailPage';

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
