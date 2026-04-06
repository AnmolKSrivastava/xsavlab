/**
 * Setup Site Settings - One-time Script
 * Initializes default site statistics in Firestore
 * Run with: node setup-site-settings.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin (using default credentials)
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

// Default site settings
const defaultSettings = {
  statistics: {
    foundedYear: 2018,
    clientsServed: 500,
    industries: 25,
    clientSatisfaction: 99.9,
    successRate: 99.8,
    organizations: 500,
  },
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function setupSiteSettings() {
  try {
    console.log('Setting up default site settings...');
    
    // Check if settings already exist
    const settingsDoc = await db.collection('siteSettings').doc('statistics').get();
    
    if (settingsDoc.exists) {
      console.log('⚠️  Site settings already exist!');
      console.log('Current settings:', settingsDoc.data());
      console.log('\nTo update, use the Admin Dashboard or manually edit in Firestore Console.');
      return;
    }

    // Create default settings
    await db.collection('siteSettings').doc('statistics').set(defaultSettings);
    
    console.log('✅ Site settings initialized successfully!');
    console.log('Default statistics:', defaultSettings.statistics);
    console.log('\nYou can now edit these values through the Admin Dashboard > Site Settings tab.');
    
  } catch (error) {
    console.error('❌ Error setting up site settings:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the setup
setupSiteSettings();
