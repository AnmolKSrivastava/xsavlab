import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Settings, Rocket, Shield, CheckCircle2, Clock, Users, Award } from 'lucide-react';
import useSiteSettings from '../hooks/useSiteSettings';

const ProcessPage = () => {
  const { settings } = useSiteSettings();
  const stats = settings.statistics;

  const steps = [
    {
      icon: FileSearch,
      number: '01',
      title: 'Discovery & Assessment',
      description: 'We conduct a comprehensive analysis of your security posture, infrastructure, and business objectives to identify risks and opportunities.',
      deliverable: 'Detailed Assessment Report',
      details: [
        'In-depth security audit and risk assessment',
        'Infrastructure and technology stack review',
        'Business requirements gathering',
        'Compliance and regulatory analysis',
        'Gap analysis and recommendations',
      ],
    },
    {
      icon: Settings,
      number: '02',
      title: 'Strategy & Planning',
      description: 'Our experts design a tailored roadmap with clear milestones, timelines, and success metrics aligned to your business goals.',
      deliverable: 'Implementation Roadmap',
      details: [
        'Customized solution architecture design',
        'Project timeline and milestone definition',
        'Resource allocation and team assignment',
        'Budget planning and cost optimization',
        'Risk mitigation strategy development',
      ],
    },
    {
      icon: Rocket,
      number: '03',
      title: 'Deployment & Execution',
      description: 'Rapid implementation with minimal business disruption. Our team handles everything from setup to integration and testing.',
      deliverable: 'Live Production System',
      details: [
        'Agile implementation methodology',
        'Continuous integration and testing',
        'User training and documentation',
        'Performance optimization',
        'Thorough quality assurance',
      ],
    },
    {
      icon: Shield,
      number: '04',
      title: 'Monitoring & Support',
      description: '24/7 monitoring, continuous optimization, and dedicated support to ensure ongoing security and peak performance.',
      deliverable: 'Ongoing Protection & Updates',
      details: [
        '24/7 system monitoring and alerts',
        'Regular security updates and patches',
        'Performance optimization',
        'Dedicated support team',
        'Continuous improvement initiatives',
      ],
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Fast Deployment',
      description: 'Average deployment time of just a few weeks with minimal disruption to your operations.',
    },
    {
      icon: CheckCircle2,
      title: 'Proven Success',
      description: `${stats.projectSuccessRate}% project success rate with satisfied clients across ${stats.industries}+ industries.`,
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Certified professionals with decades of combined experience in security and technology.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Rigorous testing and quality control to ensure every solution meets the highest standards.',
    },
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
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Methodology</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Proven Process For
              <span className="text-primary"> Project Success</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A structured, transparent approach that delivers measurable results on time and within budget. Our four-phase methodology ensures your project succeeds from planning to production.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Desktop: Horizontal Timeline */}
      <section className="py-16 relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative mb-28 pb-4">
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
      </section>

      {/* Mobile: Vertical Timeline */}
      <section className="py-16 relative lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
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
        </div>
      </section>

      {/* Detailed Process Breakdown */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What's Included in <span className="text-primary">Each Phase</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Detailed breakdown of our comprehensive approach
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-xl p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phase {step.number}</div>
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  </div>
                </div>

                <ul className="space-y-3">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Our <span className="text-primary">Process Works</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Proven methodology delivering consistent results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-xl p-6 text-center"
              >
                <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg w-fit mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 md:p-12"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stats.deploymentWeeks}</div>
                <div className="text-gray-400">Weeks Typical Deployment</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stats.projectSuccessRate}%</div>
                <div className="text-gray-400">Project Success Rate</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stats.supportCoverage}</div>
                <div className="text-gray-400">Support Coverage</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stats.successfulProjects}+</div>
                <div className="text-gray-400">Successful Projects</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProcessPage;
