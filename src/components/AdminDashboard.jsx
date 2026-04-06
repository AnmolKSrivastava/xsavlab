import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LogOut, 
  Mail, 
  Users, 
  Activity, 
  BarChart3,
  Clock,
  CheckCircle,
  Eye,
  Search,
  Filter,
  Check,
  X,
  Circle,
  UserPlus,
  Trash2,
  Crown,
  ShieldAlert,
  UserCheck,
  Package,
  Edit,
  Plus,
  TrendingUp,
  Globe,
  Settings,
  Save,
  Award,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Send,
  AlertCircle
} from 'lucide-react';
import { auth } from '../config/firebase';
import app from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enquiries');
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [ventures, setVentures] = useState([]);
  const [venturesLoading, setVenturesLoading] = useState(false);
  const [successStories, setSuccessStories] = useState([]);
  const [successStoriesLoading, setSuccessStoriesLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogPostsLoading, setBlogPostsLoading] = useState(false);

  useEffect(() => {
    // Check authentication and admin status
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Verify admin status
        const idTokenResult = await currentUser.getIdTokenResult();
        if (idTokenResult.claims.admin === true) {
          setUser(currentUser);
          setUserRole(idTokenResult.claims.role || 'admin');
        } else {
          // Not an admin, redirect to home
          navigate('/');
        }
      } else {
        // Not authenticated, redirect to login
        navigate('/admin-login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch enquiries from Firestore
  useEffect(() => {
    if (!user) return;

    const db = getFirestore(app);
    const enquiriesRef = collection(db, 'enquiries');
    const q = query(enquiriesRef, orderBy('createdAt', 'desc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const enquiriesData = [];
      snapshot.forEach((doc) => {
        enquiriesData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setEnquiries(enquiriesData);
      setEnquiriesLoading(false);
    }, (error) => {
      console.error('Error fetching enquiries:', error);
      setEnquiriesLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-navy">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">XSAV Lab Admin Portal</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-400">{user?.email}</p>
                  {userRole && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      userRole === 'superadmin' ? 'bg-purple-500/20 text-purple-400' :
                      userRole === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {userRole === 'superadmin' ? '👑 Super Admin' : 
                       userRole === 'admin' ? '🛡️ Admin' : '✓ Moderator'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Mail className="w-6 h-6" />}
            title="Total Enquiries"
            value={enquiriesLoading ? "..." : enquiries.length.toString()}
            trend={enquiries.length > 0 ? `${enquiries.length} total submissions` : "No submissions yet"}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Active Users"
            value="1"
            trend="You are here"
            color="from-green-500 to-green-600"
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            title="Site Visits"
            value="N/A"
            trend="Analytics pending"
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Conversion Rate"
            value="N/A"
            trend="No data yet"
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Tabs */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-800 flex">
            <TabButton
              active={activeTab === 'enquiries'}
              onClick={() => setActiveTab('enquiries')}
              icon={<Mail className="w-4 h-4" />}
              label="Enquiries"
            />
            {/* All admins can manage ventures */}
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'moderator') && (
              <TabButton
                active={activeTab === 'ventures'}
                onClick={() => setActiveTab('ventures')}
                icon={<Package className="w-4 h-4" />}
                label="Ventures"
              />
            )}
            {/* All admins can manage site settings */}
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'moderator') && (
              <TabButton
                active={activeTab === 'siteSettings'}
                onClick={() => setActiveTab('siteSettings')}
                icon={<Settings className="w-4 h-4" />}
                label="Site Settings"
              />
            )}
            {/* All admins can manage success stories */}
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'moderator') && (
              <TabButton
                active={activeTab === 'successStories'}
                onClick={() => setActiveTab('successStories')}
                icon={<Award className="w-4 h-4" />}
                label="Success Stories"
              />
            )}
            {/* All admins can manage reviews */}
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'moderator') && (
              <TabButton
                active={activeTab === 'reviews'}
                onClick={() => setActiveTab('reviews')}
                icon={<MessageSquare className="w-4 h-4" />}
                label="Client Reviews"
              />
            )}
            {/* All admins can manage blog */}
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'moderator') && (
              <TabButton
                active={activeTab === 'blog'}
                onClick={() => setActiveTab('blog')}
                icon={<FileText className="w-4 h-4" />}
                label="Blog"
              />
            )}
            {/* Only admins and super admins can see users tab */}
            {(userRole === 'admin' || userRole === 'superadmin') && (
              <TabButton
                active={activeTab === 'users'}
                onClick={() => setActiveTab('users')}
                icon={<Users className="w-4 h-4" />}
                label="Users"
              />
            )}
            {/* Only super admins can see settings tab */}
            {userRole === 'superadmin' && (
              <TabButton
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
                icon={<Shield className="w-4 h-4" />}
                label="Settings"
              />
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'enquiries' && <EnquiriesTab enquiries={enquiries} loading={enquiriesLoading} />}
            {activeTab === 'ventures' && <VenturesTab user={user} userRole={userRole} ventures={ventures} setVentures={setVentures} venturesLoading={venturesLoading} setVenturesLoading={setVenturesLoading} />}
            {activeTab === 'siteSettings' && <SiteSettingsTab user={user} userRole={userRole} />}
            {activeTab === 'successStories' && <SuccessStoriesTab user={user} userRole={userRole} successStories={successStories} setSuccessStories={setSuccessStories} successStoriesLoading={successStoriesLoading} setSuccessStoriesLoading={setSuccessStoriesLoading} />}
            {activeTab === 'reviews' && <ReviewsTab user={user} userRole={userRole} reviews={reviews} setReviews={setReviews} reviewsLoading={reviewsLoading} setReviewsLoading={setReviewsLoading} />}
            {activeTab === 'blog' && <BlogTab user={user} userRole={userRole} blogPosts={blogPosts} setBlogPosts={setBlogPosts} blogPostsLoading={blogPostsLoading} setBlogPostsLoading={setBlogPostsLoading} />}
            {activeTab === 'users' && <UsersTab user={user} userRole={userRole} users={users} setUsers={setUsers} usersLoading={usersLoading} setUsersLoading={setUsersLoading} />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, trend, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
    </div>
    <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
    <p className="text-3xl font-bold text-white mb-2">{value}</p>
    <p className="text-xs text-gray-500">{trend}</p>
  </motion.div>
);

// Tab Button Component
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
      active
        ? 'text-primary border-b-2 border-primary bg-primary/5'
        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// Enquiries Tab
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

// Users Tab
// Users Tab
const UsersTab = ({ user, userRole, users, setUsers, usersLoading, setUsersLoading }) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserDisplayName, setNewUserDisplayName] = useState('');
  const [newUserRole, setNewUserRole] = useState('moderator');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch users
  useEffect(() => {
    if (userRole !== 'superadmin' && userRole !== 'admin') return;
    
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/listAdminUsers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/createAdminUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          displayName: newUserDisplayName,
          role: newUserRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setMessage({ type: 'success', text: `User ${newUserEmail} created successfully!` });
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserDisplayName('');
      setNewUserRole('moderator');
      setShowAddUser(false);
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/updateUserRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role');
      }

      setMessage({ type: 'success', text: 'Role updated successfully!' });
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete ${userEmail}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/deleteAdminUser', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setMessage({ type: 'success', text: `User ${userEmail} deleted successfully!` });
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'admin':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'moderator':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadmin':
        return <Crown className="w-4 h-4" />;
      case 'admin':
        return <ShieldAlert className="w-4 h-4" />;
      case 'moderator':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  // Check permissions
  const canCreateUsers = userRole === 'superadmin';
  const canViewUsers = userRole === 'superadmin' || userRole === 'admin';

  if (!canViewUsers) {
    return (
      <div className="text-center py-12">
        <ShieldAlert className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Access Denied</h3>
        <p className="text-gray-400">
          You don't have permission to view user management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">User Management</h3>
          <p className="text-sm text-gray-400">
            Manage admin users and their roles
          </p>
        </div>
        {canCreateUsers && (
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add User
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

      {/* Add User Form */}
      {showAddUser && canCreateUsers && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4">Create New User</h4>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={newUserDisplayName}
                  onChange={(e) => setNewUserDisplayName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Min. 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role *
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  <option value="moderator">Moderator - View & update enquiries</option>
                  <option value="admin">Admin - Full enquiry management</option>
                  <option value="superadmin">Super Admin - Full system access</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddUser(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Role Guide */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">Role Permissions:</h4>
        <ul className="text-sm text-blue-300 space-y-1">
          <li><strong>Super Admin:</strong> Full access - manage enquiries, users, and all settings</li>
          <li><strong>Admin:</strong> Manage enquiries, view users, limited settings</li>
          <li><strong>Moderator:</strong> View and update enquiry status only</li>
        </ul>
      </div>

      {/* Users List */}
      {usersLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Users Found</h3>
          <p className="text-gray-400">
            {canCreateUsers ? 'Click "Add User" to create your first user.' : 'No users to display.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((adminUser) => (
            <div
              key={adminUser.uid}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      {adminUser.displayName || adminUser.email.split('@')[0]}
                    </h4>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1 ${getRoleBadgeColor(adminUser.role)}`}>
                      {getRoleIcon(adminUser.role)}
                      {adminUser.role}
                    </span>
                    {adminUser.uid === user?.uid && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{adminUser.email}</p>
                  {adminUser.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(adminUser.createdAt.seconds * 1000).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Actions - Only for Super Admins */}
                {canCreateUsers && adminUser.uid !== user?.uid && (
                  <div className="flex gap-2 ml-4">
                    <select
                      value={adminUser.role}
                      onChange={(e) => handleUpdateRole(adminUser.uid, e.target.value)}
                      className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                      title="Change role"
                    >
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(adminUser.uid, adminUser.email)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Ventures Tab
const VenturesTab = ({ user, userRole, ventures, setVentures, venturesLoading, setVenturesLoading }) => {
  const [showAddVenture, setShowAddVenture] = useState(false);
  const [editingVenture, setEditingVenture] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
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
      fullDescription: venture.fullDescription || '',
      logo: venture.logo || '',
      featuredImage: venture.featuredImage || '',
      website: venture.website || '',
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
            ...formData,
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
          body: JSON.stringify(formData),
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
                {venture.website && (
                  <a
                    href={venture.website}
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

// Site Settings Tab
const SiteSettingsTab = ({ user, userRole }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [statistics, setStatistics] = useState({
    // About Section
    foundedYear: 2018,
    clientsServed: 500,
    industries: 25,
    clientSatisfaction: 99.9,
    // Services/Trust
    successRate: 99.8,
    organizations: 500,
    // Hero Section
    threatDetection: 99.9,
    yearsExperience: 15,
    // How It Works
    deploymentWeeks: '2-4',
    projectSuccessRate: 98,
    supportCoverage: '24/7',
    successfulProjects: 500,
    // AI Demo
    cloudCostReduction: 40,
  });

  const [caseStudies, setCaseStudies] = useState({
    finserve: { threatReduction: 92, fasterResponse: 65, complianceAchieved: 100 },
    retailmax: { costSavings: 42, uptimeSLA: 99.9, performanceBoost: 3 },
    healthtech: { queriesAutomated: 80, responseTimeCut: 50, patientSatisfaction: 4.8 },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getSiteSettings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch site settings');
      }

      const data = await response.json();
      if (data.statistics) {
        setStatistics(data.statistics);
      }
      if (data.caseStudies) {
        setCaseStudies(data.caseStudies);
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const token = await user.getIdToken();
      
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/updateSiteSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ statistics, caseStudies }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update settings');
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setStatistics(prev => ({
      ...prev,
      [field]: field === 'deploymentWeeks' || field === 'supportCoverage' ? value : (parseFloat(value) || 0),
    }));
  };

  const handleCaseStudyChange = (company, field, value) => {
    setCaseStudies(prev => ({
      ...prev,
      [company]: {
        ...prev[company],
        [field]: parseFloat(value) || 0,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Site Statistics</h3>
          <p className="text-gray-400">Manage numbers displayed across your website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Statistics Form */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Main Statistics (About Section)
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Founded Year
            </label>
            <input
              type="number"
              value={statistics.foundedYear}
              onChange={(e) => handleChange('foundedYear', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="2018"
            />
            <p className="text-xs text-gray-500 mt-1">Shown in About section</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Clients Served
            </label>
            <input
              type="number"
              value={statistics.clientsServed}
              onChange={(e) => handleChange('clientsServed', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="500"
            />
            <p className="text-xs text-gray-500 mt-1">Displays as "{statistics.clientsServed}+"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Industries
            </label>
            <input
              type="number"
              value={statistics.industries}
              onChange={(e) => handleChange('industries', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="25"
            />
            <p className="text-xs text-gray-500 mt-1">Displays as "{statistics.industries}+"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client Satisfaction (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={statistics.clientSatisfaction}
              onChange={(e) => handleChange('clientSatisfaction', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="99.9"
            />
            <p className="text-xs text-gray-500 mt-1">Displays as "{statistics.clientSatisfaction}%"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Success Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={statistics.successRate}
              onChange={(e) => handleChange('successRate', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="99.8"
            />
            <p className="text-xs text-gray-500 mt-1">Shown in Services section</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Organizations
            </label>
            <input
              type="number"
              value={statistics.organizations}
              onChange={(e) => handleChange('organizations', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="500"
            />
            <p className="text-xs text-gray-500 mt-1">Trust section count, displays as "{statistics.organizations}+"</p>
          </div>
        </div>
      </div>

      {/* Hero Section Stats */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Hero Section Metrics
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Threat Detection Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={statistics.threatDetection}
              onChange={(e) => handleChange('threatDetection', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="99.9"
            />
            <p className="text-xs text-gray-500 mt-1">Hero section: "Threat Detection"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              value={statistics.yearsExperience}
              onChange={(e) => handleChange('yearsExperience', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="15"
            />
            <p className="text-xs text-gray-500 mt-1">Displays as "{statistics.yearsExperience}+ Years Experience"</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          How It Works Section - Key Metrics
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Typical Deployment
            </label>
            <input
              type="text"
              value={statistics.deploymentWeeks}
              onChange={(e) => handleChange('deploymentWeeks', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="2-4"
            />
            <p className="text-xs text-gray-500 mt-1">e.g., "2-4" (shows "2-4 Weeks")</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Success Rate (%)
            </label>
            <input
              type="number"
              value={statistics.projectSuccessRate}
              onChange={(e) => handleChange('projectSuccessRate', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="98"
            />
            <p className="text-xs text-gray-500 mt-1">Displays as "{statistics.projectSuccessRate}%"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Support Coverage
            </label>
            <input
              type="text"
              value={statistics.supportCoverage}
              onChange={(e) => handleChange('supportCoverage', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="24/7"
            />
            <p className="text-xs text-gray-500 mt-1">e.g., "24/7"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Successful Projects
            </label>
            <input
              type="number"
              value={statistics.successfulProjects}
              onChange={(e) => handleChange('successfulProjects', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="500"
            />
            <p className="text-xs text-gray-500 mt-1">Displays as "{statistics.successfulProjects}+"</p>
          </div>
        </div>
      </div>

      {/* AI Demo Section */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          AI Demo Section
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cloud Cost Reduction (%)
            </label>
            <input
              type="number"
              value={statistics.cloudCostReduction}
              onChange={(e) => handleChange('cloudCostReduction', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="40"
            />
            <p className="text-xs text-gray-500 mt-1">Used in AI chatbot demo responses</p>
          </div>
        </div>
      </div>

      {/* Case Studies Results */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-6">
          Case Studies - Results Metrics
        </h4>
        
        {/* FinServe Global */}
        <div className="mb-8">
          <h5 className="text-md font-semibold text-primary mb-4">FinServe Global (Financial Services)</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Threat Reduction (%)</label>
              <input
                type="number"
                value={caseStudies.finserve.threatReduction}
                onChange={(e) => handleCaseStudyChange('finserve', 'threatReduction', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Faster Response (%)</label>
              <input
                type="number"
                value={caseStudies.finserve.fasterResponse}
                onChange={(e) => handleCaseStudyChange('finserve', 'fasterResponse', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Compliance Achieved (%)</label>
              <input
                type="number"
                value={caseStudies.finserve.complianceAchieved}
                onChange={(e) => handleCaseStudyChange('finserve', 'complianceAchieved', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* RetailMax Corp */}
        <div className="mb-8">
          <h5 className="text-md font-semibold text-primary mb-4">RetailMax Corp (E-Commerce)</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cost Savings (%)</label>
              <input
                type="number"
                value={caseStudies.retailmax.costSavings}
                onChange={(e) => handleCaseStudyChange('retailmax', 'costSavings', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Uptime SLA (%)</label>
              <input
                type="number"
                step="0.1"
                value={caseStudies.retailmax.uptimeSLA}
                onChange={(e) => handleCaseStudyChange('retailmax', 'uptimeSLA', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Performance Boost (x)</label>
              <input
                type="number"
                value={caseStudies.retailmax.performanceBoost}
                onChange={(e) => handleCaseStudyChange('retailmax', 'performanceBoost', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* HealthTech Solutions */}
        <div>
          <h5 className="text-md font-semibold text-primary mb-4">HealthTech Solutions (Healthcare)</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Queries Automated (%)</label>
              <input
                type="number"
                value={caseStudies.healthtech.queriesAutomated}
                onChange={(e) => handleCaseStudyChange('healthtech', 'queriesAutomated', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Response Time Cut (%)</label>
              <input
                type="number"
                value={caseStudies.healthtech.responseTimeCut}
                onChange={(e) => handleCaseStudyChange('healthtech', 'responseTimeCut', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Patient Satisfaction (/5)</label>
              <input
                type="number"
                step="0.1"
                value={caseStudies.healthtech.patientSatisfaction}
                onChange={(e) => handleCaseStudyChange('healthtech', 'patientSatisfaction', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-400 text-sm">
          <strong>Note:</strong> After saving, changes will be visible immediately across your entire website: Hero, About, Services, Trust, How It Works, Case Studies, and AI Demo sections.
        </p>
      </div>
    </div>
  );
};

// Success Stories Tab
const SuccessStoriesTab = ({ user, userRole, successStories, setSuccessStories, successStoriesLoading, setSuccessStoriesLoading }) => {
  const [showAddStory, setShowAddStory] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form state
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

  // Fetch success stories
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
        // Update existing story
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
        // Create new story
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

  // Check permissions
  const canCreateStories = userRole === 'admin' || userRole === 'superadmin';
  const canDeleteStories = userRole === 'superadmin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Success Stories</h3>
          <p className="text-sm text-gray-400">
            Manage client success stories and testimonials
          </p>
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

      {/* Add/Edit Success Story Form */}
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
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name *
                </label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industry *
                </label>
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

            {/* Challenge */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Challenge *
              </label>
              <textarea
                value={formData.challenge}
                onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                required
                rows="3"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                placeholder="Describe the client's main challenges..."
              />
            </div>

            {/* Solution */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Solution *
              </label>
              <textarea
                value={formData.solution}
                onChange={(e) => setFormData({...formData, solution: e.target.value})}
                required
                rows="3"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                placeholder="Describe the solution provided..."
              />
            </div>

            {/* Results (3 metrics) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Results & Metrics
              </label>
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
              <p className="text-xs text-gray-500 mt-2">Example: "Reduction in Costs" | "50" | "%"</p>
            </div>

            {/* Client Information */}
            <div className="border-t border-gray-700 pt-4">
              <h5 className="text-md font-semibold text-white mb-3">Client Testimonial</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client Role
                  </label>
                  <input
                    type="text"
                    value={formData.clientRole}
                    onChange={(e) => setFormData({...formData, clientRole: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    placeholder="CTO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company
                  </label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Testimonial / Remarks
                </label>
                <textarea
                  value={formData.testimonial}
                  onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Client's feedback and remarks..."
                />
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-700 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Order
                </label>
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

            {/* Actions */}
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

      {/* Success Stories List */}
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

              {/* Results */}
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

              {/* Testimonial */}
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

// Reviews Tab
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

  // Fetch reviews
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

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (activeFilter === 'all') return true;
    return review.status === activeFilter;
  });

  // Group reviews by status
  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const rejectedReviews = reviews.filter(r => r.status === 'rejected');

  const canDeleteReviews = userRole === 'superadmin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Client Reviews</h3>
          <p className="text-sm text-gray-400">
            Moderate and manage client-submitted reviews
          </p>
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

      {/* Edit Form */}
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

      {/* Reviews List */}
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
                <span>Submitted by: {review.submittedByEmail || 'N/A'}</span>
                {review.approvedByEmail && <span>Approved by: {review.approvedByEmail}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Blog Tab
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

  // Fetch blog posts
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
  }, [user, setBlogPostsLoading, setBlogPosts, setError]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Create or update blog post
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

  // Submit for approval
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

  // Approve post
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

  // Reject post
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

  // Delete post
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

  // Edit post
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

  // Filter posts
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

  // Status badge component
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
      {/* Header */}
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
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancel' : 'New Post'}</span>
        </button>
      </div>

      {/* Success/Error Messages */}
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

      {/* Create/Edit Form */}
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
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
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

      {/* Filter Tabs */}
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

      {/* Category Filter */}
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

      {/* Blog Posts List */}
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
                  {/* Author can submit draft for approval */}
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

                  {/* Admin can approve pending posts */}
                  {post.status === 'pending' && userRole === 'admin' && (
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

                  {/* Edit and Delete buttons */}
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

// Settings Tab
const SettingsTab = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-300">Two-Factor Authentication</span>
          </div>
          <span className="text-sm text-gray-500">Recommended</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-gray-300">Session Timeout</span>
          </div>
          <span className="text-sm text-gray-500">30 minutes</span>
        </div>
      </div>
    </div>
    
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
      <p className="text-blue-400 text-sm">
        <strong>Firebase Project:</strong> Configure additional security settings in your Firebase Console.
      </p>
    </div>
  </div>
);

export default AdminDashboard;
