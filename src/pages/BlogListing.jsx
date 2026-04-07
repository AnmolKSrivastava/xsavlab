import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight,
  Filter,
  Search,
  Eye,
  Star
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const BlogListing = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const categories = ['all', 'Industry News', 'Case Studies', 'Security Alerts', 'Company Updates'];

  // Fetch published blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getBlogPosts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory;
    const searchMatch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });

  // Separate featured posts
  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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

  // Calculate reading time (approximate)
  const calculateReadingTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  // Blog post card component
  const BlogCard = ({ post, featured = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/blog/${post.slug}`)}
      className={`cursor-pointer bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-300 ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      {post.featuredImage && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {featured && (
            <div className="absolute top-4 right-4 bg-yellow-500/90 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <Star className="w-3 h-3 fill-current" />
              <span>Featured</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent"></div>
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
        <h3 className={`font-bold text-white mb-3 hover:text-primary transition-colors ${
          featured ? 'text-2xl' : 'text-xl'
        }`}>
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
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{post.author?.name || 'XSAV Lab'}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </span>
            <span>{calculateReadingTime(post.content)} min read</span>
          </div>
          
          <ArrowRight className="w-4 h-4 text-primary" />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-dark-navy text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-6"
            >
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Our Blog
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Insights & <span className="text-primary">Updates</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay informed with the latest in cybersecurity, cloud infrastructure, and technology trends
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 text-white pl-10 pr-8 py-3 rounded-lg focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="pb-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No blog posts found</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span>Featured Posts</span>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredPosts.map(post => (
                      <BlogCard key={post.id} post={post} featured={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Posts */}
              {regularPosts.length > 0 && (
                <div>
                  {featuredPosts.length > 0 && (
                    <h2 className="text-2xl font-bold text-white mb-6">
                      All Posts
                    </h2>
                  )}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularPosts.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results Count */}
          {!loading && !error && filteredPosts.length > 0 && (
            <div className="text-center mt-12 text-gray-500 text-sm">
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogListing;
