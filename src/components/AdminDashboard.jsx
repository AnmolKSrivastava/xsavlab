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
  CheckCircle
} from 'lucide-react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enquiries');

  useEffect(() => {
    // Check authentication and admin status
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Verify admin status
        const idTokenResult = await currentUser.getIdTokenResult();
        if (idTokenResult.claims.admin === true) {
          setUser(currentUser);
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
                <p className="text-sm text-gray-400">{user?.email}</p>
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
            value="0"
            trend="+0% from last month"
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
            <TabButton
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
              icon={<Users className="w-4 h-4" />}
              label="Users"
            />
            <TabButton
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
              icon={<Shield className="w-4 h-4" />}
              label="Settings"
            />
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'enquiries' && <EnquiriesTab />}
            {activeTab === 'users' && <UsersTab />}
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
const EnquiriesTab = () => (
  <div className="space-y-4">
    <div className="text-center py-12">
      <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">No Enquiries Yet</h3>
      <p className="text-gray-400">
        Contact form submissions will appear here when customers reach out through your website.
      </p>
      <p className="text-sm text-gray-500 mt-4">
        Enquiries are stored in your Firebase Cloud Functions. Configure email notifications to receive alerts.
      </p>
    </div>
  </div>
);

// Users Tab
const UsersTab = () => (
  <div className="space-y-4">
    <div className="text-center py-12">
      <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">User Management</h3>
      <p className="text-gray-400 mb-6">
        Manage admin users and their permissions.
      </p>
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto">
        <p className="text-yellow-400 text-sm">
          <strong>Note:</strong> To add new admin users, use Firebase Console → Authentication → Users → Select user → Custom claims → Add: {"{"}"admin": true{"}"}
        </p>
      </div>
    </div>
  </div>
);

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
