import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LogOut, 
  Mail, 
  Users, 
  Activity, 
  BarChart3,
  Package,
  Settings,
  Award,
  MessageSquare,
  FileText,
  Briefcase,
  UserCheck
} from 'lucide-react';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

// Import UI components
import StatCard from '../../components/admin/ui/StatCard';
import TabButton from '../../components/admin/ui/TabButton';

// Import tab components
import EnquiriesTab from '../../components/admin/tabs/EnquiriesTab';
import UsersTab from '../../components/admin/tabs/UsersTab';
import VenturesTab from '../../components/admin/tabs/VenturesTab';
import SiteSettingsTab from '../../components/admin/tabs/SiteSettingsTab';
import SuccessStoriesTab from '../../components/admin/tabs/SuccessStoriesTab';
import ReviewsTab from '../../components/admin/tabs/ReviewsTab';
import BlogTab from '../../components/admin/tabs/BlogTab';
import SettingsTab from '../../components/admin/tabs/SettingsTab';
import JobsTab from '../../components/admin/tabs/JobsTab';
import ApplicationsTab from '../../components/admin/tabs/ApplicationsTab';

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
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

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

    const db = getFirestore();
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden">
          <div className="border-b border-gray-800 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/50">
            <div className="flex min-w-max">
              <TabButton
                active={activeTab === 'enquiries'}
                onClick={() => setActiveTab('enquiries')}
                icon={<Mail className="w-4 h-4" />}
                label="Enquiries"
              />
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'moderator') && (
              <TabButton
                active={activeTab === 'ventures'}
                onClick={() => setActiveTab('ventures')}
                icon={<Package className="w-4 h-4" />}
                label="Ventures"
              />
            )}
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'moderator') && (
              <TabButton
                active={activeTab === 'siteSettings'}
                onClick={() => setActiveTab('siteSettings')}
                icon={<Settings className="w-4 h-4" />}
                label="Site Settings"
              />
            )}
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'moderator') && (
              <TabButton
                active={activeTab === 'successStories'}
                onClick={() => setActiveTab('successStories')}
                icon={<Award className="w-4 h-4" />}
                label="Success Stories"
              />
            )}
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'moderator') && (
              <TabButton
                active={activeTab === 'reviews'}
                onClick={() => setActiveTab('reviews')}
                icon={<MessageSquare className="w-4 h-4" />}
                label="Client Reviews"
              />
            )}
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'moderator') && (
              <TabButton
                active={activeTab === 'blog'}
                onClick={() => setActiveTab('blog')}
                icon={<FileText className="w-4 h-4" />}
                label="Blog"
              />
            )}
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'moderator') && (
              <TabButton
                active={activeTab === 'jobs'}
                onClick={() => setActiveTab('jobs')}
                icon={<Briefcase className="w-4 h-4" />}
                label="Careers"
              />
            )}
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'moderator') && (
              <TabButton
                active={activeTab === 'applications'}
                onClick={() => setActiveTab('applications')}
                icon={<UserCheck className="w-4 h-4" />}
                label="Applications"
              />
            )}
            {(userRole === 'admin' || userRole === 'superadmin') && (
              <TabButton
                active={activeTab === 'users'}
                onClick={() => setActiveTab('users')}
                icon={<Users className="w-4 h-4" />}
                label="Users"
              />
            )}
            {userRole === 'superadmin' && (
              <TabButton
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
                icon={<Shield className="w-4 h-4" />}
                label="Settings"
              />
            )}
            </div>
          </div>
          <div className="p-6">
            {activeTab === 'enquiries' && <EnquiriesTab enquiries={enquiries} loading={enquiriesLoading} />}
            {activeTab === 'ventures' && <VenturesTab user={user} userRole={userRole} ventures={ventures} setVentures={setVentures} venturesLoading={venturesLoading} setVenturesLoading={setVenturesLoading} />}
            {activeTab === 'siteSettings' && <SiteSettingsTab user={user} userRole={userRole} />}
            {activeTab === 'successStories' && <SuccessStoriesTab user={user} userRole={userRole} successStories={successStories} setSuccessStories={setSuccessStories} successStoriesLoading={successStoriesLoading} setSuccessStoriesLoading={setSuccessStoriesLoading} />}
            {activeTab === 'reviews' && <ReviewsTab user={user} userRole={userRole} reviews={reviews} setReviews={setReviews} reviewsLoading={reviewsLoading} setReviewsLoading={setReviewsLoading} />}
            {activeTab === 'blog' && <BlogTab user={user} userRole={userRole} blogPosts={blogPosts} setBlogPosts={setBlogPosts} blogPostsLoading={blogPostsLoading} setBlogPostsLoading={setBlogPostsLoading} />}
            {activeTab === 'jobs' && <JobsTab user={user} userRole={userRole} jobs={jobs} setJobs={setJobs} jobsLoading={jobsLoading} setJobsLoading={setJobsLoading} />}
            {activeTab === 'applications' && <ApplicationsTab user={user} userRole={userRole} applications={applications} setApplications={setApplications} applicationsLoading={applicationsLoading} setApplicationsLoading={setApplicationsLoading} />}
            {activeTab === 'users' && <UsersTab user={user} userRole={userRole} users={users} setUsers={setUsers} usersLoading={usersLoading} setUsersLoading={setUsersLoading} />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
