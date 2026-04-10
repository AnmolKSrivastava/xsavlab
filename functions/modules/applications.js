const { onRequest } = require('firebase-functions/v2/https');
const { admin } = require('../lib/firebase');
const { cors, ensureMethod } = require('../lib/http');
const { requireAdmin, verifyBearerToken } = require('../lib/auth');
const { escapeHtml } = require('../lib/content');

const APPLICATION_RATE_LIMIT = 5; // per IP per hour
const HTTPS_URL_RE = /^https:\/\/.{1,1990}$/;
const STORAGE_PATH_RE = /^resumes\/[a-zA-Z0-9_-]{1,100}\/.{1,240}$/;
const COVER_LETTER_STORAGE_PATH_RE = /^coverLetters\/[a-zA-Z0-9_-]{1,100}\/.{1,240}$/;

async function checkApplicationRateLimit(ip) {
  const safeIp = String(ip).replace(/[^a-zA-Z0-9._:-]/g, '_').slice(0, 64);
  const ref = admin.firestore().collection('rateLimits').doc(`app_${safeIp}`);
  const doc = await ref.get();
  const now = Date.now();

  if (doc.exists) {
    const { count, windowStart } = doc.data();
    if (now - windowStart < 3600000) {
      if (count >= APPLICATION_RATE_LIMIT) return true;
      await ref.update({ count: admin.firestore.FieldValue.increment(1) });
      return false;
    }
  }

  await ref.set({ count: 1, windowStart: now });
  return false;
}

const submitApplication = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      let submittedBy = 'public';

      try {
        const decodedToken = await verifyBearerToken(req);
        if (decodedToken?.uid) {
          submittedBy = decodedToken.uid;
        }
      } catch (authError) {
        console.log('Invalid auth token, continuing as public user');
      }

      const {
        jobId,
        applicantName,
        applicantEmail,
        applicantPhone,
        currentCompany,
        currentRole,
        yearsOfExperience,
        highestQualification,
        currentLocation,
        preferredWorkMode,
        noticePeriodDays,
        expectedSalary,
        workAuthorization,
        educationLevel,
        degreeName,
        specialization,
        universityName,
        graduationYear,
        academicScore,
        twelfthBoard,
        twelfthStream,
        coverLetter,
        portfolioUrl,
        linkedInUrl,
        githubUrl,
        resumeUrl,
        coverLetterFileUrl,
      } = req.body;

      if (!jobId || !applicantName || !applicantEmail || !resumeUrl) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      const isHttpsResume = HTTPS_URL_RE.test(resumeUrl);
      const isStoragePathResume = STORAGE_PATH_RE.test(resumeUrl);
      if (!isHttpsResume && !isStoragePathResume) {
        return res.status(400).json({ error: 'resumeUrl must be a valid Firebase Storage path or https:// URL' });
      }
      if (portfolioUrl && !HTTPS_URL_RE.test(portfolioUrl)) {
        return res.status(400).json({ error: 'portfolioUrl must be a valid https:// URL' });
      }
      if (linkedInUrl && !HTTPS_URL_RE.test(linkedInUrl)) {
        return res.status(400).json({ error: 'linkedInUrl must be a valid https:// URL' });
      }
      if (githubUrl && !HTTPS_URL_RE.test(githubUrl)) {
        return res.status(400).json({ error: 'githubUrl must be a valid https:// URL' });
      }
      if (coverLetterFileUrl && !COVER_LETTER_STORAGE_PATH_RE.test(coverLetterFileUrl)) {
        return res.status(400).json({ error: 'coverLetterFileUrl must be a valid cover letter storage path' });
      }

      if (currentCompany && String(currentCompany).length > 200) {
        return res.status(400).json({ error: 'currentCompany exceeds max length' });
      }
      if (currentRole && String(currentRole).length > 200) {
        return res.status(400).json({ error: 'currentRole exceeds max length' });
      }
      if (highestQualification && String(highestQualification).length > 200) {
        return res.status(400).json({ error: 'highestQualification exceeds max length' });
      }
      if (currentLocation && String(currentLocation).length > 200) {
        return res.status(400).json({ error: 'currentLocation exceeds max length' });
      }
      if (expectedSalary && String(expectedSalary).length > 120) {
        return res.status(400).json({ error: 'expectedSalary exceeds max length' });
      }
      if (workAuthorization && String(workAuthorization).length > 300) {
        return res.status(400).json({ error: 'workAuthorization exceeds max length' });
      }
      if (degreeName && String(degreeName).length > 200) {
        return res.status(400).json({ error: 'degreeName exceeds max length' });
      }
      if (specialization && String(specialization).length > 200) {
        return res.status(400).json({ error: 'specialization exceeds max length' });
      }
      if (universityName && String(universityName).length > 220) {
        return res.status(400).json({ error: 'universityName exceeds max length' });
      }
      if (academicScore && String(academicScore).length > 50) {
        return res.status(400).json({ error: 'academicScore exceeds max length' });
      }
      if (twelfthBoard && String(twelfthBoard).length > 120) {
        return res.status(400).json({ error: 'twelfthBoard exceeds max length' });
      }
      if (twelfthStream && String(twelfthStream).length > 120) {
        return res.status(400).json({ error: 'twelfthStream exceeds max length' });
      }

      const parsedYears = yearsOfExperience === '' || yearsOfExperience === undefined
        ? null
        : Number(yearsOfExperience);
      if (parsedYears !== null && (!Number.isFinite(parsedYears) || parsedYears < 0 || parsedYears > 60)) {
        return res.status(400).json({ error: 'yearsOfExperience must be between 0 and 60' });
      }

      const parsedNotice = noticePeriodDays === '' || noticePeriodDays === undefined
        ? null
        : Number(noticePeriodDays);
      if (parsedNotice !== null && (!Number.isFinite(parsedNotice) || parsedNotice < 0 || parsedNotice > 365)) {
        return res.status(400).json({ error: 'noticePeriodDays must be between 0 and 365' });
      }

      const safePreferredWorkMode = ['Remote', 'Hybrid', 'Onsite', 'No Preference'].includes(preferredWorkMode)
        ? preferredWorkMode
        : '';

      const safeEducationLevel = ['10th', '12th', 'Diploma', 'ITI', 'Undergraduate', 'Postgraduate', 'Doctorate']
        .includes(educationLevel)
        ? educationLevel
        : '';

      const parsedGraduationYear = graduationYear === '' || graduationYear === undefined
        ? null
        : Number(graduationYear);
      if (parsedGraduationYear !== null && (!Number.isFinite(parsedGraduationYear) || parsedGraduationYear < 1980 || parsedGraduationYear > 2100)) {
        return res.status(400).json({ error: 'graduationYear must be between 1980 and 2100' });
      }

      const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      try {
        const isRateLimited = await checkApplicationRateLimit(clientIp);
        if (isRateLimited) {
          return res.status(429).json({ error: 'Too many submissions. Please try again later.' });
        }
      } catch (rateLimitError) {
        console.error('Application rate limit check failed (continuing):', rateLimitError);
      }

      const jobRef = admin.firestore().collection('jobs').doc(jobId);
      const jobDoc = await jobRef.get();

      if (!jobDoc.exists) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const jobData = jobDoc.data();
      if (jobData.status !== 'open') {
        return res.status(400).json({ error: 'This position is no longer accepting applications' });
      }

      const applicationData = {
        jobId,
        jobTitle: jobData.title,
        jobDepartment: jobData.department,
        applicantName: escapeHtml(applicantName),
        applicantEmail: escapeHtml(applicantEmail),
        applicantPhone: applicantPhone ? escapeHtml(applicantPhone) : '',
        currentCompany: currentCompany ? escapeHtml(currentCompany) : '',
        currentRole: currentRole ? escapeHtml(currentRole) : '',
        yearsOfExperience: parsedYears,
        highestQualification: highestQualification ? escapeHtml(highestQualification) : '',
        currentLocation: currentLocation ? escapeHtml(currentLocation) : '',
        preferredWorkMode: safePreferredWorkMode,
        noticePeriodDays: parsedNotice,
        expectedSalary: expectedSalary ? escapeHtml(expectedSalary) : '',
        workAuthorization: workAuthorization ? escapeHtml(workAuthorization) : '',
        educationLevel: safeEducationLevel,
        degreeName: degreeName ? escapeHtml(degreeName) : '',
        specialization: specialization ? escapeHtml(specialization) : '',
        universityName: universityName ? escapeHtml(universityName) : '',
        graduationYear: parsedGraduationYear,
        academicScore: academicScore ? escapeHtml(academicScore) : '',
        twelfthBoard: twelfthBoard ? escapeHtml(twelfthBoard) : '',
        twelfthStream: twelfthStream ? escapeHtml(twelfthStream) : '',
        resumeUrl,
        coverLetter: coverLetter ? escapeHtml(coverLetter) : '',
        portfolioUrl: portfolioUrl || '',
        linkedInUrl: linkedInUrl || '',
        githubUrl: githubUrl || '',
        coverLetterFileUrl: coverLetterFileUrl || '',
        status: 'new',
        notes: [],
        submittedBy,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        reviewedBy: null,
      };

      const docRef = await admin.firestore().collection('applications').add(applicationData);

      await jobRef.update({
        applicantCount: admin.firestore.FieldValue.increment(1),
      });

      return res.status(201).json({
        message: 'Application submitted successfully',
        applicationId: docRef.id,
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      return res.status(500).json({ error: 'Failed to submit application' });
    }
  });
});

const getApplications = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'GET')) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res);
      if (!decodedToken) {
        return;
      }

      const { jobId, status } = req.query;
      let query = admin.firestore().collection('applications');

      if (jobId) {
        query = query.where('jobId', '==', jobId);
      }

      if (status && status !== 'all') {
        query = query.where('status', '==', status);
      }

      const snapshot = await query.get();
      const applications = [];

      snapshot.forEach((doc) => {
        applications.push({
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt?.toDate?.().toISOString() || null,
          lastUpdatedAt: doc.data().lastUpdatedAt?.toDate?.().toISOString() || null,
        });
      });

      applications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

      return res.status(200).json({ applications, count: applications.length });
    } catch (error) {
      console.error('Error fetching applications:', error);
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }
  });
});

const updateApplicationStatus = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res);
      if (!decodedToken) {
        return;
      }

      const { applicationId, status, note } = req.body;

      if (!applicationId || !status) {
        return res.status(400).json({ error: 'Application ID and status are required' });
      }

      const applicationRef = admin.firestore().collection('applications').doc(applicationId);
      const applicationDoc = await applicationRef.get();

      if (!applicationDoc.exists) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const updateData = {
        status,
        lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        reviewedBy: {
          uid: decodedToken.uid,
          name: decodedToken.name || decodedToken.email || 'Admin',
          email: decodedToken.email,
        },
      };

      if (note) {
        const noteData = {
          by: decodedToken.name || decodedToken.email || 'Admin',
          content: escapeHtml(note),
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };
        updateData.notes = admin.firestore.FieldValue.arrayUnion(noteData);
      }

      await applicationRef.update(updateData);

      return res.status(200).json({ message: 'Application status updated successfully' });
    } catch (error) {
      console.error('Error updating application status:', error);
      return res.status(500).json({ error: 'Failed to update application status' });
    }
  });
});

module.exports = {
  submitApplication,
  getApplications,
  updateApplicationStatus,
};