import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cloud, Bot, ArrowRight, CheckCircle2, Globe, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ icon: Icon, title, description, features, index, onScheduleClick, serviceId }) => {
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
        onClick={() => onScheduleClick && onScheduleClick(serviceId)}
        whileHover={{ x: 5 }}
        className="flex items-center space-x-2 text-primary font-semibold group/btn"
      >
        <span>Get Started</span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
};

const Services = ({ onScheduleClick }) => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Shield,
      title: 'Cybersecurity Services',
      serviceId: 'cybersecurity',
      description: 'Comprehensive security solutions to protect your business from evolving cyber threats with 24/7 monitoring.',
      features: [
        'Security Assessment & Penetration Testing',
        'Managed Security Operations (SOC)',
        'Compliance Management (ISO, GDPR, SOC 2)',
      ],
    },
    {
      icon: Cloud,
      title: 'Cloud Infrastructure',
      serviceId: 'cloud',
      description: 'Scalable and secure cloud solutions with DevOps automation and enterprise-grade reliability.',
      features: [
        'Cloud Migration & Strategy (AWS, Azure, GCP)',
        'DevOps & CI/CD Implementation',
        'Disaster Recovery & Business Continuity',
      ],
    },
    {
      icon: Bot,
      title: 'AI Integration Services',
      serviceId: 'ai',
      description: 'Strategic AI implementation and custom automation solutions to enhance efficiency.',
      features: [
        'AI Strategy & Consulting',
        'Custom AI Agent Development',
        'Intelligent Process Automation',
      ],
    },
    {
      icon: Globe,
      title: 'Custom Website Development',
      serviceId: 'website',
      description: 'Professional web solutions from corporate websites to complex web applications.',
      features: [
        'Custom Website Design & Development',
        'E-commerce & Booking Systems',
        'SEO Optimization & Performance',
      ],
    },
    {
      icon: Package,
      title: 'Enterprise Software Solutions',
      serviceId: 'software',
      description: 'Scalable, secure custom software solutions built to streamline operations.',
      features: [
        'Custom Business Applications',
        'ERP & CRM System Integration',
        'API Development & Integration',
      ],
    },
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

        {/* Services Grid - Preview (3 services) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.slice(0, 3).map((service, index) => (
            <ServiceCard key={service.title} {...service} index={index} onScheduleClick={onScheduleClick} />
          ))}
        </div>

        {/* View All Services CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            onClick={() => navigate('/services')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <span>View All Services & Details</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
