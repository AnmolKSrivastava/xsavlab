import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle, Clock, Shield, ArrowRight, AlertCircle, Loader } from 'lucide-react';
import { submitEnquiry } from '../services/enquiry';

const ContactPage = ({ preSelectedService = 'cybersecurity' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: preSelectedService,
    message: '',
  });

  useEffect(() => {
    if (preSelectedService) {
      setFormData(prev => ({ ...prev, service: preSelectedService }));
    }
  }, [preSelectedService]);
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitEnquiry(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', service: preSelectedService, message: '' });
      
      // Hide success message after 4 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch (err) {
      setError(err.message || 'Failed to send your enquiry. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'Admin - contact@xsavlab.com', href: 'mailto:contact@xsavlab.com' },
    { icon: Mail, label: 'Email', value: 'Sales - sales@xsavlab.com', href: 'mailto:sales@xsavlab.com' },
    { icon: Phone, label: 'Phone', value: '+91 9884649716', href: 'tel:+919884649716' },
    { icon: MapPin, label: 'Location', value: '317-A, Sprint Tower, Hinjewadi Phase 1, Pune, Maharashtra, India - 411057', href: 'https://www.google.com/maps/place/Sprint+Business+Tower+Hinjewadi/@18.5934873,73.7318534,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bb589f5e17f7:0xa33b6c837f4c25fd!8m2!3d18.5934873!4d73.7318534!16s%2Fg%2F11xdfmr9j_?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D' },
    { icon: MapPin, label: 'Location', value: 'Feltham, England', href: '#' },
  ];

  const quickLinks = [
    { icon: Clock, text: 'Response within 24 hours' },
    { icon: Shield, text: 'Enterprise-grade security' },
    { icon: CheckCircle, text: 'No commitment required' },
  ];

  return (
    <div className="min-h-screen bg-dark-navy text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-4"
            >
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Get In Touch</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Let's Discuss Your
              <span className="text-primary"> Security/Technology Needs</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Schedule a consultation with our security and technology experts and discover how we can protect and optimize your infrastructure
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left: Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-8 sticky top-24">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                
                <div className="space-y-5 mb-8">
                  {contactInfo.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.href}
                      target={item.label === 'Location' ? '_blank' : undefined}
                      rel={item.label === 'Location' ? 'noopener noreferrer' : undefined}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-start space-x-4 group cursor-pointer"
                    >
                      <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg group-hover:bg-primary/20 transition-all">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">{item.label}</div>
                        <div className="font-semibold text-white group-hover:text-primary transition-colors">
                          {item.value}
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Quick Info */}
                <div className="border-t border-gray-700 pt-6 space-y-3">
                  {quickLinks.map((link, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center space-x-3 text-gray-300"
                    >
                      <link.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{link.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-8 relative">
                {/* Success Message */}
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-dark-navy/95 backdrop-blur-sm rounded-xl flex items-center justify-center z-20"
                  >
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="bg-green-500/20 border border-green-500/50 p-6 rounded-full w-fit mx-auto mb-6"
                      >
                        <CheckCircle className="w-16 h-16 text-green-500" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-300">Thank you! We've sent a confirmation email to <span className="text-primary font-semibold">{formData.email}</span></p>
                      <p className="text-gray-400 text-sm mt-3">Our team will respond within 24 hours.</p>
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start space-x-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-red-500 font-semibold">Error</h4>
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        disabled={loading}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        disabled={loading}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Company & Service */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        disabled={loading}
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Service Interest *
                      </label>
                      <select
                        name="service"
                        required
                        disabled={loading}
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="cybersecurity">Cybersecurity Services</option>
                        <option value="cloud">Cloud Infrastructure</option>
                        <option value="ai">AI Integration Services</option>
                        <option value="website">Custom Website Development</option>
                        <option value="software">Enterprise Software Solutions</option>
                        <option value="consulting">General Consulting</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      disabled={loading}
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Tell us about your security challenges and goals..."
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className="w-full bg-primary hover:bg-primary/90 text-dark-navy px-8 py-4 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

