import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Edit, Trash2, Save } from 'lucide-react';
import { auth } from '../../../config/firebase';

const ReviewsTab = ({ user, userRole, reviews, setReviews, reviewsLoading, setReviewsLoading }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingReview, setEditingReview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    clientCompany: '',
    content: '',
    rating: 5,
    status: 'approved',
    featured: false,
    order: 0,
  });

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getReviews', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setMessage({ type: 'error', text: 'Failed to load reviews' });
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/approveReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to approve review');

      setMessage({ type: 'success', text: 'Review approved successfully!' });
      fetchReviews();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleReject = async (reviewId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/updateReview', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewId,
          updates: { status: 'rejected' },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to reject review');

      setMessage({ type: 'success', text: 'Review rejected' });
      fetchReviews();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleEdit = (review) => {
    setFormData({
      clientName: review.clientName || '',
      clientRole: review.clientRole || '',
      clientCompany: review.clientCompany || '',
      content: review.content || '',
      rating: review.rating || 5,
      status: review.status || 'approved',
      featured: review.featured || false,
      order: review.order || 0,
    });
    setEditingReview(review);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/updateReview', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewId: editingReview.id,
          updates: formData,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update review');

      setMessage({ type: 'success', text: 'Review updated successfully!' });
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDelete = async (reviewId, clientName) => {
    if (!window.confirm(`Are you sure you want to delete the review from "${clientName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/deleteReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete review');

      setMessage({ type: 'success', text: 'Review deleted successfully!' });
      fetchReviews();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (activeFilter === 'all') return true;
    return review.status === activeFilter;
  });

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const rejectedReviews = reviews.filter(r => r.status === 'rejected');

  const canDeleteReviews = userRole === 'superadmin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Client Reviews</h3>
          <p className="text-sm text-gray-400">Moderate and manage client-submitted reviews</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              activeFilter === 'all' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              activeFilter === 'pending' ? 'bg-yellow-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending ({pendingReviews.length})
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              activeFilter === 'approved' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Approved ({approvedReviews.length})
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              activeFilter === 'rejected' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Rejected ({rejectedReviews.length})
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {editingReview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4">Edit Review</h4>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Client Name *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <input
                  type="text"
                  value={formData.clientRole}
                  onChange={(e) => setFormData({...formData, clientRole: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.clientCompany}
                  onChange={(e) => setFormData({...formData, clientCompany: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Review Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                rows="4"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rating *</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  min="0"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="w-4 h-4 text-primary bg-gray-900 border-gray-700 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-300">Featured</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Update Review
              </button>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {reviewsLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No {activeFilter !== 'all' ? activeFilter : ''} reviews</p>
            <p className="text-sm text-gray-500">Client reviews will appear here once submitted</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-gray-800/50 border rounded-lg p-6 hover:border-gray-600 transition-colors ${
                review.status === 'pending' ? 'border-yellow-500/30' :
                review.status === 'approved' ? 'border-green-500/30' :
                'border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{review.clientName}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadgeColor(review.status)}`}>
                      {review.status === 'pending' && '⏳ Pending'}
                      {review.status === 'approved' && '✅ Approved'}
                      {review.status === 'rejected' && '❌ Rejected'}
                    </span>
                    {review.featured && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        ⭐ Featured
                      </span>
                    )}
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  {(review.clientRole || review.clientCompany) && (
                    <p className="text-sm text-gray-400">
                      {review.clientRole}{review.clientRole && review.clientCompany && ' at '}{review.clientCompany}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleEdit(review)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {canDeleteReviews && (
                    <button
                      onClick={() => handleDelete(review.id, review.clientName)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 mb-3">
                <p className="text-gray-300 italic">"{review.content}"</p>
              </div>

              <div className="text-xs text-gray-500 flex justify-between">
                <span>Submitted by: {review.submittedByEmail ||'N/A'}</span>
                {review.approvedByEmail && <span>Approved by: {review.approvedByEmail}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsTab;
