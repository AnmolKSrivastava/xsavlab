const { onRequest } = require('firebase-functions/v2/https');
const { admin } = require('../lib/firebase');
const { cors, ensureMethod } = require('../lib/http');
const { requireAdmin, verifyBearerToken } = require('../lib/auth');
const { escapeHtml } = require('../lib/content');

const VENTURE_ID_RE = /^[a-zA-Z0-9_-]{1,50}$/;

async function resolveVentureId(ventureId, res) {
  if (!VENTURE_ID_RE.test(ventureId)) {
    res.status(400).json({ error: 'Invalid venture ID format' });
    return false;
  }
  const doc = await admin.firestore().collection('ventures').doc(ventureId).get();
  if (!doc.exists) {
    res.status(404).json({ error: 'Venture not found' });
    return false;
  }
  return true;
}

const createVenture = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res, ['admin', 'superadmin']);
      if (!decodedToken) {
        return;
      }

      const ventureData = req.body;

      if (!ventureData.name || !ventureData.slug) {
        return res.status(400).json({ error: 'Name and slug are required' });
      }

      const existingVenture = await admin.firestore()
        .collection('ventures')
        .where('slug', '==', ventureData.slug)
        .get();

      if (!existingVenture.empty) {
        return res.status(400).json({ error: 'A venture with this slug already exists' });
      }

      const safeData = {
        name: escapeHtml(String(ventureData.name)),
        slug: String(ventureData.slug).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 100),
        tagline: ventureData.tagline ? escapeHtml(String(ventureData.tagline)) : '',
        description: ventureData.description ? escapeHtml(String(ventureData.description)) : '',
        category: ventureData.category ? escapeHtml(String(ventureData.category)) : '',
        status: ['live', 'draft', 'archived'].includes(ventureData.status) ? ventureData.status : 'draft',
        order: Number.isFinite(Number(ventureData.order)) ? Number(ventureData.order) : 0,
        featured: ventureData.featured === true,
        logoUrl: ventureData.logoUrl ? String(ventureData.logoUrl).slice(0, 2000) : '',
        featuredImageUrl: ventureData.featuredImageUrl ? String(ventureData.featuredImageUrl).slice(0, 2000) : '',
        websiteUrl: ventureData.websiteUrl ? String(ventureData.websiteUrl).slice(0, 2000) : '',
        tags: Array.isArray(ventureData.tags) ? ventureData.tags.map((t) => escapeHtml(String(t))).slice(0, 20) : [],
      };

      const ventureRef = await admin.firestore().collection('ventures').add({
        ...safeData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: decodedToken.uid,
        createdByEmail: decodedToken.email,
        views: 0,
        clicks: 0,
      });

      console.log(`Venture created: ${ventureData.name} by ${decodedToken.email}`);
      return res.status(200).json({
        message: 'Venture created successfully',
        ventureId: ventureRef.id,
      });
    } catch (error) {
      console.error('Error creating venture:', error);
      return res.status(500).json({ error: 'Failed to create venture' });
    }
  });
});

const updateVenture = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res, ['admin', 'superadmin']);
      if (!decodedToken) {
        return;
      }

      const { ventureId, ...updateData } = req.body;

      if (!ventureId) {
        return res.status(400).json({ error: 'Venture ID is required' });
      }

      const safeUpdates = {};
      if (updateData.name !== undefined) safeUpdates.name = escapeHtml(String(updateData.name));
      if (updateData.tagline !== undefined) safeUpdates.tagline = escapeHtml(String(updateData.tagline));
      if (updateData.description !== undefined) safeUpdates.description = escapeHtml(String(updateData.description));
      if (updateData.category !== undefined) safeUpdates.category = escapeHtml(String(updateData.category));
      if (updateData.status !== undefined && ['live', 'draft', 'archived'].includes(updateData.status)) safeUpdates.status = updateData.status;
      if (updateData.order !== undefined && Number.isFinite(Number(updateData.order))) safeUpdates.order = Number(updateData.order);
      if (updateData.featured !== undefined) safeUpdates.featured = updateData.featured === true;
      if (updateData.logoUrl !== undefined) safeUpdates.logoUrl = String(updateData.logoUrl).slice(0, 2000);
      if (updateData.featuredImageUrl !== undefined) safeUpdates.featuredImageUrl = String(updateData.featuredImageUrl).slice(0, 2000);
      if (updateData.websiteUrl !== undefined) safeUpdates.websiteUrl = String(updateData.websiteUrl).slice(0, 2000);
      if (updateData.tags !== undefined) safeUpdates.tags = Array.isArray(updateData.tags) ? updateData.tags.map((t) => escapeHtml(String(t))).slice(0, 20) : [];

      await admin.firestore().collection('ventures').doc(ventureId).update({
        ...safeUpdates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastEditedBy: decodedToken.uid,
      });

      console.log(`Venture ${ventureId} updated by ${decodedToken.email}`);
      return res.status(200).json({ message: 'Venture updated successfully' });
    } catch (error) {
      console.error('Error updating venture:', error);
      return res.status(500).json({ error: 'Failed to update venture' });
    }
  });
});

const deleteVenture = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'DELETE')) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res, ['superadmin']);
      if (!decodedToken) {
        return;
      }

      const { ventureId } = req.body;

      if (!ventureId) {
        return res.status(400).json({ error: 'Venture ID is required' });
      }

      await admin.firestore().collection('ventures').doc(ventureId).delete();

      console.log(`Venture ${ventureId} deleted by ${decodedToken.email}`);
      return res.status(200).json({ message: 'Venture deleted successfully' });
    } catch (error) {
      console.error('Error deleting venture:', error);
      return res.status(500).json({ error: 'Failed to delete venture' });
    }
  });
});

const getVentures = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'GET')) {
      return;
    }

    try {
      let venturesQuery = admin.firestore().collection('ventures');
      let isAdmin = false;

      try {
        const decodedToken = await verifyBearerToken(req);
        isAdmin = decodedToken?.admin === true;
      } catch (error) {
        isAdmin = false;
      }

      if (!isAdmin) {
        venturesQuery = venturesQuery.where('status', '==', 'live');
      }

      venturesQuery = venturesQuery.orderBy('order', 'asc').limit(isAdmin ? 500 : 100);

      const snapshot = await venturesQuery.get();
      const ventures = [];

      snapshot.forEach((doc) => {
        ventures.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return res.status(200).json({ ventures });
    } catch (error) {
      console.error('Error getting ventures:', error);
      return res.status(500).json({ error: 'Failed to get ventures' });
    }
  });
});

const trackVentureView = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const { ventureId } = req.body;

      if (!ventureId) {
        return res.status(400).json({ error: 'Venture ID is required' });
      }

      const exists = await resolveVentureId(ventureId, res);
      if (!exists) return;

      await admin.firestore().collection('ventures').doc(ventureId).update({
        views: admin.firestore.FieldValue.increment(1),
      });

      return res.status(200).json({ message: 'View tracked' });
    } catch (error) {
      console.error('Error tracking view:', error);
      return res.status(200).json({ message: 'View tracking failed silently' });
    }
  });
});

const trackVentureClick = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const { ventureId } = req.body;

      if (!ventureId) {
        return res.status(400).json({ error: 'Venture ID is required' });
      }

      const exists = await resolveVentureId(ventureId, res);
      if (!exists) return;

      await admin.firestore().collection('ventures').doc(ventureId).update({
        clicks: admin.firestore.FieldValue.increment(1),
      });

      return res.status(200).json({ message: 'Click tracked' });
    } catch (error) {
      console.error('Error tracking click:', error);
      return res.status(200).json({ message: 'Click tracking failed silently' });
    }
  });
});

module.exports = {
  createVenture,
  updateVenture,
  deleteVenture,
  getVentures,
  trackVentureView,
  trackVentureClick,
};