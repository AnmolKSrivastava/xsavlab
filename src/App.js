import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

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
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ProcessPage from './pages/ProcessPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import ContactPage from './pages/ContactPage';
import VenturesPage from './pages/VenturesPage';
import BlogListing from './pages/BlogListing';
import BlogPost from './pages/BlogPost';
import CareersPage from './pages/CareersPage';
import JobDetailPage from './pages/JobDetailPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

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
