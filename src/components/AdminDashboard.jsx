import React, { useState, useEffect } from 'react';
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
  Save
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
