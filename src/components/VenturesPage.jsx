import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  ExternalLink, 
  ArrowRight, 
  Package,
  TrendingUp,
  Users,
  Globe,
  Sparkles
} from 'lucide-react';
import QuantumBackground from './QuantumBackground';

const VentureCard = ({ venture, index }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'saas':
        return 'from-blue-500 to-blue-600';
      case 'ecommerce':
        return 'from-green-500 to-green-600';
      case 'mobile-app':
        return 'from-purple-500 to-purple-600';
      case 'web-platform':
        return 'from-orange-500 to-orange-600';
      case 'custom-solution':
        return 'from-pink-500 to-pink-600';
      default:
        return 'from-primary to-blue-600';
    }
  };

  const handleVisit = async () => {
    // Track click
    try {
      await fetch('https://us-central1-xsavlab.cloudfunctions.net/trackVentureClick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ventureId: venture.id }),
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    // Open website
    if (venture.website) {
      window.open(venture.website, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-300"
    >
      {/* Featured Image */}
      {venture.featuredImage && (
        <div className="relative h-48 overflow-hidden bg-gray-900">
          <img
            src={venture.featuredImage}
            alt={venture.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
          {venture.featured && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featured
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(venture.category)} text-white text-xs font-semibold rounded-full`}>
            {venture.category?.replace('-', ' ')}
          </span>
          {venture.industry && (
            <span className="text-xs text-gray-500">• {venture.industry}</span>
          )}
        </div>

        {/* Logo & Name */}
        <div className="flex items-start gap-3 mb-3">
          {venture.logo && (
            <img
              src={venture.logo}
              alt={`${venture.name} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
              {venture.name}
            </h3>
            {venture.tagline && (
              <p className="text-sm text-gray-400">{venture.tagline}</p>
            )}
          </div>
        </div>

        {/* Description */}
        {venture.shortDescription && (
          <p className="text-gray-300 mb-4 line-clamp-2">
            {venture.shortDescription}
          </p>
        )}

        {/* CTA Button */}
        <motion.button
          onClick={handleVisit}
          whileHover={{ x: 5 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-all group/btn"
        >
          <Globe className="w-4 h-4" />
          <span>Visit {venture.name}</span>
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const VenturesPage = () => {
  const [ventures, setVentures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { category } = useParams();

  useEffect(() => {
    fetchVentures();
  }, []);

  useEffect(() => {
    if (category) {
      setFilter(category);
    }
  }, [category]);

  const fetchVentures = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getVentures');
      
      if (!response.ok) {
        throw new Error('Failed to fetch ventures');
      }

      const data = await response.json();
      setVentures(data.ventures || []);
    } catch (error) {
      console.error('Error fetching ventures:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVentures = filter === 'all' 
    ? ventures 
    : ventures.filter(v => v.category === filter);

  const categories = [
    { id: 'all', name: 'All Ventures', icon: Package },
    { id: 'saas', name: 'SaaS', icon: TrendingUp },
    { id: 'ecommerce', name: 'E-Commerce', icon: Package },
    { id: 'mobile-app', name: 'Mobile Apps', icon: Users },
    { id: 'web-platform', name: 'Web Platforms', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-dark-navy text-white relative overflow-hidden">
      <QuantumBackground />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-4"
            >
              <div className="bg-primary/10 border border-primary/30 px-4 py-2 rounded-full text-primary font-semibold text-sm flex items-center gap-2">
                <Package className="w-4 h-4" />
                Our Ventures & Products
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Building Innovative Solutions
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We don't just build for clients — we build our own successful products. 
              Explore our portfolio of ventures across different industries.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setFilter(cat.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    filter === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </motion.button>
              );
            })}
          </div>

          {/* Ventures Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-400">Loading our ventures...</p>
            </div>
          ) : filteredVentures.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                {filter === 'all' ? 'No Ventures Yet' : 'No Ventures in This Category'}
              </h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? 'Check back soon for exciting new ventures!' 
                  : 'Try selecting a different category.'}
              </p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="text-center mb-8">
                <p className="text-gray-400">
                  Showing <span className="text-primary font-semibold">{filteredVentures.length}</span> {filteredVentures.length === 1 ? 'venture' : 'ventures'}
                </p>
              </div>

              {/* Ventures Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVentures.map((venture, index) => (
                  <VentureCard key={venture.id} venture={venture} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Have an Idea? Let's Build It Together
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Our track record speaks for itself. From concept to launch, we can help you build the next big thing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/#contact'}
                className="px-8 py-4 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/#services'}
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
              >
                View Our Services
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VenturesPage;
