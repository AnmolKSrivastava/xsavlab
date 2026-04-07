import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Zap, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CountUpNumber from './CountUpNumber';
import useSiteSettings from '../hooks/useSiteSettings';

const About = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const stats = settings.statistics;

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'Every solution we build prioritizes security and data protection from the ground up.',
    },
    {
      icon: Target,
      title: 'Client-Focused',
      description: 'Your success is our mission. We tailor solutions to meet your specific business needs.',
    },
    {
      icon: Zap,
      title: 'Innovation Driven',
      description: 'Leveraging cutting-edge technology to deliver modern, scalable solutions.',
    },
  ];

  return (
    <section id="about" className="py-24 relative">
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
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">About Us</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Securing The Digital Future With
            <span className="text-primary"> Expert Solutions</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            XSAV Lab is a leading technology and cybersecurity firm dedicated to protecting businesses and building innovative digital solutions.
          </p>
        </motion.div>

        {/* Core Values - Preview (3 items) */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center"
            >
              <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg w-fit mx-auto mb-4">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 md:p-12 mb-8"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2"><CountUpNumber end={stats.foundedYear} /></div>
              <div className="text-gray-400">Founded</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2"><CountUpNumber end={stats.clientsServed} suffix="+" /></div>
              <div className="text-gray-400">Clients Served</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2"><CountUpNumber end={stats.industries} suffix="+" /></div>
              <div className="text-gray-400">Industries</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2"><CountUpNumber end={stats.clientSatisfaction} decimals={1} suffix="%" /></div>
              <div className="text-gray-400">Client Satisfaction</div>
            </div>
          </div>
        </motion.div>

        {/* Learn More CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            onClick={() => navigate('/about')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <span>Learn More About Us</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
