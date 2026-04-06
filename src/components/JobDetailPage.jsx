import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Upload,
  FileText,
  Mail,
  Phone,
  User,
  Globe,
  Users
} from 'lucide-react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    coverLetter: '',
    portfolioUrl: '',
    linkedInUrl: ''
  });

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`https://us-central1-xsavlab.cloudfunctions.net/getJobs`);
        
        if (!response.ok) throw new Error('Failed to fetch job');

        const data = await response.json();
        const foundJob = data.jobs.find(j => j.id === jobId);

        if (!foundJob) {
          setError('Job not found');
        } else if (foundJob.status !== 'open') {
          setError('This position is no longer accepting applications');
        } else {
          setJob(foundJob);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  // Handle resume upload
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Resume must be a PDF file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Resume file size must be less than 5MB');
      return;
    }

    setResumeFile(file);
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate resume
      if (!resumeFile) {
        throw new Error('Please upload your resume');
      }

      // Upload resume to Firebase Storage (no auth required after rule update)
      setResumeUploading(true);
      const storage = getStorage();
      const resumePath = `resumes/${jobId}/${Date.now()}_${resumeFile.name}`;
      const resumeRef = ref(storage, resumePath);
      
      await uploadBytes(resumeRef, resumeFile);
      // Don't get download URL - only admins can read (privacy)
      // Just pass the storage path, admin will generate URL when viewing
      setResumeUploading(false);

      // Submit application (no auth required for public applications)
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/submitApplication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId,
          ...formData,
          resumeUrl: resumePath  // Store path instead of URL
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      setSuccess(true);
      
      // Reset form
      setFormData({
        applicantName: '',
        applicantEmail: '',
        applicantPhone: '',
        coverLetter: '',
        portfolioUrl: '',
        linkedInUrl: ''
      });
      setResumeFile(null);

      // Scroll to success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      setError(error.message);
      setResumeUploading(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Job Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/careers')}
            className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/careers')}
          className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all positions
        </button>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Application Submitted Successfully!</h3>
            </div>
            <p className="text-gray-300">
              Thank you for applying to {job.title}. We've received your application and will review it shortly. 
              You'll hear from us within 5-7 business days.
            </p>
          </motion.div>
        )}

        {/* Job Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 mb-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-primary/10 p-4 rounded-xl">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{job.title}</h1>
              {job.featured && (
                <span className="inline-block bg-yellow-500/20 text-yellow-400 text-sm px-3 py-1 rounded-full border border-yellow-500/30 mb-3">
                  ⭐ Featured Position
                </span>
              )}
              <div className="flex flex-wrap gap-4 text-gray-400">
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {job.department}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {job.jobType}
                </span>
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {job.experienceLevel}
                </span>
                {job.salaryRange && job.salaryRange !== 'Competitive' && (
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {job.salaryRange}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">About the Role</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{job.description}</p>
            </div>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">Key Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">What We Offer</h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        {/* Application Form */}
        {!success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/30 border border-gray-700 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Apply for this Position</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-gray-900/50 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.applicantEmail}
                      onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full bg-gray-900/50 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.applicantPhone}
                      onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full bg-gray-900/50 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.linkedInUrl}
                      onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/johndoe"
                      className="w-full bg-gray-900/50 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Portfolio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Portfolio / Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="https://yourportfolio.com"
                      className="w-full bg-gray-900/50 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resume / CV * (PDF only, max 5MB)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeChange}
                      required
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex items-center justify-center gap-3 w-full bg-gray-900/50 border-2 border-dashed border-gray-700 text-gray-400 px-4 py-6 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-900/70 transition-all"
                    >
                      {resumeFile ? (
                        <>
                          <FileText className="w-6 h-6 text-primary" />
                          <span className="text-white">{resumeFile.name}</span>
                          <span className="text-xs text-gray-500">({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6" />
                          <span>Click to upload your resume (PDF)</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    rows="6"
                    placeholder="Tell us why you're a great fit for this role..."
                    className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || resumeUploading}
                  className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting || resumeUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{resumeUploading ? 'Uploading Resume...' : 'Submitting Application...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-500 text-center">
                By submitting this application, you agree to our processing of your personal data 
                for recruitment purposes in accordance with our Privacy Policy.
              </p>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobDetailPage;
