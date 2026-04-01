import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Shield } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = ['Services', 'About', 'Process', 'Case Studies', 'Contact'];

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
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="bg-primary/10 border border-primary/30 p-2.5 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
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
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-300 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg transition-all font-medium"
                whileHover={{ y: -1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <motion.button
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
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="block text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-4">
              <button className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-primary/25 transition-all">
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
