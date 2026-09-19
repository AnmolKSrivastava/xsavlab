import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {  Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
const companyLogo = `${process.env.PUBLIC_URL}/xsavlab_logo.png`;

const Navbar = ({ onScheduleClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrolled(window.scrollY > 50);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  const menuItems = [
    { label: 'About', href: '/about', type: 'route' },
    { label: 'Services', href: '/services', type: 'route' },
    { label: 'Ventures', href: '/ventures', type: 'route' },
    { label: 'Blog', href: '/blog', type: 'route' },
    { label: 'Careers', href: '/careers', type: 'route' },
    { label: 'Process', href: '/process', type: 'route' },
    { label: 'Case Studies', href: '/case-studies', type: 'route' },
    { label: 'Contact', href: '/contact', type: 'route' },
  ];

  const handleNavClick = (item) => {
    if (item.type === 'route') {
      // Route changes should always begin at the page's content rather than
      // retaining a scroll offset from the previous page.
      window.scrollTo(0, 0);
      navigate(item.href);
    } else {
      // If we're not on home page, navigate there first
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(item.href);
          if (element) {
            const navbarHeight = 80; // Height of fixed navbar
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navbarHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 300);
      } else {
        const element = document.querySelector(item.href);
        if (element) {
          const navbarHeight = 80; // Height of fixed navbar
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-3 right-3 z-50 rounded-b-xl bg-dark-navy border-b border-[#38BDF8]/20 lg:left-0 lg:right-0 lg:rounded-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <div className="bg-[#38BDF8]/10 border border-[#38BDF8]/30 p-1.5 rounded-lg">
              <img src={companyLogo} alt="XSAV Lab logo" className="w-7 h-7 lg:w-10 lg:h-10 rounded object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">
                XSAV Lab
              </span>
              <span className="text-xs text-gray-400 tracking-wider">CYBERSECURITY SERVICES</span>
            </div>
          </motion.div>
          {/* <button
            type="button"
            className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
            aria-label="Go back"
          >
            <ArrowLeft size={24} aria-hidden="true" />
          </button> */}

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="text-gray-300 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg transition-all font-medium"
                whileHover={{ y: -1 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <motion.button
              onClick={() => onScheduleClick && onScheduleClick()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Schedule consultation"
              className="bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-dark-navy px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-[#38BDF8]/25 transition-all"
            >
              Schedule Consultation
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="ml-auto lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          id="mobile-navigation"
          className="lg:hidden bg-dark-navy border-b border-[#38BDF8]/20"
        >
          <div className="px-4 py-6 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="block w-full text-left text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all font-medium"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4">
              <button
                onClick={() => {
                  onScheduleClick && onScheduleClick();
                  setIsOpen(false);
                }}
                aria-label="Schedule consultation"
                className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-dark-navy px-6 py-3 rounded-lg font-semibold shadow-lg shadow-primary/25 transition-all"
              >
                Schedule Consultation
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
