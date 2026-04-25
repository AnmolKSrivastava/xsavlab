import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Zap, Shield, Link2, Mail, Users, Globe, TrendingUp } from 'lucide-react';
import amitKumarImgWebp from '../assets/images/team/amit-kumar-img.webp';
import shivAryanImgWebp from '../assets/images/team/shiv-aryan-img.webp';
import sumitKumarImgWebp from '../assets/images/team/sumit-kumar-img.webp';
import CountUpNumber from '../components/ui/CountUpNumber';
import useSiteSettings from '../hooks/useSiteSettings';
import TechnologyPartners from '../components/sections/TechnologyPartners';

const TeamMember = ({ name, role, bio, imageSet, linkedin, email, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 hover:border-primary/50 rounded-xl p-8 transition-all duration-300 group"
    >
      {/* Profile Image */}
      <div className="relative mb-6">
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
          {imageSet ? (
            <img
              src={imageSet.webp}
              alt={name}
              loading="lazy"
              decoding="async"
              width="128"
              height="128"
              className="w-full h-full object-cover"
            />
          ) : (
            <Shield className="w-16 h-16 text-primary" />
          )}
        </div>
      </div>

      {/* Name & Role */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
        <p className="text-primary font-semibold text-sm">{role}</p>
      </div>

      {/* Bio */}
      <p className="text-gray-400 text-sm leading-relaxed text-center mb-6">
        {bio}
      </p>

      {/* Social Links */}
      <div className="flex justify-center space-x-3">
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary/10 border border-primary/30 p-2 rounded-lg hover:bg-primary/20 transition-all"
          >
            <Link2 className="w-4 h-4 text-primary" />
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="bg-primary/10 border border-primary/30 p-2 rounded-lg hover:bg-primary/20 transition-all"
          >
            <Mail className="w-4 h-4 text-primary" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

const AboutPage = () => {
  const { settings } = useSiteSettings();
  const stats = settings.statistics;

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'Every solution we build prioritizes security and data protection from the ground up. We implement industry best practices and cutting-edge security measures to ensure your data and infrastructure remain protected.',
    },
    {
      icon: Target,
      title: 'Client-Focused',
      description: 'Your success is our mission. We tailor solutions to meet your specific business needs, working closely with you throughout the entire journey to ensure alignment with your goals.',
    },
    {
      icon: Zap,
      title: 'Innovation Driven',
      description: 'Leveraging cutting-edge technology to deliver modern, scalable solutions. We stay ahead of industry trends to provide you with the most advanced and effective solutions available.',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our team consists of certified professionals with decades of combined experience in cybersecurity, cloud infrastructure, and software development.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Serving clients worldwide with localized expertise and 24/7 support. Our global presence ensures we can meet your needs regardless of location or timezone.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Growth',
      description: 'Committed to continuous improvement and staying at the forefront of technological advancement. We invest in ongoing training and R&D to deliver the best solutions.',
    },
  ];

  const team = [
    {
      name: 'Amit Kumar',
      role: 'Founder and CEO',
      bio: 'As Founder and CEO, Amit leads XSAV Lab\'s vision and strategic direction, helping organizations strengthen cybersecurity posture while accelerating secure digital transformation.',
      imageSet: {
        webp: amitKumarImgWebp,
      },
      linkedin: 'https://www.linkedin.com/in/amit-kumar-03084a19/',
      email: 'amit.tiwary@xsavlab.com',
    },
    {
      name: 'Shiv Aryan',
      role: 'Business Director',
      bio: 'Shiv leads business strategy, partnerships, and client success at XSAV Lab, aligning technology solutions with measurable business outcomes and long-term growth goals.',
      imageSet: {
        webp: shivAryanImgWebp,
      },
      linkedin: 'https://linkedin.com',
      email: 'sarah@xsavlab.com',
    },
    {
      name: 'Sumit Kumar',
      role: 'CTO',
      bio: 'As CTO, Sumit architects secure, scalable platforms and drives innovation across cloud, AI, and cybersecurity initiatives to deliver enterprise-grade performance.',
      imageSet: {
        webp: sumitKumarImgWebp,
      },
      linkedin: 'https://www.linkedin.com/in/sumit-tiwary-38343b202/',
      email: 'michael@xsavlab.com',
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
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">About Us</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Securing The Digital Future With
              <span className="text-primary"> Expert Solutions</span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              XSAV Lab is a leading technology and cybersecurity firm dedicated to protecting businesses and building innovative digital solutions. Founded with a mission to make enterprise-grade security and software accessible to organizations of all sizes.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 md:p-12"
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
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-xl p-8"
            >
              <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg w-fit mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                To empower organizations with world-class security and technology solutions that protect their assets, 
                accelerate growth, and enable digital transformation. We believe every business deserves enterprise-grade 
                protection and innovation, regardless of size or industry.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-xl p-8"
            >
              <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg w-fit mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                To be the trusted global partner for organizations seeking to navigate the complexities of cybersecurity 
                and digital innovation. We envision a future where businesses operate securely and efficiently, leveraging 
                cutting-edge technology to achieve their goals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
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
              Our <span className="text-primary">Core Values</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
              >
                <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg w-fit mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TechnologyPartners />
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our <span className="text-primary">Leadership Team</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Industry experts committed to delivering exceptional security and technology solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <TeamMember key={member.name} {...member} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
