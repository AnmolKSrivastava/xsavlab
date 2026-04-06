import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2, 
  TrendingUp,
  Eye,
  ExternalLink
} from 'lucide-react';

const FeaturedVentures = () => {
  const navigate = useNavigate();
  const [ventures, setVentures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentures = async () => {
      try {
        const response = await fetch('https://getventures-w2qxlsui7a-uc.a.run.app');
        
        if (!response.ok) {
          throw new Error('Failed to fetch ventures');
        }

        const data = await response.json();
        // Get first 3 ventures
        setVentures((data.ventures || []).slice(0, 3));
      } catch (error) {
        console.error('Error fetching ventures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVentures();
  }, []);

  if (loading) {
    return (
      <section id="featured-ventures" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-ventures" className="py-24 relative">
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
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Our Ventures
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Explore Our <span className="text-primary">Ventures</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our portfolio of innovative business ventures across various industries
          </p>
        </motion.div>

        {/* Empty State or Ventures Grid */}
        {ventures.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 max-w-2xl mx-auto">
              <Building2 className="w-20 h-20 text-primary/50 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                New Ventures Launching Soon!
              </h3>
              <p className="text-gray-400 text-lg mb-6">
                We're building innovative solutions across multiple industries. Stay tuned for exciting announcements about our upcoming ventures!
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4" />
                <span>Watch this space for updates</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Ventures Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
          {ventures.map((venture, index) => (
            <motion.div
              key={venture.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => window.open(venture.websiteUrl, '_blank')}
              className="cursor-pointer bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-300 group"
            >
              {/* Logo/Image */}
              {venture.logoUrl && (
                <div className="h-48 bg-gray-800/50 flex items-center justify-center p-8">
                  <img 
                    src={venture.logoUrl} 
                    alt={venture.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Category Badge */}
                <span className="inline-block bg-primary/20 border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  {venture.category}
                </span>

                {/* Name */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {venture.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {venture.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {venture.views > 0 && (
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{venture.views}</span>
                      </span>
                    )}
                    {venture.status === 'active' && (
                      <span className="flex items-center space-x-1 text-green-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/ventures')}
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all"
          >
            <span>View All Ventures</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
        </>
        )}
      </div>
    </section>
  );
};

export default FeaturedVentures;
