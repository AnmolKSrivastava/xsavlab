import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Settings, Rocket, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();

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

        {/* Process Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
            >
              {/* Number Badge */}
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-primary/30">
                {step.number}
              </div>

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
            </motion.div>
          ))}
        </div>

        {/* Learn More CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            onClick={() => navigate('/process')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <span>View Detailed Process</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
