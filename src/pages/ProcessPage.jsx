import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Users, Award } from 'lucide-react';
import useSiteSettings from '../hooks/useSiteSettings';
import ProcessMorph from '../components/Process/ProcessMorph';

const ProcessPage = () => {
  const { settings } = useSiteSettings();
  const stats = settings.statistics;

  const benefits = [
    {
      icon: Clock,
      title: 'Fast Deployment',
      description:
        'Average deployment time of just a few weeks with minimal disruption to your operations.',
    },
    {
      icon: CheckCircle2,
      title: 'Proven Success',
      description: `${stats.projectSuccessRate}% project success rate with satisfied clients across ${stats.industries}+ industries.`,
    },
    {
      icon: Users,
      title: 'Expert Team',
      description:
        'Certified professionals with decades of combined experience in security and technology.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description:
        'Rigorous testing and quality control to ensure every solution meets the highest standards.',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-navy text-white">
      <ProcessMorph />

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
              Why Our <span className="text-[#38BDF8]">Process Works</span>
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
                <div className="bg-[#38BDF8]/10 border border-[#38BDF8]/30 p-3 rounded-lg w-fit mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-[#38BDF8]" />
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
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stats.deploymentWeeks}
                </div>
                <div className="text-gray-400">Weeks Typical Deployment</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stats.projectSuccessRate}%
                </div>
                <div className="text-gray-400">Project Success Rate</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stats.supportCoverage}
                </div>
                <div className="text-gray-400">Support Coverage</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stats.successfulProjects}+
                </div>
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
