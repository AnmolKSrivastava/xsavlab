import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import companyLogo from '../../assets/images/logo/xsav_lab_logo.jpeg';

const Navbar = ({ onScheduleClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-dark-navy/95 backdrop-blur-md border-b border-primary/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <div className="bg-primary/10 border border-primary/30 p-1.5 rounded-lg">
              <img src={companyLogo} alt="XSAV Lab logo" className="w-10 h-10 rounded object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">
                XSAV Lab
              </span>
              <span className="text-xs text-gray-400 tracking-wider">CYBERSECURITY SERVICES</span>
            </div>
          </motion.div>

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
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-primary/25 transition-all"
            >
              Schedule Consultation
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
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
          className="lg:hidden bg-dark-navy/98 backdrop-blur-md border-b border-primary/20"
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
                className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-primary/25 transition-all"
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
