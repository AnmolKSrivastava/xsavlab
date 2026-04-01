import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, MessageSquare, BarChart, Shield, Code, Sparkles, ArrowRight } from 'lucide-react';

const MarketplaceCard = ({ icon: Icon, name, description, category, price, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="glass rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full font-semibold">
            {category}
          </span>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-secondary"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="bg-gradient-to-r from-primary to-secondary p-4 rounded-xl w-fit mb-4 group-hover:glow"
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Name */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Starting at</div>
            <div className="text-lg font-bold text-primary">{price}</div>
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            className="flex items-center space-x-2 text-secondary font-semibold text-sm"
          >
            <span>Try Demo</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Marketplace = () => {
  const agents = [
    {
      icon: MessageSquare,
      name: 'Customer Support AI',
      description: '24/7 intelligent customer service agent with multi-language support and sentiment analysis.',
      category: 'Customer Service',
      price: '$299/mo',
    },
    {
      icon: Shield,
      name: 'Security Analyst AI',
      description: 'Automated threat detection, vulnerability scanning, and real-time security monitoring.',
      category: 'Cybersecurity',
      price: '$499/mo',
    },
    {
      icon: BarChart,
      name: 'Sales Intelligence AI',
      description: 'Lead scoring, pipeline prediction, and automated follow-ups to boost sales efficiency.',
      category: 'Sales & Marketing',
      price: '$349/mo',
    },
    {
      icon: Code,
      name: 'DevOps Automation AI',
      description: 'Automated CI/CD management, infrastructure monitoring, and incident response.',
      category: 'DevOps',
      price: '$399/mo',
    },
    {
      icon: Bot,
      name: 'HR Assistant AI',
      description: 'Recruitment automation, employee onboarding, and HR query resolution.',
      category: 'Human Resources',
      price: '$279/mo',
    },
    {
      icon: Zap,
      name: 'Data Analytics AI',
      description: 'Real-time data insights, predictive analytics, and automated reporting.',
      category: 'Analytics',
      price: '$449/mo',
    },
  ];

  return (
    <section id="ai-agents" className="py-20 relative overflow-hidden bg-gradient-to-b from-dark to-dark/50">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Floating Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-20 right-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4"
          >
            <Bot className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold">AI Agent Marketplace</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Pre-Built AI Agents
            </span>
            <br />
            Ready to Deploy
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose from our marketplace of specialized AI agents, customize to your needs,
            and deploy in minutes. No coding required.
          </p>
        </motion.div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {agents.map((agent, index) => (
            <MarketplaceCard key={agent.name} {...agent} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-full font-semibold text-lg glow inline-flex items-center space-x-2"
          >
            <span>View All AI Agents</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <p className="text-gray-400 mt-4">
            Or <span className="text-primary cursor-pointer hover:underline">build a custom AI agent</span> tailored to your specific needs
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Marketplace;
