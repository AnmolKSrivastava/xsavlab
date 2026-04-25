import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Award, Building2, Shield } from 'lucide-react';
import CountUpNumber from '../ui/CountUpNumber';
import useSiteSettings from '../../hooks/useSiteSettings';
import TechnologyPartners from './TechnologyPartners';

const TrustSection = () => {
  const { settings } = useSiteSettings({ deferFetch: true });
  const stats = settings.statistics;
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getReviews');
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      // Take only first 3 approved reviews for display
      setTestimonials((data.reviews || []).slice(0, 3));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Keep empty array if fetch fails
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const certifications = [
    { name: 'ISO 27001', desc: 'Information Security' },
    { name: 'SOC 2 Type II', desc: 'Service Organization Control' },
    { name: 'GDPR', desc: 'Data Protection Certified' },
    { name: 'PCI DSS', desc: 'Payment Card Compliance' },
    { name: 'HIPAA', desc: 'Healthcare Compliance' },
    { name: 'NIST CSF', desc: 'Cybersecurity Framework' },
  ];

  const industries = ['Financial Services', 'Healthcare', 'Retail & E-Commerce', 'Manufacturing', 'Media & Entertainment', 'Gaming & Esports', 'Technology', 'Education', 'Government', 'Energy & Utilities', 'Telecommunications', 'Transportation & Logistics'];

  return (
    <section id="trust" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-6"
            >
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Client Success Stories</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted By Industry Leaders
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join <CountUpNumber end={stats.organizations} suffix="+" className="text-white" /> organizations who rely on our security expertise to protect their digital assets
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 animate-pulse"
                >
                  <div className="flex mb-4 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-5 h-5 bg-gray-700 rounded" />
                    ))}
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                  </div>
                  <div className="border-t border-gray-700 pt-4 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            ) : testimonials.length === 0 ? (
              // Empty state
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-400 text-lg">No client reviews available yet.</p>
              </div>
            ) : (
              // Testimonials display
              testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-primary/50 rounded-xl p-8 transition-all duration-300 relative"
                >
                  <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  <p className="text-gray-300 text-base mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="font-bold text-white mb-1">{testimonial.clientName}</div>
                    {testimonial.clientRole && (
                      <div className="text-sm text-gray-400 mb-1">{testimonial.clientRole}</div>
                    )}
                    {testimonial.clientCompany && (
                      <div className="text-xs text-primary">{testimonial.clientCompany}</div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Industries Served */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Serving <span className="text-primary">Multiple Industries</span>
            </h3>
            <p className="text-gray-400">Specialized expertise across diverse sectors</p>
          </div>

          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {industries.map((industry, index) => (
                <motion.div
                  key={industry}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-2 text-gray-300"
                >
                  <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{industry}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Technology Partners */}
        <TechnologyPartners />

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-6"
            >
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Certifications & Compliance</span>
            </motion.div>

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Enterprise-Grade Security Standards
            </h3>
            <p className="text-gray-400">Certified and compliant with global security frameworks</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-primary/50 rounded-xl p-6 text-center transition-all duration-300 group"
              >
                <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg w-fit mx-auto mb-3 group-hover:bg-primary/20 transition-all">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="text-base font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  {cert.name}
                </div>
                <div className="text-sm text-gray-400">{cert.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
