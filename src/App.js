import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Section Components
import Hero from './components/sections/Hero';

// UI Components
import QuantumBackground from './components/ui/QuantumBackground';
import ScrollToTop from './components/ui/ScrollToTop';

const About = lazy(() => import('./components/sections/About'));
const Services = lazy(() => import('./components/sections/Services'));
const HowItWorks = lazy(() => import('./components/sections/HowItWorks'));
const CaseStudies = lazy(() => import('./components/sections/CaseStudies'));
const TrustSection = lazy(() => import('./components/sections/TrustSection'));
const ReviewSubmissionForm = lazy(() => import('./components/sections/ReviewSubmissionForm'));
const Contact = lazy(() => import('./components/sections/Contact'));
const FeaturedVentures = lazy(() => import('./components/sections/FeaturedVentures'));
const LatestBlogPosts = lazy(() => import('./components/sections/LatestBlogPosts'));

const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProcessPage = lazy(() => import('./pages/ProcessPage'));
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const VenturesPage = lazy(() => import('./pages/VenturesPage'));
const BlogListing = lazy(() => import('./pages/BlogListing'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

const SectionLoader = () => <div className="h-16" aria-hidden="true" />;
const PageLoader = () => <div className="min-h-[40vh]" aria-hidden="true" />;

// Home Page Component
function HomePage({ handleScheduleClick }) {
  return (
    <>
      <Hero onScheduleClick={handleScheduleClick} />
      <Suspense fallback={<SectionLoader />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Services onScheduleClick={handleScheduleClick} />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FeaturedVentures />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <LatestBlogPosts />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CaseStudies />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TrustSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ReviewSubmissionForm />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Contact />
      </Suspense>
    </>
  );
}

function App() {
  // Scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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

  const routeContent = (
    <Routes>
      <Route path="/" 
        element={
          <HomePage 
            handleScheduleClick={handleScheduleClick} 
          />
        } 
      />
      <Route path="/about" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
      <Route path="/services" element={<Suspense fallback={<PageLoader />}><ServicesPage /></Suspense>} />
      <Route path="/process" element={<Suspense fallback={<PageLoader />}><ProcessPage /></Suspense>} />
      <Route path="/case-studies" element={<Suspense fallback={<PageLoader />}><CaseStudiesPage /></Suspense>} />
      <Route path="/contact" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
      <Route path="/blog" element={<Suspense fallback={<PageLoader />}><BlogListing /></Suspense>} />
      <Route path="/blog/:slug" element={<Suspense fallback={<PageLoader />}><BlogPost /></Suspense>} />
      <Route path="/careers" element={<Suspense fallback={<PageLoader />}><CareersPage /></Suspense>} />
      <Route path="/careers/:jobId" element={<Suspense fallback={<PageLoader />}><JobDetailPage /></Suspense>} />
      <Route path="/ventures" element={<Suspense fallback={<PageLoader />}><VenturesPage /></Suspense>} />
      <Route path="/ventures/:category" element={<Suspense fallback={<PageLoader />}><VenturesPage /></Suspense>} />
      <Route path="/admin-login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
      <Route path="/admin/dashboard" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
    </Routes>
  );

  return (
    <div className="min-h-screen bg-dark-navy text-white overflow-x-hidden relative">
      {/* Quantum animated background */}
      <QuantumBackground />
      
      {/* Fixed Navbar - hidden on admin pages */}
      {!isAdminPage && <Navbar onScheduleClick={handleScheduleClick} />}
      
      {/* Main content - positioned above background with padding for fixed navbar */}
      <div className={`relative z-10 ${!isAdminPage ? 'pt-20' : ''}`}>
        {isAdminPage ? routeContent : <main id="main-content">{routeContent}</main>}
        
        {/* Footer - hidden on admin pages */}
        {!isAdminPage && <Footer />}
      </div>
      
      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
}

export default App;
