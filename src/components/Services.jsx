import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cloud, Bot, ArrowRight, Lock, CheckCircle2, Users, TrendingUp, Globe, Package } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description, features, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 hover:border-primary/50 rounded-xl p-8 transition-all duration-300 group"
    >
      {/* Icon */}
      <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg w-fit mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
        <Icon className="w-8 h-8 text-primary" />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Learn More */}
      <motion.button
        whileHover={{ x: 5 }}
        className="flex items-center space-x-2 text-primary font-semibold group/btn"
      >
        <span>Explore Service</span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
};

const Services = () => {
  const services = [
    {
      icon: Shield,
      title: 'Cybersecurity Services',
      description: 'Comprehensive security solutions to protect your business from evolving cyber threats with 24/7 monitoring and expert response.',
      features: [
        'Security Assessment & Penetration Testing',
        'Managed Security Operations (SOC)',
        'Incident Response & Forensics',
        'Compliance Management (ISO, GDPR, SOC 2)',
        'Security Awareness Training',
      ],
    },
    {
      icon: Cloud,
      title: 'Cloud Infrastructure',
      description: 'Scalable and secure cloud solutions with DevOps automation, cost optimization, and enterprise-grade reliability.',
      features: [
        'Cloud Migration & Strategy (AWS, Azure, GCP)',
        'DevOps & CI/CD Implementation',
        'Infrastructure as Code (IaC)',
        'Cloud Security & Governance',
        'Disaster Recovery & Business Continuity',
      ],
    },
    {
      icon: Bot,
      title: 'AI Integration Services',
      description: 'Strategic AI implementation and custom automation solutions to enhance efficiency and drive business innovation.',
      features: [
        'AI Strategy & Consulting',
        'Custom AI Agent Development',
        'Intelligent Process Automation',
        'Machine Learning Implementation',
        'AI Security & Risk Management',
      ],
    },
    {
      icon: Globe,
      title: 'Custom Website Development',
      description: 'Professional web solutions tailored to your business needs, from corporate websites to complex web applications.',
      features: [
        'Custom Website Design & Development',
        'E-commerce & Booking Systems',
        'Progressive Web Apps (PWA)',
        'Responsive & Mobile-First Design',
        'SEO Optimization & Performance',
        'Content Management Systems (CMS)',
      ],
    },
    {
      icon: Package,
      title: 'Enterprise Software Solutions',
      description: 'Scalable, secure custom software solutions built to streamline operations and drive business growth.',
      features: [
        'Custom Business Applications',
        'ERP & CRM System Integration',
        'Workflow Automation Tools',
        'Database Design & Management',
        'API Development & Integration',
        'Legacy System Modernization',
      ],
    },
  ];

  const trustMetrics = [
    { icon: Lock, text: 'Enterprise-Grade Security', subtext: 'Bank-level encryption' },
    { icon: Users, text: '500+ Clients', subtext: 'Across 25 industries' },
    { icon: TrendingUp, text: '99.8% Success Rate', subtext: 'Client satisfaction' },
    { icon: CheckCircle2, text: 'Certified Experts', subtext: 'ISO 27001 & SOC 2' },
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
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
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Services</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Full-Stack Technology &
            <span className="text-primary"> Security Solutions</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From cybersecurity to custom software development, we deliver comprehensive solutions to protect, build, and transform your digital infrastructure.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} index={index} />
          ))}
        </div>

        {/* Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 md:p-12"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg w-fit mx-auto mb-4">
                  <metric.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-lg font-semibold text-white mb-1">{metric.text}</div>
                <div className="text-sm text-gray-400">{metric.subtext}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
