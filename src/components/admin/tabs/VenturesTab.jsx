import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Globe, Eye, TrendingUp, Package } from 'lucide-react';
import { auth } from '../../../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const VenturesTab = ({ user, userRole, ventures, setVentures, venturesLoading, setVenturesLoading }) => {
  const [showAddVenture, setShowAddVenture] = useState(false);
  const [editingVenture, setEditingVenture] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    category: 'saas',
    industry: '',
    shortDescription: '',
    fullDescription: '',
    logo: '',
    featuredImage: '',
    website: '',
    status: 'live',
    featured: false,
    order: 1,
  });

  // Fetch ventures
  useEffect(() => {
    fetchVentures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVentures = async () => {
    setVenturesLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getVentures', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ventures');
      }

      const data = await response.json();
      setVentures(data.ventures || []);
    } catch (error) {
      console.error('Error fetching ventures:', error);
      setMessage({ type: 'error', text: 'Failed to load ventures' });
    } finally {
      setVenturesLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      category: 'saas',
      industry: '',
      shortDescription: '',
      fullDescription: '',
      logo: '',
      featuredImage: '',
      website: '',
      status: 'live',
      featured: false,
      order: 1,
    });
    setEditingVenture(null);
    setShowAddVenture(false);
  };

  const handleEdit = (venture) => {
    setFormData({
      name: venture.name || '',
      slug: venture.slug || '',
      tagline: venture.tagline || '',
      category: venture.category || 'saas',
      industry: venture.industry || '',
      shortDescription: venture.shortDescription || '',
      fullDescription: venture.fullDescription || venture.description || '',
      logo: venture.logo || venture.logoUrl || '',
      featuredImage: venture.featuredImage || venture.featuredImageUrl || '',
      website: venture.website || venture.websiteUrl || '',
      status: venture.status || 'live',
      featured: venture.featured || false,
      order: venture.order || 1,
    });
    setEditingVenture(venture);
    setShowAddVenture(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const token = await auth.currentUser.getIdToken();
      const payload = {
        name: formData.name,
        slug: formData.slug,
        tagline: formData.tagline,
        category: formData.category,
        description: formData.fullDescription || formData.shortDescription,
        status: formData.status,
        featured: formData.featured,
        order: formData.order,
        logoUrl: formData.logo,
        featuredImageUrl: formData.featuredImage,
        websiteUrl: formData.website,
      };
      
      if (editingVenture) {
        // Update existing venture
        const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/updateVenture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ventureId: editingVenture.id,
            ...payload,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to update venture');
        
        setMessage({ type: 'success', text: 'Venture updated successfully!' });
      } else {
        // Create new venture
        const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/createVenture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create venture');
        
        setMessage({ type: 'success', text: 'Venture created successfully!' });
      }

      resetForm();
      fetchVentures();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDelete = async (ventureId, ventureName) => {
    if (!window.confirm(`Are you sure you want to delete "${ventureName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/deleteVenture', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ventureId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete venture');

      setMessage({ type: 'success', text: `"${ventureName}" deleted successfully!` });
      fetchVentures();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleImageUpload = async (file, targetField) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload a valid image file.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be under 5MB.' });
      return;
    }

    const setUploading = targetField === 'logo' ? setUploadingLogo : setUploadingFeaturedImage;
    try {
      setUploading(true);
      const storage = getStorage();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `ventureImages/${targetField}/${Date.now()}_${safeName}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, [targetField]: downloadUrl }));
      setMessage({ type: 'success', text: `${targetField === 'logo' ? 'Logo' : 'Featured image'} uploaded successfully.` });
    } catch (uploadError) {
      console.error('Venture image upload failed:', uploadError);
      setMessage({ type: 'error', text: 'Image upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'saas':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ecommerce':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'mobile-app':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'web-platform':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'custom-solution':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-development':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'coming-soon':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'archived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Check permissions
  const canCreateVentures = userRole === 'admin' || userRole === 'superadmin';
  const canDeleteVentures = userRole === 'superadmin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Our Ventures</h3>
          <p className="text-sm text-gray-400">
            Manage your products and business ventures
          </p>
        </div>
        {canCreateVentures && (
          <button
            onClick={() => {
              resetForm();
              setShowAddVenture(!showAddVenture);
            }}
            className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Venture
          </button>
        )}
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Add/Edit Venture Form */}
      {showAddVenture && canCreateVentures && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4">
            {editingVenture ? 'Edit Venture' : 'Add New Venture'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venture Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="TheWedHaven"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="thewedhaven"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                placeholder="Making Wedding Planning Effortless"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  <option value="saas">SaaS Platform</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="mobile-app">Mobile App</option>
                  <option value="web-platform">Web Platform</option>
                  <option value="custom-solution">Custom Solution</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Wedding Planning"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  <option value="live">Live</option>
                  <option value="in-development">In Development</option>
                  <option value="coming-soon">Coming Soon</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Short Description
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                rows={2}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                placeholder="Brief one-liner about the venture"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Description
              </label>
              <textarea
                value={formData.fullDescription}
                onChange={(e) => setFormData({...formData, fullDescription: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                placeholder="Detailed description of the venture, its features, and benefits"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({...formData, logo: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="https://..."
                />
                <div className="mt-2 flex items-center gap-3">
                  <label className="inline-flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files?.[0], 'logo')}
                    />
                    Upload Logo
                  </label>
                  {uploadingLogo && <span className="text-xs text-gray-400">Uploading...</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="https://..."
                />
                <div className="mt-2 flex items-center gap-3">
                  <label className="inline-flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files?.[0], 'featuredImage')}
                    />
                    Upload Featured Image
                  </label>
                  {uploadingFeaturedImage && <span className="text-xs text-gray-400">Uploading...</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="https://thewedhaven.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 1})}
                  min="1"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary"
              />
              <label htmlFor="featured" className="text-sm text-gray-300">
                Feature on homepage
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors"
              >
                {editingVenture ? 'Update Venture' : 'Create Venture'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Ventures List */}
      {venturesLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading ventures...</p>
        </div>
      ) : ventures.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Ventures Yet</h3>
          <p className="text-gray-400 mb-6">
            {canCreateVentures ? 'Start by adding your first venture!' : 'No ventures to display.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ventures.map((venture) => (
            <div
              key={venture.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-primary/50 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-white">{venture.name}</h4>
                    {venture.featured && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        Featured
                      </span>
                    )}
                  </div>
                  {venture.tagline && (
                    <p className="text-sm text-gray-400 mb-3">{venture.tagline}</p>
                  )}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getCategoryBadgeColor(venture.category)}`}>
                      {venture.category?.replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadgeColor(venture.status)}`}>
                      {venture.status?.replace('-', ' ')}
                    </span>
                    {venture.industry && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-300">
                        {venture.industry}
                      </span>
                    )}
                  </div>
                  {venture.shortDescription && (
                    <p className="text-sm text-gray-300 mb-3">{venture.shortDescription}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {venture.views !== undefined && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {venture.views} views
                      </span>
                    )}
                    {venture.clicks !== undefined && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {venture.clicks} clicks
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-700">
                {(venture.website || venture.websiteUrl) && (
                  <a
                    href={venture.website || venture.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Site
                  </a>
                )}
                {canCreateVentures && (
                  <button
                    onClick={() => handleEdit(venture)}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                    title="Edit venture"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
                {canDeleteVentures && (
                  <button
                    onClick={() => handleDelete(venture.id, venture.name)}
                    className="px-3 py-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                    title="Delete venture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenturesTab;
