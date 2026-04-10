const { onRequest } = require('firebase-functions/v2/https');
const { admin } = require('../lib/firebase');
const { cors, ensureMethod } = require('../lib/http');
const { requireAdmin, requireAuth, verifyBearerToken, hasRole } = require('../lib/auth');
const { escapeHtml } = require('../lib/content');

const submitReview = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const decodedToken = await requireAuth(req, res);
      if (!decodedToken) {
        return;
      }

      const {
        clientName,
        clientRole,
        clientCompany,
        content,
        rating,
      } = req.body;

      if (!clientName || !content || !rating) {
        return res.status(400).json({ error: 'Missing required fields: clientName, content, rating' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      const reviewData = {
        clientName: escapeHtml(clientName),
        clientRole: clientRole ? escapeHtml(clientRole) : '',
        clientCompany: clientCompany ? escapeHtml(clientCompany) : '',
        content: escapeHtml(content),
        rating: parseInt(rating, 10),
        status: 'pending',
        featured: false,
        order: 0,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        submittedBy: decodedToken.uid,
        submittedByEmail: decodedToken.email,
        approvedAt: null,
        approvedBy: null,
        approvedByEmail: null,
      };

      const docRef = await admin.firestore().collection('reviews').add(reviewData);

      console.log(`Review submitted by ${decodedToken.email}: ${docRef.id}`);
      return res.status(201).json({
        message: 'Review submitted successfully and is pending approval',
        id: docRef.id,
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      return res.status(500).json({ error: 'Failed to submit review' });
    }
  });
});

const getReviews = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'GET')) {
      return;
    }

    try {
      let isAdmin = false;

      try {
        const decodedToken = await verifyBearerToken(req);
        isAdmin = hasRole(decodedToken, ['admin', 'superadmin']);
      } catch (authError) {
        console.log('Auth verification failed, treating as public user');
      }

      let query = admin.firestore().collection('reviews');

      if (!isAdmin) {
        query = query.where('status', '==', 'approved');
      }

      const snapshot = await query.limit(isAdmin ? 500 : 100).get();
      const reviews = [];

      snapshot.forEach((doc) => {
        reviews.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      reviews.sort((a, b) => {
        if (a.featured !== b.featured) {
          return b.featured ? 1 : -1;
        }
        if ((a.order || 0) !== (b.order || 0)) {
          return (a.order || 0) - (b.order || 0);
        }
        return (b.rating || 0) - (a.rating || 0);
      });

      return res.status(200).json({ reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });
});

const approveReview = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, ['POST', 'PUT'])) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res, ['admin', 'superadmin']);
      if (!decodedToken) {
        return;
      }

      const { reviewId } = req.body;

      if (!reviewId) {
        return res.status(400).json({ error: 'Review ID is required' });
      }

      const reviewRef = admin.firestore().collection('reviews').doc(reviewId);
      const reviewDoc = await reviewRef.get();

      if (!reviewDoc.exists) {
        return res.status(404).json({ error: 'Review not found' });
      }

      await reviewRef.update({
        status: 'approved',
        approvedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: decodedToken.uid,
        approvedByEmail: decodedToken.email,
      });

      console.log(`Review approved by ${decodedToken.email}: ${reviewId}`);
      return res.status(200).json({ message: 'Review approved successfully' });
    } catch (error) {
      console.error('Error approving review:', error);
      return res.status(500).json({ error: 'Failed to approve review' });
    }
  });
});

const updateReview = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, ['PUT', 'PATCH'])) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res, ['admin', 'superadmin']);
      if (!decodedToken) {
        return;
      }

      const { reviewId, updates } = req.body;

      if (!reviewId) {
        return res.status(400).json({ error: 'Review ID is required' });
      }

      const reviewRef = admin.firestore().collection('reviews').doc(reviewId);
      const reviewDoc = await reviewRef.get();

      if (!reviewDoc.exists) {
        return res.status(404).json({ error: 'Review not found' });
      }

      const updateData = { ...updates };
      if (updateData.clientName) updateData.clientName = escapeHtml(updateData.clientName);
      if (updateData.clientRole) updateData.clientRole = escapeHtml(updateData.clientRole);
      if (updateData.clientCompany) updateData.clientCompany = escapeHtml(updateData.clientCompany);
      if (updateData.content) updateData.content = escapeHtml(updateData.content);

      if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      updateData.lastUpdatedAt = admin.firestore.FieldValue.serverTimestamp();
      updateData.lastUpdatedBy = decodedToken.uid;
      updateData.lastUpdatedByEmail = decodedToken.email;

      await reviewRef.update(updateData);

      console.log(`Review updated by ${decodedToken.email}: ${reviewId}`);
      return res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
      console.error('Error updating review:', error);
      return res.status(500).json({ error: 'Failed to update review' });
    }
  });
});

const deleteReview = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, ['DELETE', 'POST'])) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res, ['superadmin']);
      if (!decodedToken) {
        return;
      }

      const reviewId = req.body.reviewId || req.query.reviewId;

      if (!reviewId) {
        return res.status(400).json({ error: 'Review ID is required' });
      }

      const reviewRef = admin.firestore().collection('reviews').doc(reviewId);
      const reviewDoc = await reviewRef.get();

      if (!reviewDoc.exists) {
        return res.status(404).json({ error: 'Review not found' });
      }

      await reviewRef.delete();

      console.log(`Review deleted by ${decodedToken.email}: ${reviewId}`);
      return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      return res.status(500).json({ error: 'Failed to delete review' });
    }
  });
});

module.exports = {
  submitReview,
  getReviews,
  approveReview,
  updateReview,
  deleteReview,
};