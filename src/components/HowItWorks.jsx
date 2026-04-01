import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Settings, Rocket, Shield } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: FileSearch,
      number: '01',
      title: 'Discovery & Assessment',
      description: 'We conduct a comprehensive analysis of your security posture, infrastructure, and business objectives to identify risks and opportunities.',
      deliverable: 'Detailed Assessment Report',
    },
    {
      icon: Settings,
      number: '02',
      title: 'Strategy & Planning',
      description: 'Our experts design a tailored roadmap with clear milestones, timelines, and success metrics aligned to your business goals.',
      deliverable: 'Implementation Roadmap',
    },
    {
      icon: Rocket,
      number: '03',
      title: 'Deployment & Execution',
      description: 'Rapid implementation with minimal business disruption. Our team handles everything from setup to integration and testing.',
      deliverable: 'Live Production System',
    },
    {
      icon: Shield,
      number: '04',
      title: 'Monitoring & Support',
      description: '24/7 monitoring, continuous optimization, and dedicated support to ensure ongoing security and peak performance.',
      deliverable: 'Ongoing Protection & Updates',
    },
  ];

  return (
    <section id="process" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-6"
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Methodology</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Proven Process For
            <span className="text-primary"> Project Success</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A structured, transparent approach that delivers measurable results on time and within budget
          </p>
        </motion.div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block">
          <div className="relative mb-20">
            {/* Connecting Line */}
            <div className="absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Number Badge */}
                  <div className="relative z-10 mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xl mb-8 shadow-lg shadow-primary/30">
                    {step.number}
                  </div>

                  {/* Card */}
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 h-full">
                    {/* Icon */}
                    <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg w-fit mb-4">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{step.description}</p>
                    
                    {/* Deliverable */}
                    <div className="pt-4 border-t border-gray-700">
                      <div className="text-xs text-gray-500 mb-1">Deliverable</div>
                      <div className="text-sm font-semibold text-primary">{step.deliverable}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden space-y-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="flex items-start space-x-4"
            >
              {/* Left: Number & Line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/30">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-32 bg-gradient-to-b from-primary/50 to-transparent mt-4" />
                )}
              </div>

              {/* Right: Content */}
              <div className="flex-1 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="bg-primary/10 border border-primary/30 p-2.5 rounded-lg w-fit mb-4">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{step.description}</p>
                <div className="pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-500 mb-1">Deliverable</div>
                  <div className="text-sm font-semibold text-primary">{step.deliverable}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 md:p-12"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">2-4</div>
              <div className="text-gray-400">Weeks Typical Deployment</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-gray-400">Project Success Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Support Coverage</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Successful Projects</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
