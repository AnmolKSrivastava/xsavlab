import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, Award } from 'lucide-react';
import { auth } from '../../../config/firebase';

const SuccessStoriesTab = ({ user, userRole, successStories, setSuccessStories, successStoriesLoading, setSuccessStoriesLoading }) => {
  const [showAddStory, setShowAddStory] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    company: '',
    industry: '',
    challenge: '',
    solution: '',
    results: [
      { label: '', value: '', suffix: '' },
      { label: '', value: '', suffix: '' },
      { label: '', value: '', suffix: '' },
    ],
    clientName: '',
    clientRole: '',
    clientCompany: '',
    testimonial: '',
    status: 'draft',
    order: 1,
    featured: false,
  });

  useEffect(() => {
    fetchSuccessStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSuccessStories = async () => {
    setSuccessStoriesLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getSuccessStories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch success stories');
      }

      const data = await response.json();
      setSuccessStories(data.stories || []);
    } catch (error) {
      console.error('Error fetching success stories:', error);
      setMessage({ type: 'error', text: 'Failed to load success stories' });
    } finally {
      setSuccessStoriesLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      industry: '',
      challenge: '',
      solution: '',
      results: [
        { label: '', value: '', suffix: '' },
        { label: '', value: '', suffix: '' },
        { label: '', value: '', suffix: '' },
      ],
      clientName: '',
      clientRole: '',
      clientCompany: '',
      testimonial: '',
      status: 'draft',
      order: 1,
      featured: false,
    });
    setEditingStory(null);
    setShowAddStory(false);
  };

  const handleEdit = (story) => {
    setFormData({
      company: story.company || '',
      industry: story.industry || '',
      challenge: story.challenge || '',
      solution: story.solution || '',
      results: story.results && story.results.length > 0 ? story.results : [
        { label: '', value: '', suffix: '' },
        { label: '', value: '', suffix: '' },
        { label: '', value: '', suffix: '' },
      ],
      clientName: story.clientName || '',
      clientRole: story.clientRole || '',
      clientCompany: story.clientCompany || '',
      testimonial: story.testimonial || '',
      status: story.status || 'draft',
      order: story.order || 1,
      featured: story.featured || false,
    });
    setEditingStory(story);
    setShowAddStory(true);
  };

  const handleResultChange = (index, field, value) => {
    const newResults = [...formData.results];
    newResults[index][field] = value;
    setFormData({ ...formData, results: newResults });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const token = await auth.currentUser.getIdToken();
      
      if (editingStory) {
        const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/updateSuccessStory', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            storyId: editingStory.id,
            updates: formData,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to update success story');
        
        setMessage({ type: 'success', text: 'Success story updated!' });
      } else {
        const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/createSuccessStory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create success story');
        
        setMessage({ type: 'success', text: 'Success story created!' });
      }

      resetForm();
      fetchSuccessStories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDelete = async (storyId, companyName) => {
    if (!window.confirm(`Are you sure you want to delete "${companyName}" success story? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/deleteSuccessStory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ storyId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete success story');

      setMessage({ type: 'success', text: `"${companyName}" success story deleted!` });
      fetchSuccessStories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const canCreateStories = userRole === 'admin' || userRole === 'superadmin';
  const canDeleteStories = userRole === 'superadmin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Success Stories</h3>
          <p className="text-sm text-gray-400">Manage client success stories and testimonials</p>
        </div>
        {canCreateStories && (
          <button
            onClick={() => {
              resetForm();
              setShowAddStory(!showAddStory);
            }}
            className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Success Story
          </button>
        )}
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

      {showAddStory && canCreateStories && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4">
            {editingStory ? 'Edit Success Story' : 'Add New Success Story'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Acme Corporation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Industry *</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Finance & Banking"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Challenge *</label>
              <textarea
                value={formData.challenge}
                onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                required
                rows="3"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                placeholder="Describe the client's main challenges..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Solution *</label>
              <textarea
                value={formData.solution}
                onChange={(e) => setFormData({...formData, solution: e.target.value})}
                required
                rows="3"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                placeholder="Describe the solution provided..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Results & Metrics</label>
              <div className="space-y-3">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={formData.results[index].label}
                      onChange={(e) => handleResultChange(index, 'label', e.target.value)}
                      className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                      placeholder="Metric label"
                    />
                    <input
                      type="text"
                      value={formData.results[index].value}
                      onChange={(e) => handleResultChange(index, 'value', e.target.value)}
                      className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                      placeholder="Value (e.g., 50)"
                    />
                    <input
                      type="text"
                      value={formData.results[index].suffix}
                      onChange={(e) => handleResultChange(index, 'suffix', e.target.value)}
                      className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                      placeholder="Suffix (e.g., %)"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h5 className="text-md font-semibold text-white mb-3">Client Testimonial</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Client Role</label>
                  <input
                    type="text"
                    value={formData.clientRole}
                    onChange={(e) => setFormData({...formData, clientRole: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    placeholder="CTO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.clientCompany}
                    onChange={(e) => setFormData({...formData, clientCompany: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    placeholder="Acme Corp"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Testimonial / Remarks</label>
                <textarea
                  value={formData.testimonial}
                  onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Client's feedback and remarks..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-700 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="live">Live (Published)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
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
                  <span className="text-sm text-gray-300">Featured Story</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingStory ? 'Update Success Story' : 'Create Success Story'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {successStoriesLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading success stories...</p>
          </div>
        ) : successStories.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
            <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No success stories yet</p>
            <p className="text-sm text-gray-500">Create your first success story to showcase client achievements</p>
          </div>
        ) : (
          successStories.map((story) => (
            <div
              key={story.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{story.company}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadgeColor(story.status)}`}>
                      {story.status === 'live' ? '🟢 Live' : '🟡 Draft'}
                    </span>
                    {story.featured && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        ⭐ Featured
                      </span>
                    )}
                    <span className="text-xs text-gray-500">Order: {story.order}</span>
                  </div>
                  <p className="text-sm text-gray-400">{story.industry}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(story)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {canDeleteStories && (
                    <button
                      onClick={() => handleDelete(story.id, story.company)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-400 mb-1">Challenge:</h5>
                  <p className="text-sm text-gray-300">{story.challenge}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-400 mb-1">Solution:</h5>
                  <p className="text-sm text-gray-300">{story.solution}</p>
                </div>
              </div>

              {story.results && story.results.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4 pt-3 border-t border-gray-700">
                  {story.results.filter(r => r.label && r.value).map((result, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {result.value}{result.suffix}
                      </div>
                      <div className="text-xs text-gray-400">{result.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {story.testimonial && (
                <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-primary">
                  <p className="text-sm text-gray-300 italic mb-2">"{story.testimonial}"</p>
                  {(story.clientName || story.clientRole) && (
                    <p className="text-xs text-gray-500">
                      — {story.clientName}{story.clientRole && `, ${story.clientRole}`}
                      {story.clientCompany && ` at ${story.clientCompany}`}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SuccessStoriesTab;
