import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cloud, Bot, ArrowRight, Lock, CheckCircle2, Users, TrendingUp, Globe, Package, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CountUpNumber from '../components/ui/CountUpNumber';
import useSiteSettings from '../hooks/useSiteSettings';

const ServiceCard = ({ icon: Icon, title, description, features, benefits, index }) => {
  const navigate = useNavigate();

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
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Features</h4>
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Benefits */}
      {benefits && benefits.length > 0 && (
        <div className="mb-6 pt-6 border-t border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Benefits</h4>
          <ul className="space-y-2">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <ArrowRight className="w-3 h-3 text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-400 text-xs">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Get Started */}
      <motion.button
        onClick={() => navigate('/contact')}
        whileHover={{ x: 5 }}
        className="flex items-center space-x-2 text-primary font-semibold group/btn"
      >
        <span>Get Started</span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
};

const ServicesPage = () => {
  const { settings } = useSiteSettings();
  const stats = settings.statistics;
  const navigate = useNavigate();

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
        'Vulnerability Management',
      ],
      benefits: [
        'Proactive threat detection and prevention',
        'Reduced risk of data breaches',
        'Regulatory compliance assurance',
        'Enhanced security posture',
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
        'Performance Optimization',
      ],
      benefits: [
        'Reduced infrastructure costs',
        'Improved scalability and flexibility',
        'Faster deployment cycles',
        'Enhanced reliability and uptime',
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
        'Natural Language Processing',
      ],
      benefits: [
        'Automated repetitive tasks',
        'Data-driven insights and decisions',
        'Improved customer experiences',
        'Competitive advantage through innovation',
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
      benefits: [
        'Professional online presence',
        'Enhanced user engagement',
        'Mobile-ready experiences',
        'Better search engine visibility',
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
      benefits: [
        'Streamlined business processes',
        'Improved operational efficiency',
        'Better data management',
        'Scalable solutions for growth',
      ],
    },
  ];

  const trustMetrics = [
    { icon: Lock, text: 'Enterprise-Grade Security', subtext: 'Bank-level encryption' },
    { icon: Users, value: stats.clientsServed, suffix: '+', label: 'Clients', subtext: `Across ${stats.industries} industries` },
    { icon: TrendingUp, value: stats.successRate, decimals: 1, suffix: '%', label: 'Success Rate', subtext: 'Client satisfaction' },
    { icon: CheckCircle2, text: 'Certified Experts', subtext: 'ISO 27001 & SOC 2' },
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
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Services</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Full-Stack Technology &
              <span className="text-primary"> Security Solutions</span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From cybersecurity to custom software development, we deliver comprehensive solutions to protect, build, and transform your digital infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <ServiceCard key={service.title} {...service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-primary">XSAV Lab</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Industry-leading expertise and commitment to your success
            </p>
          </motion.div>

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
                  <div className="text-lg font-semibold text-white mb-1">
                    {metric.value !== undefined ? (
                      <>
                        <CountUpNumber end={metric.value} decimals={metric.decimals || 0} suffix={metric.suffix || ''} /> {metric.label}
                      </>
                    ) : metric.text}
                  </div>
                  <div className="text-sm text-gray-400">{metric.subtext}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-12 text-center"
          >
            <Award className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how our services can help your business achieve its goals. Schedule a consultation with our experts today.
            </p>
            <motion.button
              onClick={() => navigate('/contact')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold shadow-lg shadow-primary/25 transition-all"
            >
              <span>Schedule Consultation</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
