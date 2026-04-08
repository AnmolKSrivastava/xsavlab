const { onRequest } = require('firebase-functions/v2/https');
const { admin } = require('../lib/firebase');
const { cors, ensureMethod } = require('../lib/http');
const { requireAdmin, verifyBearerToken } = require('../lib/auth');

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

      const ventureRef = await admin.firestore().collection('ventures').add({
        ...ventureData,
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

      await admin.firestore().collection('ventures').doc(ventureId).update({
        ...updateData,
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

      venturesQuery = venturesQuery.orderBy('order', 'asc');

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