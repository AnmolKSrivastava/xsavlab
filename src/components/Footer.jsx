import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import companyLogo from '../assets/images/logo/xsav_lab_logo.jpeg';

const Footer = () => {
  const footerLinks = {
    Services: ['Cybersecurity', 'Cloud Infrastructure', 'AI Integration', 'Consulting', 'Managed Services'],
    Company: ['About Us', 'Careers', 'Partners', 'Blog', 'Contact'],
    Resources: ['Case Studies', 'Documentation', 'Security Center', 'Compliance', 'Support'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Acceptable Use', 'SLA'],
  };

  const certifications = ['ISO 27001', 'SOC 2', 'GDPR', 'HIPAA'];

  return (
    <footer className="relative bg-gradient-to-b from-dark-navy to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Top Section */}
        <div className="grid lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary/20 border border-primary/40 p-1.5 rounded-lg">
                <img src={companyLogo} alt="XSAV Lab logo" className="w-10 h-10 rounded object-cover" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">XSAV Lab</div>
                <div className="text-xs text-gray-400 tracking-wider">CYBERSECURITY SERVICES</div>
              </div>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Enterprise cybersecurity and cloud solutions provider, protecting organizations with cutting-edge technology and expert consulting services.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="mailto:contact@xsavlab.com" className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Admin - contact@xsavlab.com</span>
                <span className="text-sm">Sales - sales@xsavlab.com</span>
              </a>
              <a href="tel:+919884649716" className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+91 9884649716</span>
              </a>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">317-A, Sprint Tower, Hinjewadi Phase 1, Pune, Maharashtra, India - 411057</span>
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Feltham, England</span>
              </div>
            </div>

            {/* Certifications */}
            <div className="mb-6">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Certified & Compliant</div>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <div
                    key={cert}
                    className="bg-gray-800/50 border border-gray-700 px-3 py-1 rounded text-xs font-semibold text-gray-300"
                  >
                    {cert}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Connect With Us</div>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/company/xsavlab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800/50 border border-gray-700 hover:border-primary hover:bg-primary/10 p-3 rounded-lg transition-all group"
                  aria-label="LinkedIn"
                >
                  <Users className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 3 }}
                      className="text-gray-400 hover:text-primary transition-colors text-sm inline-block"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-12 mb-12">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-white mb-3">Stay Updated on Security Trends</h3>
            <p className="text-gray-400 mb-6">
              Get the latest cybersecurity insights, threat intelligence, and best practices delivered to your inbox.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 whitespace-nowrap"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-400 text-center md:text-left">
                © {new Date().getFullYear()} XSAV Lab. All rights reserved.
              </div>
              {/* Admin Login Link */}
              <Link
                to="/admin-login"
                className="text-xs text-gray-600 hover:text-primary transition-colors flex items-center gap-1 group"
                title="Admin Portal"
              >
                <Shield className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                <span>Admin</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Secured by XSAV Lab</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
