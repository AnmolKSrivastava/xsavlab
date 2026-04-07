import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ProcessPage from './components/ProcessPage';
import CaseStudiesPage from './components/CaseStudiesPage';
import ContactPage from './components/ContactPage';

// Home Page Component
function HomePage({ handleScheduleClick }) {
  return (
    <>
      <Hero onScheduleClick={handleScheduleClick} />
      <About />
      <Services onScheduleClick={handleScheduleClick} />
      <FeaturedVentures />
      <LatestBlogPosts />
      <HowItWorks />
      <CaseStudies />
      <TrustSection />
      <ReviewSubmissionForm />
      <Contact />
    </>
  );
}

function App() {
  // Scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// AppContent component with location-based navigation
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if current route is an admin page
  const isAdminPage = location.pathname === '/admin-login' || location.pathname === '/admin/dashboard';

  // Schedule consultation handler - navigate to contact page
  const handleScheduleClick = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-dark-navy text-white overflow-x-hidden relative">
      {/* Quantum animated background */}
      <QuantumBackground />
      
      {/* Fixed Navbar - hidden on admin pages */}
      {!isAdminPage && <Navbar onScheduleClick={handleScheduleClick} />}
      
      {/* Main content - positioned above background with padding for fixed navbar */}
      <div className={`relative z-10 ${!isAdminPage ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" 
            element={
              <HomePage 
                handleScheduleClick={handleScheduleClick} 
              />
            } 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogListing />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:jobId" element={<JobDetailPage />} />
          <Route path="/ventures" element={<VenturesPage />} />
          <Route path="/ventures/:category" element={<VenturesPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        
        {/* Footer - hidden on admin pages */}
        {!isAdminPage && <Footer />}
      </div>
      
      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
}

export default App;
