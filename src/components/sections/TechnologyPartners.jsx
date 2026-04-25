import React from 'react';
import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';
import microsoftAzureLogo from '../../assets/images/logo/microsoft_azure_logo.png';
import awsLogo from '../../assets/images/logo/aws.webp';
import gcpLogo from '../../assets/images/logo/google_cloud_platform.png';

const TechnologyPartners = () => {
  const partners = [
    {
      name: 'Microsoft Azure',
      logo: microsoftAzureLogo,
      description: 'Cloud Computing & AI Services',
    },
    {
      name: 'Amazon Web Services',
      logo: awsLogo,
      description: 'Cloud Infrastructure & Security',
    },
    {
      name: 'Google Cloud Platform',
      logo: gcpLogo,
      description: 'AI & Machine Learning Platform',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-6"
        >
          <Cloud className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Technology Partners</span>
        </motion.div>

        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Powered By <span className="text-primary">Leading Cloud Providers</span>
        </h3>
        <p className="text-gray-400">Leveraging enterprise-grade infrastructure from industry leaders</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-primary/50 rounded-xl p-8 text-center transition-all duration-300 group"
          >
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl w-fit mx-auto mb-6 group-hover:bg-white transition-all">
              <div className="w-24 h-24 mx-auto flex items-center justify-center">
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
              {partner.name}
            </div>
            <div className="text-sm text-gray-400">{partner.description}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TechnologyPartners;
