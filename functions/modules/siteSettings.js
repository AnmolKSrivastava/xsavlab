const { onRequest } = require('firebase-functions/v2/https');
const { admin } = require('../lib/firebase');
const { cors, ensureMethod } = require('../lib/http');
const { requireAdmin } = require('../lib/auth');

const getDefaultSiteSettings = () => ({
  statistics: {
    foundedYear: 2018,
    clientsServed: 500,
    industries: 25,
    clientSatisfaction: 99.9,
    successRate: 99.8,
    organizations: 500,
    threatDetection: 99.9,
    yearsExperience: 15,
    deploymentWeeks: '2-4',
    projectSuccessRate: 98,
    supportCoverage: '24/7',
    successfulProjects: 500,
    cloudCostReduction: 40,
  },
  caseStudies: {
    finserve: {
      threatReduction: 92,
      fasterResponse: 65,
      complianceAchieved: 100,
    },
    retailmax: {
      costSavings: 42,
      uptimeSLA: 99.9,
      performanceBoost: 3,
    },
    healthtech: {
      queriesAutomated: 80,
      responseTimeCut: 50,
      patientSatisfaction: 4.8,
    },
  },
});

const getSiteSettings = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'GET')) {
      return;
    }

    try {
      const settingsDoc = await admin.firestore()
        .collection('siteSettings')
        .doc('statistics')
        .get();

      if (!settingsDoc.exists) {
        return res.status(200).json(getDefaultSiteSettings());
      }

      return res.status(200).json(settingsDoc.data());
    } catch (error) {
      console.error('Error getting site settings:', error);
      return res.status(500).json({ error: 'Failed to get site settings' });
    }
  });
});

const updateSiteSettings = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, ['PUT', 'POST'])) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res, ['admin', 'superadmin']);
      if (!decodedToken) {
        return;
      }

      const updates = req.body;
      const settingsData = {
        ...updates,
        lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdatedBy: decodedToken.uid,
        lastUpdatedByEmail: decodedToken.email,
      };

      await admin.firestore()
        .collection('siteSettings')
        .doc('statistics')
        .set(settingsData, { merge: true });

      console.log(`Site settings updated by ${decodedToken.email}`);
      return res.status(200).json({ message: 'Site settings updated successfully' });
    } catch (error) {
      console.error('Error updating site settings:', error);
      return res.status(500).json({ error: 'Failed to update site settings' });
    }
  });
});

module.exports = {
  getSiteSettings,
  updateSiteSettings,
};