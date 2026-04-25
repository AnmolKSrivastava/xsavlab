import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'contact@xsavlab.com', href: 'mailto:contact@xsavlab.com' },
    { icon: Phone, label: 'Phone', value: '+91 9884649716', href: 'tel:+919884649716' },
    { icon: MapPin, label: 'Location', value: 'Pune, India', href: 'https://www.google.com/maps/place/Sprint+Business+Tower+Hinjewadi/@18.5934873,73.7318534,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bb589f5e17f7:0xa33b6c837f4c25fd!8m2!3d18.5934873!4d73.7318534!16s%2Fg%2F11xdfmr9j_?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D' },
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
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
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Get In Touch</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Secure Your
            <span className="text-primary"> Digital Future?</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Let's discuss how we can protect and optimize your infrastructure with our expert security and technology solutions
          </p>

          {/* CTA Button */}
          <motion.button
            onClick={() => navigate('/contact')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-dark-navy px-10 py-5 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all"
          >
            <span>Get In Touch</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Quick Contact Info */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {contactInfo.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target={item.label === 'Location' ? '_blank' : undefined}
              rel={item.label === 'Location' ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-primary/50 rounded-xl p-6 text-center group transition-all cursor-pointer"
            >
              <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-all">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm text-gray-400 mb-2">{item.label}</div>
              <div className="font-semibold text-white group-hover:text-primary transition-colors">
                {item.value}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;

