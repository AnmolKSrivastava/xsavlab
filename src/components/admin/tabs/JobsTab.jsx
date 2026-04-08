import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Briefcase, Save, CheckCircle, AlertCircle } from 'lucide-react';

const JobsTab = ({ user, userRole, jobs, setJobs, jobsLoading, setJobsLoading }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Cybersecurity',
    location: '',
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    salaryRange: '',
    status: 'open',
    featured: false
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const departments = ['Cybersecurity', 'Cloud Services', 'Development', 'Operations', 'Sales', 'Marketing', 'Administration'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'];
  const statusOptions = ['open', 'on-hold', 'closed', 'filled'];

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    
    setJobsLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getJobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch jobs');

      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs');
    } finally {
      setJobsLoading(false);
    }
  }, [user, setJobsLoading, setJobs]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const endpoint = editingJob 
        ? 'https://us-central1-xsavlab.cloudfunctions.net/updateJob'
        : 'https://us-central1-xsavlab.cloudfunctions.net/createJob';

      const payload = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        responsibilities: formData.responsibilities.split('\n').filter(r => r.trim()),
        benefits: formData.benefits.split('\n').filter(b => b.trim())
      };

      if (editingJob) {
        payload.jobId = editingJob.id;
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
        throw new Error(errorData.error || 'Failed to save job');
      }

      setSuccess(editingJob ? 'Job updated successfully!' : 'Job created successfully!');
      setIsCreating(false);
      setEditingJob(null);
      setFormData({
        title: '',
        department: 'Cybersecurity',
        location: '',
        jobType: 'Full-time',
        experienceLevel: 'Mid-level',
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        salaryRange: '',
        status: 'open',
        featured: false
      });
      fetchJobs();

      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/deleteJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId })
      });

      if (!response.ok) throw new Error('Failed to delete job');

      setSuccess('Job deleted successfully');
      fetchJobs();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : '',
      salaryRange: job.salaryRange || '',
      status: job.status,
      featured: job.featured || false
    });
    setIsCreating(true);
  };

  const filteredJobs = jobs.filter(job => {
    const statusMatch = filterStatus === 'all' || job.status === filterStatus;
    const departmentMatch = filterDepartment === 'all' || job.department === filterDepartment;
    return statusMatch && departmentMatch;
  });

  const statusCounts = {
    all: jobs.length,
    open: jobs.filter(j => j.status === 'open').length,
    'on-hold': jobs.filter(j => j.status === 'on-hold').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    filled: jobs.filter(j => j.status === 'filled').length
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      open: 'bg-green-500/20 text-green-400 border-green-500/30',
      'on-hold': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      filled: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[status] || colors.open}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Job Postings</h3>
          <p className="text-sm text-gray-400">Manage career opportunities</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(!isCreating);
            setEditingJob(null);
            setFormData({
              title: '',
              department: 'Cybersecurity',
              location: '',
              jobType: 'Full-time',
              experienceLevel: 'Mid-level',
              description: '',
              requirements: '',
              responsibilities: '',
              benefits: '',
              salaryRange: '',
              status: 'open',
              featured: false
            });
          }}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancel' : 'New Job'}</span>
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
            {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
          </h4>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
                placeholder="Senior Cybersecurity Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
                placeholder="Remote / New York, NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Job Type *</label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level *</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
              >
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Salary Range</label>
              <input
                type="text"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                placeholder="$100,000 - $150,000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Job Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
                placeholder="Describe the role and what we're looking for..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Requirements (one per line)</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={4}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Bachelor's degree in Computer Science&#10;5+ years of cybersecurity experience&#10;CISSP or CEH certification preferred"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Responsibilities (one per line)</label>
              <textarea
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                rows={4}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Lead security architecture design&#10;Conduct security assessments&#10;Manage incident response"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Benefits (one per line)</label>
              <textarea
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={3}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Health, dental, and vision insurance&#10;401(k) matching&#10;Flexible work schedule"
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
                <span className="text-sm text-gray-300">Feature this job posting</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={submitLoading}
              className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitLoading ? 'Saving...' : (editingJob ? 'Update Job' : 'Create Job')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingJob(null);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-2">
          {['all', 'open', 'on-hold', 'filled', 'closed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {status === 'on-hold' ? 'On Hold' : status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>

        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="bg-gray-800/50 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {jobsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No job postings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{job.title}</h4>
                    <StatusBadge status={job.status} />
                    {job.featured && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mb-3">
                    <span className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.department}</span>
                    </span>
                    <span>{job.location}</span>
                    <span>{job.jobType}</span>
                    <span>{job.experienceLevel}</span>
                    {job.salaryRange && <span className="text-green-400">{job.salaryRange}</span>}
                  </div>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{job.description}</p>
                  {job.applications > 0 && (
                    <div className="text-sm text-gray-500">
                      {job.applications} {job.applications === 1 ? 'application' : 'applications'}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(job)}
                    className="flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300"
                    title="Edit job"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300"
                    title="Delete job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Posted {new Date(job.createdAt).toLocaleDateString()} 
                {job.updatedAt && ` • Updated ${new Date(job.updatedAt).toLocaleDateString()}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsTab;
