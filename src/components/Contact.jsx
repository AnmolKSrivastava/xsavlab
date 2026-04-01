import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle, Clock, Shield, ArrowRight } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'cybersecurity',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', company: '', service: 'cybersecurity', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'contact@xsavlab.com', href: 'mailto:contact@xsavlab.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, label: 'Location', value: 'San Francisco, CA, USA', href: '#' },
  ];

  const quickLinks = [
    { icon: Clock, text: 'Response within 24 hours' },
    { icon: Shield, text: 'Enterprise-grade security' },
    { icon: CheckCircle, text: 'No commitment required' },
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-6"
          >
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Get In Touch</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Let's Discuss Your
            <span className="text-primary"> Security Needs</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Schedule a consultation with our security experts and discover how we can protect and optimize your infrastructure
          </p>
        </motion.div>

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
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-4 group"
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
                    <p className="text-gray-300">We'll get back to you within 24 hours.</p>
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
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
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
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
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
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company Name"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Service Interest *
                    </label>
                    <select
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    >
                      <option value="cybersecurity">Cybersecurity Services</option>
                      <option value="cloud">Cloud Solutions</option>
                      <option value="ai">AI Integration</option>
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
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us about your security challenges and goals..."
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
