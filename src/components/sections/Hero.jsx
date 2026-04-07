import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, CheckCircle2, Award } from 'lucide-react';
import CountUpNumber from '../ui/CountUpNumber';
import useSiteSettings from '../../hooks/useSiteSettings';

const Hero = ({ onScheduleClick }) => {
  const { settings } = useSiteSettings();
  const stats = settings.statistics;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-6"
            >
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Trusted Security Partner</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white"
            >
              Enterprise
              <span className="text-primary"> Cybersecurity </span>
              Services That Protect Your Business
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-300 mb-8 max-w-xl leading-relaxed"
            >
              Comprehensive security solutions, cloud infrastructure management, and expert consulting to safeguard your digital assets and ensure business continuity.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col space-y-3 mb-8"
            >
              {[
                '24/7 Security Operations Center',
                'ISO 27001 & SOC 2 Certified',
                'Zero Trust Architecture Specialists'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={() => onScheduleClick && onScheduleClick('cybersecurity')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 shadow-xl shadow-primary/25 transition-all"
              >
                <span>Request Security Assessment</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => {
                  const servicesSection = document.getElementById('services');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-gray-600 hover:border-primary text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                View Services
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              <div>
                <div className="text-4xl font-bold text-white mb-1"><CountUpNumber end={stats.clientsServed} suffix="+" /></div>
                <div className="text-sm text-gray-400">Enterprise Clients</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1"><CountUpNumber end={stats.threatDetection} decimals={1} suffix="%" /></div>
                <div className="text-sm text-gray-400">Threat Detection</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1"><CountUpNumber end={stats.yearsExperience} suffix="+" /></div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Professional Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/20 border border-primary/40 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Security Overview</div>
                    <div className="text-xs text-gray-400">Real-time monitoring</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400 font-medium">Secure</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Threat Prevention Rate</span>
                    <span className="text-primary font-semibold text-sm">Excellent</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2"><CountUpNumber end={99.8} decimals={1} suffix="%" /></div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '99.8%' }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-2">Vulnerabilities</div>
                    <div className="text-2xl font-bold text-white"><CountUpNumber end={0} /></div>
                    <div className="text-xs text-green-400 mt-1 flex items-center">
                      <span className="mr-1">↓</span> Critical Issues
                    </div>
                  </div>
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-2">Compliance</div>
                    <div className="text-2xl font-bold text-white"><CountUpNumber end={100} suffix="%" /></div>
                    <div className="text-xs text-green-400 mt-1">All Standards Met</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Security Score</div>
                      <div className="text-3xl font-bold text-primary">A+</div>
                    </div>
                    <div className="bg-primary/20 p-3 rounded-lg">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-primary/30 p-5 rounded-xl shadow-xl"
            >
              <div className="text-sm text-gray-400 mb-1">Threats Blocked Today</div>
              <div className="text-3xl font-bold text-primary"><CountUpNumber end={2847} /></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
