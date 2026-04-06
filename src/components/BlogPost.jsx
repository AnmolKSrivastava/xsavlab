import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Tag, 
  ArrowLeft,
  Clock,
  Eye,
  Share2,
  CheckCircle
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch blog post
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://us-central1-xsavlab.cloudfunctions.net/getBlogPost?slug=${slug}`
        );
        
        if (!response.ok) {
          throw new Error('Blog post not found');
        }

        const data = await response.json();
        setPost(data.post);

        // Fetch related posts (same category)
        if (data.post.category) {
          try {
            const relatedResponse = await fetch(
              `https://us-central1-xsavlab.cloudfunctions.net/getBlogPosts?category=${encodeURIComponent(data.post.category)}`
            );
            const relatedData = await relatedResponse.json();
            // Filter out current post and limit to 3
            const filtered = (relatedData.posts || [])
              .filter(p => p.id !== data.post.id)
              .slice(0, 3);
            setRelatedPosts(filtered);
          } catch (err) {
            console.error('Error fetching related posts:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
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

  // Share functionality
  const handleShare = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt || post.title,
        url: url
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-dark-navy text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-8">{error || 'The blog post you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-navy text-white">
      <Navbar />

      {/* Hero Section with Featured Image */}
      <section className="pt-32 pb-8 relative overflow-hidden">
        {post.featuredImage && (
          <div className="absolute inset-0 z-0">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-navy via-dark-navy/95 to-dark-navy"></div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/blog')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </motion.button>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-flex items-center space-x-1 bg-primary/20 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              <Tag className="w-4 h-4" />
              <span>{post.category}</span>
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-300 mb-8"
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 text-sm text-gray-400 pb-8 border-b border-gray-700/50"
          >
            <span className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{post.author?.name || 'XSAV Lab'}</span>
            </span>
            <span className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </span>
            <span className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{calculateReadingTime(post.content)} min read</span>
            </span>
            {post.views > 0 && (
              <span className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>{post.views} views</span>
              </span>
            )}
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 ml-auto text-primary hover:text-primary/80 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <div 
              className="text-gray-300 leading-relaxed whitespace-pre-line"
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.75rem'
              }}
            >
              {post.content}
            </div>
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 pt-8 border-t border-gray-700/50"
            >
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-gray-800/50 border border-gray-700/50 text-gray-400 text-sm rounded-lg hover:border-primary/50 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Author Info */}
          {post.author && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {post.author.name || 'XSAV Lab Team'}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {post.author.email || 'Cybersecurity & Cloud Expert'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 border-t border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">
              Related Posts
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                  className="cursor-pointer bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-primary/50 rounded-xl p-6 transition-all duration-300"
                >
                  <span className="inline-flex items-center space-x-1 bg-primary/20 border border-primary/30 text-primary px-2 py-1 rounded-full text-xs font-semibold mb-3">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {relatedPost.title}
                  </h3>
                  {relatedPost.excerpt && (
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {relatedPost.excerpt}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(relatedPost.publishedAt || relatedPost.createdAt)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPost;
