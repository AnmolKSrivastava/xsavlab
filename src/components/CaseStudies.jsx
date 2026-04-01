import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Cloud, ArrowRight, Award } from 'lucide-react';
import CountUpNumber from './CountUpNumber';

const CaseStudyCard = ({ company, industry, challenge, solution, results, icon: Icon, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-primary/50 rounded-xl p-8 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {company}
          </h3>
          <span className="text-sm text-primary font-medium">{industry}</span>
        </div>
        <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Challenge */}
      <div className="mb-5">
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Challenge</div>
        <p className="text-gray-300 text-sm leading-relaxed">{challenge}</p>
      </div>

      {/* Solution */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Solution</div>
        <p className="text-gray-300 text-sm leading-relaxed">{solution}</p>
      </div>

      {/* Results */}
      <div className="border-t border-gray-700 pt-6">
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Results</div>
        <div className="grid grid-cols-3 gap-4">
          {results.map((result, idx) => (
            <div key={idx} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="text-3xl font-bold text-primary mb-1"
              >
                <CountUpNumber
                  end={result.end}
                  decimals={result.decimals || 0}
                  suffix={result.suffix || ''}
                  prefix={result.prefix || ''}
                />
              </motion.div>
              <div className="text-xs text-gray-400">{result.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ x: 5 }}
        className="mt-6 flex items-center space-x-2 text-primary font-semibold group"
      >
        <span>View Case Study</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
};

const CaseStudies = () => {
  const cases = [
    {
      company: 'FinServe Global',
      industry: 'Financial Services',
      challenge: 'Legacy security systems unable to detect sophisticated threats, resulting in compliance risks and potential data breaches.',
      solution: 'Deployed AI-powered Security Operations Center with 24/7 threat monitoring, automated incident response, and comprehensive security audits.',
      results: [
        { end: 92, suffix: '%', label: 'Threat Reduction' },
        { end: 65, suffix: '%', label: 'Faster Response' },
        { end: 100, suffix: '%', label: 'Compliance Achieved' },
      ],
      icon: Shield,
    },
    {
      company: 'RetailMax Corp',
      industry: 'E-Commerce',
      challenge: 'On-premise infrastructure with high operational costs, limited scalability, and frequent downtime affecting customer experience.',
      solution: 'Complete cloud migration to AWS with automated DevOps pipelines, Infrastructure as Code, and intelligent cost optimization strategies.',
      results: [
        { end: 42, suffix: '%', label: 'Cost Savings' },
        { end: 99.9, decimals: 1, suffix: '%', label: 'Uptime SLA' },
        { end: 3, suffix: 'x', label: 'Performance Boost' },
      ],
      icon: Cloud,
    },
    {
      company: 'HealthTech Solutions',
      industry: 'Healthcare',
      challenge: 'Manual patient support processes overwhelming staff, leading to long wait times and decreased patient satisfaction scores.',
      solution: 'Implemented custom AI chatbot with HIPAA-compliant infrastructure, integrated with existing EMR systems for seamless patient interactions.',
      results: [
        { end: 80, suffix: '%', label: 'Queries Automated' },
        { end: 50, suffix: '%', label: 'Response Time Cut' },
        { end: 4.8, decimals: 1, suffix: '/5', label: 'Patient Satisfaction' },
      ],
      icon: TrendingUp,
    },
  ];

  return (
    <section id="case-studies" className="py-24 relative">
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
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Success Stories</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Real Results For
            <span className="text-primary"> Real Businesses</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover how we've helped organizations across industries solve complex security and infrastructure challenges
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {cases.map((caseStudy, index) => (
            <CaseStudyCard key={caseStudy.company} {...caseStudy} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to transform your organization?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who've enhanced their security posture and optimized their infrastructure with XSAV Lab.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all inline-flex items-center space-x-2"
            >
              <span>Start Your Success Story</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudies;
