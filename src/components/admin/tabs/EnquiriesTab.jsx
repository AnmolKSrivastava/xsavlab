import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Mail, Clock, Circle, Check, Eye, X } from 'lucide-react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import app from '../../../config/firebase';

const EnquiriesTab = ({ enquiries, loading }) => {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getServiceBadgeColor = (service) => {
    const colors = {
      cybersecurity: 'bg-red-500/20 text-red-400 border-red-500/30',
      cloud: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      ai: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      website: 'bg-green-500/20 text-green-400 border-green-500/30',
      software: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      consulting: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[service] || colors.consulting;
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      new: 'bg-red-500/20 text-red-400 border-red-500/30',
      'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      replied: 'bg-green-500/20 text-green-400 border-green-500/30',
      closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[status] || colors.new;
  };

  const formatServiceName = (service) => {
    const names = {
      cybersecurity: 'Cybersecurity',
      cloud: 'Cloud Infrastructure',
      ai: 'AI Integration',
      website: 'Website Development',
      software: 'Software Solutions',
      consulting: 'Consulting',
    };
    return names[service] || service;
  };

  const formatStatusName = (status) => {
    const names = {
      new: 'New',
      'in-progress': 'In Progress',
      replied: 'Replied',
      closed: 'Closed',
    };
    return names[status] || 'New';
  };

  // Update enquiry status in Firestore
  const updateEnquiryStatus = async (enquiryId, newStatus) => {
    try {
      const db = getFirestore(app);
      const enquiryRef = doc(db, 'enquiries', enquiryId);
      await updateDoc(enquiryRef, {
        status: newStatus,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  // Toggle read/unread status
  const toggleReadStatus = async (enquiryId, currentStatus) => {
    try {
      const db = getFirestore(app);
      const enquiryRef = doc(db, 'enquiries', enquiryId);
      await updateDoc(enquiryRef, {
        isRead: !currentStatus,
        readAt: currentStatus ? null : new Date(),
      });
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };

  // Filter and search enquiries
  const filteredEnquiries = enquiries.filter((enquiry) => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchLower) ||
      enquiry.email.toLowerCase().includes(searchLower) ||
      (enquiry.company && enquiry.company.toLowerCase().includes(searchLower)) ||
      enquiry.message.toLowerCase().includes(searchLower);

    // Status filter
    const matchesStatus =
      filterStatus === 'all' || enquiry.status === filterStatus;

    // Service filter
    const matchesService =
      filterService === 'all' || enquiry.service === filterService;

    return matchesSearch && matchesStatus && matchesService;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading enquiries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, company, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
            showFilters || filterStatus !== 'all' || filterService !== 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {(filterStatus !== 'all' || filterService !== 'all') && (
            <span className="bg-white text-primary rounded-full px-2 py-0.5 text-xs font-bold">
              {(filterStatus !== 'all' ? 1 : 0) + (filterService !== 'all' ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Service Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Service</label>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none"
              >
                <option value="all">All Services</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="cloud">Cloud Infrastructure</option>
                <option value="ai">AI Integration</option>
                <option value="website">Website Development</option>
                <option value="software">Software Solutions</option>
                <option value="consulting">Consulting</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(filterStatus !== 'all' || filterService !== 'all') && (
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterService('all');
              }}
              className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          Showing {filteredEnquiries.length} of {enquiries.length} enquiries
        </span>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-primary hover:underline"
          >
            Clear search
          </button>
        )}
      </div>

      {/* No Results */}
      {enquiries.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Enquiries Yet</h3>
          <p className="text-gray-400">
            Contact form submissions will appear here when customers reach out through your website.
          </p>
        </div>
      )}

      {/* No Search Results */}
      {enquiries.length > 0 && filteredEnquiries.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
          <p className="text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Enquiry Cards */}
      {filteredEnquiries.map((enquiry) => (
        <motion.div
          key={enquiry.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gray-800/50 border rounded-lg p-4 hover:border-primary/50 transition-all ${
            enquiry.isRead ? 'border-gray-700' : 'border-blue-500/50 bg-blue-500/5'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {/* Read/Unread Indicator */}
                {!enquiry.isRead && (
                  <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
                )}
                <h4 className={`text-lg font-semibold ${enquiry.isRead ? 'text-white' : 'text-blue-400'}`}>
                  {enquiry.name}
                </h4>
                
                {/* Service Badge */}
                <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getServiceBadgeColor(enquiry.service)}`}>
                  {formatServiceName(enquiry.service)}
                </span>

                {/* Status Badge */}
                <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadgeColor(enquiry.status || 'new')}`}>
                  {formatStatusName(enquiry.status || 'new')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  {enquiry.email}
                </div>
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDate(enquiry.createdAt)}
                </div>
              </div>

              {enquiry.company && (
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Company:</strong> {enquiry.company}
                </p>
              )}

              <p className="text-gray-300 text-sm line-clamp-2">
                {enquiry.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 ml-4">
              {/* Mark as Read/Unread */}
              <button
                onClick={() => toggleReadStatus(enquiry.id, enquiry.isRead)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title={enquiry.isRead ? 'Mark as unread' : 'Mark as read'}
              >
                {enquiry.isRead ? (
                  <Mail className="w-5 h-5 text-gray-400" />
                ) : (
                  <Check className="w-5 h-5 text-blue-400" />
                )}
              </button>

              {/* View Details */}
              <button
                onClick={() => {
                  setSelectedEnquiry(selectedEnquiry?.id === enquiry.id ? null : enquiry);
                  if (!enquiry.isRead) {
                    toggleReadStatus(enquiry.id, false);
                  }
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="View details"
              >
                <Eye className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Expanded View */}
          {selectedEnquiry?.id === enquiry.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-700"
            >
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-white mb-2">Full Message:</h5>
                <p className="text-gray-300 text-sm whitespace-pre-wrap bg-gray-900/50 p-3 rounded-lg">
                  {enquiry.message}
                </p>
              </div>

              {/* Status Update */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Change Status:</label>
                <div className="flex gap-2 flex-wrap">
                  {['new', 'in-progress', 'replied', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateEnquiryStatus(enquiry.id, status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        (enquiry.status || 'new') === status
                          ? `${getStatusBadgeColor(status)} border`
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {formatStatusName(status)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <a
                  href={`mailto:${enquiry.email}?subject=Re: Your enquiry about ${formatServiceName(enquiry.service)}`}
                  className="px-4 py-2 bg-primary hover:bg-primary/80 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>

                {(enquiry.status || 'new') !== 'replied' && (
                  <button 
                    onClick={() => updateEnquiryStatus(enquiry.id, 'replied')}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 text-sm rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Mark as Replied
                  </button>
                )}

                {(enquiry.status || 'new') !== 'closed' && (
                  <button 
                    onClick={() => updateEnquiryStatus(enquiry.id, 'closed')}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Close Enquiry
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default EnquiriesTab;
