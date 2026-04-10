import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Send, ThumbsUp, ThumbsDown, Filter, FileText, Eye, CheckCircle, AlertCircle } from 'lucide-react';

const BlogTab = ({ user, userRole, blogPosts, setBlogPosts, blogPostsLoading, setBlogPostsLoading }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Industry News',
    tags: '',
    featuredImage: '',
    featured: false
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const categories = ['Industry News', 'Case Studies', 'Security Alerts', 'Company Updates'];

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    
    setBlogPostsLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getBlogPosts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch blog posts');

      const data = await response.json();
      setBlogPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts');
    } finally {
      setBlogPostsLoading(false);
    }
  }, [user, setBlogPostsLoading, setBlogPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const endpoint = editingPost 
        ? 'https://us-central1-xsavlab.cloudfunctions.net/updateBlogPost'
        : 'https://us-central1-xsavlab.cloudfunctions.net/createBlogPost';

      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editingPost) {
        payload.postId = editingPost.id;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save blog post');
      }

      setSuccess(editingPost ? 'Blog post updated successfully!' : 'Blog post created successfully!');
      setIsCreating(false);
      setEditingPost(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'Industry News',
        tags: '',
        featuredImage: '',
        featured: false
      });
      fetchPosts();

      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSubmitForApproval = async (postId) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/submitBlogPostForApproval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId })
      });

      if (!response.ok) throw new Error('Failed to submit for approval');

      setSuccess('Post submitted for approval!');
      fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleApprove = async (postId) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/approveBlogPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId })
      });

      if (!response.ok) throw new Error('Failed to approve post');

      setSuccess('Post approved and published!');
      fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleReject = async (postId, feedback = '') => {
    try {
      const token = await user.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/rejectBlogPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId, feedback })
      });

      if (!response.ok) throw new Error('Failed to reject post');

      setSuccess('Post rejected and returned to draft');
      fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/deleteBlogPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId })
      });

      if (!response.ok) throw new Error('Failed to delete post');

      setSuccess('Post deleted successfully');
      fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      featuredImage: post.featuredImage || '',
      featured: post.featured || false
    });
    setIsCreating(true);
  };

  const filteredPosts = blogPosts.filter(post => {
    const statusMatch = filterStatus === 'all' || post.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || post.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  const statusCounts = {
    all: blogPosts.length,
    draft: blogPosts.filter(p => p.status === 'draft').length,
    pending: blogPosts.filter(p => p.status === 'pending').length,
    published: blogPosts.filter(p => p.status === 'published').length
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      published: 'bg-green-500/20 text-green-400 border-green-500/30'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[status] || colors.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Blog Management</h3>
          <p className="text-sm text-gray-400">Create and manage blog posts</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(!isCreating);
            setEditingPost(null);
            setFormData({
              title: '',
              excerpt: '',
              content: '',
              category: 'Industry News',
              tags: '',
              featuredImage: '',
              featured: false
            });
          }}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-dark-navy px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancel' : 'New Post'}</span>
        </button>
      </div>

      {success && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
          <h4 className="text-lg font-semibold text-white">
            {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h4>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="cybersecurity, cloud, devops"
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Featured Image URL</label>
              <input
                type="text"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Brief summary of the post..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
                placeholder="Write your blog post content..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-300">Feature this post</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={submitLoading}
              className="bg-primary hover:bg-primary/90 text-dark-navy px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitLoading ? 'Saving...' : (editingPost ? 'Update Post' : 'Save as Draft')}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingPost(null);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {['all', 'draft', 'pending', 'published'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === status
                ? 'bg-primary text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-gray-800/50 border border-gray-700 text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:border-primary"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {blogPostsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No blog posts found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{post.title}</h4>
                    <StatusBadge status={post.status} />
                    {post.featured && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{post.excerpt || 'No excerpt'}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span className="font-medium">{post.category}</span>
                    </span>
                    <span>By {post.author?.name || 'Unknown'}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    {post.views > 0 && (
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.views} views</span>
                      </span>
                    )}
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-700/50 text-gray-400 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {post.status === 'draft' && post.author?.uid === user.uid && (
                    <button
                      onClick={() => handleSubmitForApproval(post.id)}
                      className="flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300"
                      title="Submit for approval"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit</span>
                    </button>
                  )}

                  {post.status === 'pending' && (userRole === 'admin' || userRole === 'superadmin') && (
                    <>
                      <button
                        onClick={() => handleApprove(post.id)}
                        className="flex items-center space-x-1 text-sm text-green-400 hover:text-green-300"
                        title="Approve post"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(post.id)}
                        className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300"
                        title="Reject post"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {(post.author?.uid === user.uid || userRole === 'admin') && (
                    <>
                      <button
                        onClick={() => handleEdit(post)}
                        className="flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300"
                        title="Edit post"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      {userRole === 'admin' && (
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {post.rejectionFeedback && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400">
                  <strong>Rejection Feedback:</strong> {post.rejectionFeedback}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogTab;

