import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Mail, Phone, User, Eye, FileText, Globe, Users, Clock, CheckCircle, AlertCircle, MessageSquare, Send, X } from 'lucide-react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const ApplicationsTab = ({ user, userRole, applications, setApplications, applicationsLoading, setApplicationsLoading }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterJob, setFilterJob] = useState('all');
  const [viewingApplication, setViewingApplication] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const statusOptions = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'];

  // Helper function to decode HTML entities in URLs
  const decodeHtmlEntities = (text) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    
    setApplicationsLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getApplications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch applications');

      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications');
    } finally {
      setApplicationsLoading(false);
    }
  }, [user, setApplicationsLoading, setApplications]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = async (applicationId, newStatus, note = '') => {
    try {
      const token = await user.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/updateApplicationStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          applicationId, 
          status: newStatus,
          note: note || undefined
        })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setSuccess('Application status updated successfully');
      fetchApplications();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddNote = async (applicationId) => {
    if (!newNote.trim()) return;

    try {
      await handleStatusChange(applicationId, viewingApplication.status, newNote.trim());
      setNewNote('');
      setViewingApplication({ 
        ...viewingApplication, 
        notes: [...(viewingApplication.notes || []), {
          text: newNote.trim(),
          addedBy: user.email,
          addedAt: new Date().toISOString()
        }]
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDownloadResume = async (resumeUrl) => {
    try {
      if (!resumeUrl) {
        setError('No resume available');
        return;
      }

      // Decode URL if it contains HTML entities
      const decodedUrl = decodeHtmlEntities(resumeUrl);

      // If it's a Firebase Storage URL
      if (decodedUrl.includes('firebasestorage.googleapis.com') || decodedUrl.startsWith('gs://')) {
        const storage = getStorage();
        let storageRef;

        if (decodedUrl.startsWith('gs://')) {
          storageRef = ref(storage, decodedUrl);
        } else {
          // Extract path from HTTPS URL
          const urlObj = new URL(decodedUrl);
          const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/);
          if (pathMatch) {
            const path = decodeURIComponent(pathMatch[1]);
            storageRef = ref(storage, path);
          } else {
            throw new Error('Invalid Firebase Storage URL');
          }
        }

        const downloadUrl = await getDownloadURL(storageRef);
        window.open(downloadUrl, '_blank');
      } else {
        // Direct URL
        window.open(decodedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      setError('Failed to download resume: ' + error.message);
    }
  };

  const filteredApplications = applications.filter(app => {
    const statusMatch = filterStatus === 'all' || app.status === filterStatus;
    const jobMatch = filterJob === 'all' || app.jobId === filterJob;
    return statusMatch && jobMatch;
  });

  const statusCounts = {
    all: applications.length,
    new: applications.filter(a => a.status === 'new').length,
    screening: applications.filter(a => a.status === 'screening').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    hired: applications.filter(a => a.status === 'hired').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  const uniqueJobs = [...new Set(applications.map(a => ({ id: a.jobId, title: a.jobTitle })))];

  const StatusBadge = ({ status }) => {
    const colors = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      screening: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      interview: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      offer: 'bg-green-500/20 text-green-400 border-green-500/30',
      hired: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[status] || colors.new}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Job Applications</h3>
          <p className="text-sm text-gray-400">Manage candidate applications</p>
        </div>
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

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-2 flex-wrap">
          {['all', 'new', 'screening', 'interview', 'offer', 'hired', 'rejected'].map(status => (
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

        {uniqueJobs.length > 0 && (
          <select
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary"
          >
            <option value="all">All Jobs</option>
            {uniqueJobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        )}
      </div>

      {applicationsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{application.applicantName}</h4>
                    <StatusBadge status={application.status} />
                  </div>
                  <div className="flex flex-col space-y-1 text-sm text-gray-400 mb-3">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{application.jobTitle}</span>
                      {application.jobDepartment && (
                        <span className="text-gray-500">• {application.jobDepartment}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${application.applicantEmail}`} className="text-blue-400 hover:text-blue-300">
                        {application.applicantEmail}
                      </a>
                    </div>
                    {application.applicantPhone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{application.applicantPhone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {application.resumeUrl && (
                      <button
                        onClick={() => handleDownloadResume(application.resumeUrl)}
                        className="flex items-center space-x-1 text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/30 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Resume</span>
                      </button>
                    )}
                    {application.portfolioUrl && (
                      <a
                        href={application.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded hover:bg-purple-500/30 transition-colors"
                      >
                        <Globe className="w-3 h-3" />
                        <span>Portfolio</span>
                      </a>
                    )}
                    {application.linkedInUrl && (
                      <a
                        href={application.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/30 transition-colors"
                      >
                        <User className="w-3 h-3" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Applied {new Date(application.submittedAt).toLocaleDateString()}</span>
                    </div>
                    {application.notes && application.notes.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{application.notes.length} note{application.notes.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => setViewingApplication(application)}
                    className="flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>

                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e.target.value)}
                    className="bg-gray-900/50 border border-gray-700 text-white text-xs px-2 py-1 rounded focus:outline-none focus:border-primary"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingApplication && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{viewingApplication.applicantName}</h3>
                <p className="text-sm text-gray-400">{viewingApplication.jobTitle}</p>
              </div>
              <button
                onClick={() => setViewingApplication(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${viewingApplication.applicantEmail}`} className="text-blue-400 hover:text-blue-300">
                      {viewingApplication.applicantEmail}
                    </a>
                  </div>
                  {viewingApplication.applicantPhone && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span>{viewingApplication.applicantPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Materials</h4>
                <div className="flex flex-wrap gap-2">
                  {viewingApplication.resumeUrl && (
                    <button
                      onClick={() => handleDownloadResume(viewingApplication.resumeUrl)}
                      className="flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded hover:bg-blue-500/30 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download Resume</span>
                    </button>
                  )}
                  {viewingApplication.portfolioUrl && (
                    <a
                      href={viewingApplication.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded hover:bg-purple-500/30 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>View Portfolio</span>
                    </a>
                  )}
                  {viewingApplication.linkedInUrl && (
                    <a
                      href={viewingApplication.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded hover:bg-blue-500/30 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </div>

              {viewingApplication.coverLetter && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Cover Letter</h4>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap">
                    {viewingApplication.coverLetter}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Application Status</h4>
                <select
                  value={viewingApplication.status}
                  onChange={(e) => {
                    handleStatusChange(viewingApplication.id, e.target.value);
                    setViewingApplication({ ...viewingApplication, status: e.target.value });
                  }}
                  className="bg-gray-800/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Internal Notes</h4>
                <div className="space-y-3">
                  {viewingApplication.notes && viewingApplication.notes.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {viewingApplication.notes.map((note, index) => (
                        <div key={index} className="bg-gray-800/50 border border-gray-700 rounded p-3">
                          <p className="text-sm text-gray-300 mb-1">{note.text}</p>
                          <p className="text-xs text-gray-500">
                            {note.addedBy} • {new Date(note.addedAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No notes yet</p>
                  )}

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note..."
                      className="flex-1 bg-gray-800/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddNote(viewingApplication.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddNote(viewingApplication.id)}
                      disabled={!newNote.trim()}
                      className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-dark-navy px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t border-gray-700">
                <p>Submitted: {new Date(viewingApplication.submittedAt).toLocaleString()}</p>
                {viewingApplication.updatedAt && (
                  <p>Last Updated: {new Date(viewingApplication.updatedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTab;

