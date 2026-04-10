import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  FileText, 
  Calendar,
  User,
  Tag,
  Clock,
  Eye
} from 'lucide-react';

const LatestBlogPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getBlogPosts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        // Get first 3 published posts
        setPosts((data.posts || []).slice(0, 3));
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate reading time
  const calculateReadingTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  if (loading) {
    return (
      <section id="latest-blog" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="latest-blog" className="py-24 relative">
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
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Latest Insights
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            From Our <span className="text-primary">Blog</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest trends, insights, and news in cybersecurity and technology
          </p>
        </motion.div>

        {/* Empty State or Blog Posts Grid */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 max-w-2xl mx-auto">
              <FileText className="w-20 h-20 text-primary/50 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Exciting Content Coming Soon!
              </h3>
              <p className="text-gray-400 text-lg mb-6">
                We're preparing insightful articles and updates on cybersecurity, cloud infrastructure, and technology trends. Check back soon!
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>New posts will be published regularly</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="cursor-pointer bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-300 group"
            >
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center space-x-1 bg-primary/20 border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                    <Tag className="w-3 h-3" />
                    <span>{post.category}</span>
                  </span>
                  {post.views > 0 && (
                    <span className="flex items-center space-x-1 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      <span>{post.views}</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex flex-col space-y-1 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author?.name || 'XSAV Lab'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </span>
                  </div>
                  <span className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{calculateReadingTime(post.content)} min</span>
                  </span>
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
            onClick={() => navigate('/blog')}
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-dark-navy px-8 py-4 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all"
          >
            <span>View All Posts</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default LatestBlogPosts;

