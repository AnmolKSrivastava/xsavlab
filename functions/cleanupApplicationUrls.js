const admin = require('firebase-admin');

// Initialize Firebase Admin with project ID
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'xsavlab'
  });
}

const db = admin.firestore();

// Function to unescape HTML entities
function unescapeHtml(text) {
  if (!text) return text;
  
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '='
  };
  
  return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity);
}

async function cleanupApplicationUrls() {
  try {
    console.log('🔧 Starting cleanup of application URLs...\n');

    // Get all applications
    const applicationsSnapshot = await db.collection('applications').get();
    
    if (applicationsSnapshot.empty) {
      console.log('No applications found.');
      return;
    }

    console.log(`Found ${applicationsSnapshot.size} applications to check.\n`);

    let updatedCount = 0;
    const batch = db.batch();

    applicationsSnapshot.forEach((doc) => {
      const data = doc.data();
      let needsUpdate = false;
      const updates = {};

      // Check and fix portfolioUrl
      if (data.portfolioUrl && data.portfolioUrl.includes('&#x')) {
        const cleanUrl = unescapeHtml(data.portfolioUrl);
        updates.portfolioUrl = cleanUrl;
        needsUpdate = true;
        console.log(`📝 Cleaning portfolioUrl for ${data.applicantName}:`);
        console.log(`   Before: ${data.portfolioUrl}`);
        console.log(`   After:  ${cleanUrl}\n`);
      }

      // Check and fix linkedInUrl
      if (data.linkedInUrl && data.linkedInUrl.includes('&#x')) {
        const cleanUrl = unescapeHtml(data.linkedInUrl);
        updates.linkedInUrl = cleanUrl;
        needsUpdate = true;
        console.log(`📝 Cleaning linkedInUrl for ${data.applicantName}:`);
        console.log(`   Before: ${data.linkedInUrl}`);
        console.log(`   After:  ${cleanUrl}\n`);
      }

      if (needsUpdate) {
        batch.update(doc.ref, updates);
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Successfully cleaned ${updatedCount} application(s)!\n`);
    } else {
      console.log('✅ No applications needed cleaning. All URLs are clean!\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning up applications:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupApplicationUrls();
