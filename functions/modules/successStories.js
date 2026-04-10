const { onRequest } = require('firebase-functions/v2/https');
const { admin } = require('../lib/firebase');
const { cors, ensureMethod } = require('../lib/http');
const { requireAdmin, verifyBearerToken, hasRole } = require('../lib/auth');
const { escapeHtml } = require('../lib/content');

const getSuccessStories = onRequest((req, res) => {
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

      let query = admin.firestore().collection('successStories');

      if (!isAdmin) {
        query = query.where('status', '==', 'live');
      }

      const snapshot = await query.limit(isAdmin ? 500 : 100).get();
      const stories = [];

      snapshot.forEach((doc) => {
        stories.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      stories.sort((a, b) => {
        if (a.featured !== b.featured) {
          return b.featured ? 1 : -1;
        }

        return (a.order || 0) - (b.order || 0);
      });

      return res.status(200).json({ stories });
    } catch (error) {
      console.error('Error fetching success stories:', error);
      return res.status(500).json({ error: 'Failed to fetch success stories' });
    }
  });
});

const createSuccessStory = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res, ['admin', 'superadmin']);
      if (!decodedToken) {
        return;
      }

      const {
        company,
        industry,
        challenge,
        solution,
        results,
        clientName,
        clientRole,
        clientCompany,
        testimonial,
        status,
        order,
        featured,
      } = req.body;

      if (!company || !industry || !challenge || !solution) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const storyData = {
        company: escapeHtml(company),
        industry: escapeHtml(industry),
        challenge: escapeHtml(challenge),
        solution: escapeHtml(solution),
        results: results || [],
        clientName: clientName ? escapeHtml(clientName) : '',
        clientRole: clientRole ? escapeHtml(clientRole) : '',
        clientCompany: clientCompany ? escapeHtml(clientCompany) : '',
        testimonial: testimonial ? escapeHtml(testimonial) : '',
        status: status || 'draft',
        order: order || 0,
        featured: featured || false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: decodedToken.uid,
        createdByEmail: decodedToken.email,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: decodedToken.uid,
        updatedByEmail: decodedToken.email,
      };

      const docRef = await admin.firestore().collection('successStories').add(storyData);

      console.log(`Success story created by ${decodedToken.email}: ${docRef.id}`);
      return res.status(201).json({
        message: 'Success story created successfully',
        id: docRef.id,
      });
    } catch (error) {
      console.error('Error creating success story:', error);
      return res.status(500).json({ error: 'Failed to create success story' });
    }
  });
});

const updateSuccessStory = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, ['PUT', 'PATCH'])) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res, ['admin', 'superadmin']);
      if (!decodedToken) {
        return;
      }

      const { storyId, updates } = req.body;

      if (!storyId) {
        return res.status(400).json({ error: 'Story ID is required' });
      }

      const storyRef = admin.firestore().collection('successStories').doc(storyId);
      const storyDoc = await storyRef.get();

      if (!storyDoc.exists) {
        return res.status(404).json({ error: 'Success story not found' });
      }

      const updateData = { ...updates };
      if (updateData.company) updateData.company = escapeHtml(updateData.company);
      if (updateData.industry) updateData.industry = escapeHtml(updateData.industry);
      if (updateData.challenge) updateData.challenge = escapeHtml(updateData.challenge);
      if (updateData.solution) updateData.solution = escapeHtml(updateData.solution);
      if (updateData.clientName) updateData.clientName = escapeHtml(updateData.clientName);
      if (updateData.clientRole) updateData.clientRole = escapeHtml(updateData.clientRole);
      if (updateData.clientCompany) updateData.clientCompany = escapeHtml(updateData.clientCompany);
      if (updateData.testimonial) updateData.testimonial = escapeHtml(updateData.testimonial);

      updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
      updateData.updatedBy = decodedToken.uid;
      updateData.updatedByEmail = decodedToken.email;

      await storyRef.update(updateData);

      console.log(`Success story updated by ${decodedToken.email}: ${storyId}`);
      return res.status(200).json({ message: 'Success story updated successfully' });
    } catch (error) {
      console.error('Error updating success story:', error);
      return res.status(500).json({ error: 'Failed to update success story' });
    }
  });
});

const deleteSuccessStory = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, ['DELETE', 'POST'])) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res, ['superadmin']);
      if (!decodedToken) {
        return;
      }

      const storyId = req.body.storyId || req.query.storyId;

      if (!storyId) {
        return res.status(400).json({ error: 'Story ID is required' });
      }

      const storyRef = admin.firestore().collection('successStories').doc(storyId);
      const storyDoc = await storyRef.get();

      if (!storyDoc.exists) {
        return res.status(404).json({ error: 'Success story not found' });
      }

      await storyRef.delete();

      console.log(`Success story deleted by ${decodedToken.email}: ${storyId}`);
      return res.status(200).json({ message: 'Success story deleted successfully' });
    } catch (error) {
      console.error('Error deleting success story:', error);
      return res.status(500).json({ error: 'Failed to delete success story' });
    }
  });
});

module.exports = {
  getSuccessStories,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
};