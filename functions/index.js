const {
  sendEnquiry,
  getEnquiries,
} = require('./modules/enquiries');
const {
  setAdminRole,
  createAdminUser,
  updateUserRole,
  listAdminUsers,
  deleteAdminUser,
} = require('./modules/adminUsers');
const { createVenture, updateVenture, deleteVenture, getVentures, trackVentureView, trackVentureClick } = require('./modules/ventures');
const { getSiteSettings, updateSiteSettings } = require('./modules/siteSettings');
const { getSuccessStories, createSuccessStory, updateSuccessStory, deleteSuccessStory } = require('./modules/successStories');
const { submitReview, getReviews, approveReview, updateReview, deleteReview } = require('./modules/reviews');
const {
  createBlogPost,
  getBlogPosts,
  getBlogPost,
  updateBlogPost,
  submitBlogPostForApproval,
  approveBlogPost,
  rejectBlogPost,
  deleteBlogPost,
} = require('./modules/blog');
const { createJob, getJobs, updateJob, deleteJob } = require('./modules/jobs');
const { submitApplication, getApplications, updateApplicationStatus } = require('./modules/applications');

exports.sendEnquiry = sendEnquiry;
exports.getEnquiries = getEnquiries;
exports.setAdminRole = setAdminRole;
exports.createAdminUser = createAdminUser;
exports.updateUserRole = updateUserRole;
exports.listAdminUsers = listAdminUsers;
exports.deleteAdminUser = deleteAdminUser;
exports.createVenture = createVenture;
exports.updateVenture = updateVenture;
exports.deleteVenture = deleteVenture;
exports.getVentures = getVentures;
exports.trackVentureView = trackVentureView;
exports.trackVentureClick = trackVentureClick;
exports.getSiteSettings = getSiteSettings;
exports.updateSiteSettings = updateSiteSettings;
exports.getSuccessStories = getSuccessStories;
exports.createSuccessStory = createSuccessStory;
exports.updateSuccessStory = updateSuccessStory;
exports.deleteSuccessStory = deleteSuccessStory;
exports.submitReview = submitReview;
exports.getReviews = getReviews;
exports.approveReview = approveReview;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
exports.createBlogPost = createBlogPost;
exports.getBlogPosts = getBlogPosts;
exports.getBlogPost = getBlogPost;
exports.updateBlogPost = updateBlogPost;
exports.submitBlogPostForApproval = submitBlogPostForApproval;
exports.approveBlogPost = approveBlogPost;
exports.rejectBlogPost = rejectBlogPost;
exports.deleteBlogPost = deleteBlogPost;
exports.createJob = createJob;
exports.getJobs = getJobs;
exports.updateJob = updateJob;
exports.deleteJob = deleteJob;
exports.submitApplication = submitApplication;
exports.getApplications = getApplications;
exports.updateApplicationStatus = updateApplicationStatus;


