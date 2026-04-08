const { onRequest } = require('firebase-functions/v2/https');
const { admin } = require('../lib/firebase');
const { cors, ensureMethod } = require('../lib/http');
const { requireAdmin, verifyBearerToken } = require('../lib/auth');
const { escapeHtml } = require('../lib/content');

const createJob = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res);
      if (!decodedToken) {
        return;
      }

      const {
        title,
        department,
        location,
        jobType,
        experienceLevel,
        description,
        requirements,
        responsibilities,
        benefits,
        salaryRange,
        featured,
      } = req.body;

      if (!title || !department || !location || !jobType || !description) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      const jobData = {
        title: escapeHtml(title),
        department: escapeHtml(department),
        location: escapeHtml(location),
        jobType: escapeHtml(jobType),
        experienceLevel: experienceLevel ? escapeHtml(experienceLevel) : 'Mid-level',
        description: escapeHtml(description),
        requirements: Array.isArray(requirements) ? requirements.map((item) => escapeHtml(item)) : [],
        responsibilities: Array.isArray(responsibilities) ? responsibilities.map((item) => escapeHtml(item)) : [],
        benefits: Array.isArray(benefits) ? benefits.map((item) => escapeHtml(item)) : [],
        salaryRange: salaryRange ? escapeHtml(salaryRange) : 'Competitive',
        featured: featured === true,
        status: 'open',
        applicantCount: 0,
        postedBy: {
          uid: decodedToken.uid,
          name: decodedToken.name || decodedToken.email || 'Admin',
          email: decodedToken.email,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        closedAt: null,
      };

      const docRef = await admin.firestore().collection('jobs').add(jobData);

      return res.status(201).json({
        message: 'Job posted successfully',
        jobId: docRef.id,
      });
    } catch (error) {
      console.error('Error creating job:', error);
      return res.status(500).json({ error: 'Failed to create job' });
    }
  });
});

const getJobs = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'GET')) {
      return;
    }

    try {
      let isAdmin = false;

      try {
        const decodedToken = await verifyBearerToken(req);
        isAdmin = decodedToken?.admin === true;
      } catch (error) {
        isAdmin = false;
      }

      const { department, jobType, status } = req.query;
      let query = admin.firestore().collection('jobs');

      if (!isAdmin) {
        query = query.where('status', '==', 'open');
      } else if (status) {
        query = query.where('status', '==', status);
      }

      if (department && department !== 'all') {
        query = query.where('department', '==', department);
      }

      if (jobType && jobType !== 'all') {
        query = query.where('jobType', '==', jobType);
      }

      const snapshot = await query.get();
      const jobs = [];

      snapshot.forEach((doc) => {
        jobs.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
          updatedAt: doc.data().updatedAt?.toDate?.().toISOString() || null,
          closedAt: doc.data().closedAt?.toDate?.().toISOString() || null,
        });
      });

      jobs.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return res.status(200).json({ jobs, count: jobs.length });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });
});

const updateJob = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, ['PUT', 'POST'])) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res);
      if (!decodedToken) {
        return;
      }

      const { jobId, ...updates } = req.body;

      if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required' });
      }

      const jobRef = admin.firestore().collection('jobs').doc(jobId);
      const jobDoc = await jobRef.get();

      if (!jobDoc.exists) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const updateData = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (updates.title) updateData.title = escapeHtml(updates.title);
      if (updates.department) updateData.department = escapeHtml(updates.department);
      if (updates.location) updateData.location = escapeHtml(updates.location);
      if (updates.jobType) updateData.jobType = escapeHtml(updates.jobType);
      if (updates.experienceLevel) updateData.experienceLevel = escapeHtml(updates.experienceLevel);
      if (updates.description) updateData.description = escapeHtml(updates.description);
      if (updates.requirements) updateData.requirements = Array.isArray(updates.requirements) ? updates.requirements.map((item) => escapeHtml(item)) : [];
      if (updates.responsibilities) updateData.responsibilities = Array.isArray(updates.responsibilities) ? updates.responsibilities.map((item) => escapeHtml(item)) : [];
      if (updates.benefits) updateData.benefits = Array.isArray(updates.benefits) ? updates.benefits.map((item) => escapeHtml(item)) : [];
      if (updates.salaryRange !== undefined) updateData.salaryRange = escapeHtml(updates.salaryRange);
      if (updates.featured !== undefined) updateData.featured = updates.featured === true;
      if (updates.status) {
        updateData.status = updates.status;
        if (updates.status === 'closed' || updates.status === 'filled') {
          updateData.closedAt = admin.firestore.FieldValue.serverTimestamp();
        }
      }

      await jobRef.update(updateData);

      return res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
      console.error('Error updating job:', error);
      return res.status(500).json({ error: 'Failed to update job' });
    }
  });
});

const deleteJob = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, ['DELETE', 'POST'])) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res);
      if (!decodedToken) {
        return;
      }

      const jobId = req.body.jobId || req.query.jobId;

      if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required' });
      }

      const jobRef = admin.firestore().collection('jobs').doc(jobId);
      const jobDoc = await jobRef.get();

      if (!jobDoc.exists) {
        return res.status(404).json({ error: 'Job not found' });
      }

      await jobRef.delete();

      console.log(`Job deleted by ${decodedToken.email}: ${jobId}`);
      return res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Error deleting job:', error);
      return res.status(500).json({ error: 'Failed to delete job' });
    }
  });
});

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
};