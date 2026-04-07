const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Configure CORS with whitelist of allowed origins
const allowedOrigins = [
  'https://xsavlab.web.app',
  'https://xsavlab.firebaseapp.com',
  'https://xsavlab.com',
  'https://www.xsavlab.com',
  'http://localhost:3000',
  'http://localhost:5000',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Reject requests with no origin (except for same-origin requests)
    if (!origin) {
      console.warn('CORS blocked: No origin header');
      return callback(new Error('Not allowed by CORS'));
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const cors = require('cors')(corsOptions);

const EMAIL_USER = defineSecret('EMAIL_USER');
const EMAIL_PASSWORD = defineSecret('EMAIL_PASSWORD');
const ADMIN_EMAIL = defineSecret('ADMIN_EMAIL');

// Initialize Firebase Admin
admin.initializeApp();

/**
 * HTML escape helper to prevent XSS attacks in emails
 * @param {string} text - Text to escape
 * @returns {string} - HTML-safe text
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };
  return String(text).replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Rate limiting helper - checks if IP/email has exceeded submission limits
 * @param {string} identifier - IP address or email to check
 * @returns {Promise<boolean>} - true if rate limit exceeded
 */
async function checkRateLimit(identifier) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Check submissions in last hour (max 3)
  const recentSubmissions = await admin
    .firestore()
    .collection('enquiries')
    .where('ipAddress', '==', identifier)
    .where('createdAt', '>', oneHourAgo)
    .get();

  if (recentSubmissions.size >= 3) {
    return true; // Rate limit exceeded
  }

  // Check submissions in last 24 hours (max 10)
  const dailySubmissions = await admin
    .firestore()
    .collection('enquiries')
    .where('ipAddress', '==', identifier)
    .where('createdAt', '>', oneDayAgo)
    .get();

  if (dailySubmissions.size >= 10) {
    return true; // Rate limit exceeded
  }

  return false; // Rate limit OK
}

/**
 * Cloud Function: Handle contact form submissions
 * Receives enquiry data and sends confirmation email to user
 */
exports.sendEnquiry = onRequest({ 
  secrets: [EMAIL_USER, EMAIL_PASSWORD, ADMIN_EMAIL],
  maxInstances: 10,
  memory: '256MiB',
  timeoutSeconds: 60,
}, (req, res) => {
  cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check request body size (limit to 10KB)
    const bodySize = JSON.stringify(req.body).length;
    if (bodySize > 10240) {
      return res.status(413).json({ error: 'Request payload too large' });
    }

    try {
      const { name, email, company, service, message } = req.body;

      // Validate required fields
      if (!name || !email || !service || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Validate input lengths
      if (name.length > 100) {
        return res.status(400).json({ error: 'Name must be less than 100 characters' });
      }
      if (email.length > 255) {
        return res.status(400).json({ error: 'Email must be less than 255 characters' });
      }
      if (company && company.length > 200) {
        return res.status(400).json({ error: 'Company name must be less than 200 characters' });
      }
      if (message.length > 5000) {
        return res.status(400).json({ error: 'Message must be less than 5000 characters' });
      }
      if (service.length > 50) {
        return res.status(400).json({ error: 'Invalid service selection' });
      }

      // Rate limiting check
      const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const isRateLimited = await checkRateLimit(clientIp);
      
      if (isRateLimited) {
        console.warn('Rate limit exceeded for IP:', clientIp);
        return res.status(429).json({ 
          error: 'Too many requests. Please try again later.' 
        });
      }

      // Store enquiry in Firestore
      const enquiryData = {
        name,
        email,
        company: company || 'Not provided',
        service,
        message,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'new',
        ipAddress: clientIp,
      };

      const enquiryRef = await admin
        .firestore()
        .collection('enquiries')
        .add(enquiryData);

      console.log('Enquiry stored with ID:', enquiryRef.id);

      // Try to send emails (optional - won't fail if secrets not configured)
      let emailsSent = false;
      try {
        // Configure transporter per request to read secret values at runtime.
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: EMAIL_USER.value(),
            pass: EMAIL_PASSWORD.value(),
          },
        });

        const fromEmail = EMAIL_USER.value();
        const adminEmail = ADMIN_EMAIL.value();

        // Sanitize user inputs for email
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeCompany = escapeHtml(company || 'Not provided');
        const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

        // Send confirmation email to user
        const userMailOptions = {
          from: `"XSavLab" <${fromEmail}>`,
          to: email,
          subject: 'We Received Your Enquiry - XSavLab',
          html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); 
                         color: white; padding: 30px; border-radius: 8px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                .highlight { color: #667EEA; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank You for Your Enquiry!</h1>
                </div>
                
                <div class="content">
                  <p>Hi <span class="highlight">${safeName}</span>,</p>
                  
                  <p>We have received your enquiry and appreciate your interest in XSavLab's services.</p>
                  
                  <h3>Your Enquiry Details:</h3>
                  <ul>
                    <li><strong>Name:</strong> ${safeName}</li>
                    <li><strong>Email:</strong> ${safeEmail}</li>
                    <li><strong>Company:</strong> ${safeCompany}</li>
                    <li><strong>Service Interest:</strong> ${formatServiceName(service)}</li>
                  </ul>
                  
                  <p><strong>Your Message:</strong></p>
                  <p style="background: white; padding: 15px; border-left: 4px solid #667EEA; border-radius: 4px;">
                    ${safeMessage}
                  </p>
                  
                  <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                  
                  <p>Our security experts will review your enquiry and get back to you <strong>within 24 hours</strong>.</p>
                  
                  <p>If you have any urgent questions, feel free to contact us at:</p>
                  <ul>
                    <li>Email: <span class="highlight">contact@xsavlab.com</span></li>
                    <li>Phone: <span class="highlight">+1 (555) 123-4567</span></li>
                  </ul>
                  
                  <p>Best regards,<br>
                  <strong>The XSavLab Team</strong><br>
                  Securing Your Digital Future
                  </p>
                </div>
                
                <div class="footer">
                  <p>&copy; 2026 XSavLab. All rights reserved.</p>
                  <p>This is an automated response. Please do not reply to this email.</p>
                </div>
              </div>
            </body>
          </html>
        `,
        };

        // Send admin notification email
        const adminMailOptions = {
          from: `"XSavLab" <${fromEmail}>`,
          to: adminEmail || 'admin@xsavlab.com',
          subject: `New Enquiry: ${safeName} - ${formatServiceName(service)}`,
          html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #667EEA; color: white; padding: 20px; border-radius: 8px; }
                .details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #667EEA; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>New Enquiry Received</h2>
                </div>
                
                <div class="details">
                  <div class="field">
                    <span class="label">Enquiry ID:</span> ${enquiryRef.id}
                  </div>
                  <div class="field">
                    <span class="label">Name:</span> ${safeName}
                  </div>
                  <div class="field">
                    <span class="label">Email:</span> <a href="mailto:${email}">${safeEmail}</a>
                  </div>
                  <div class="field">
                    <span class="label">Company:</span> ${safeCompany}
                  </div>
                  <div class="field">
                    <span class="label">Service:</span> ${formatServiceName(service)}
                  </div>
                  <div class="field">
                    <span class="label">Message:</span>
                    <p style="background: white; padding: 15px; border-left: 4px solid #667EEA;">
                      ${safeMessage}
                    </p>
                  </div>
                  <div class="field">
                    <span class="label">Timestamp:</span> ${new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        };

        // Send both emails
        await Promise.all([
          transporter.sendMail(userMailOptions),
          transporter.sendMail(adminMailOptions),
        ]);

        console.log('Emails sent successfully for enquiry:', enquiryRef.id);
        emailsSent = true;

      } catch (emailError) {
        // Email sending failed (likely due to missing secrets)
        // This is non-critical - enquiry is already stored in Firestore
        console.error('Email sending failed (non-critical):', emailError.message);
        console.log('Enquiry saved to Firestore but emails not sent. Configure EMAIL_USER, EMAIL_PASSWORD, and ADMIN_EMAIL secrets to enable email notifications.');
      }

      // Return success response
      return res.status(200).json({
        success: true,
        message: emailsSent 
          ? 'Enquiry received successfully. Confirmation email sent.'
          : 'Enquiry received successfully. Email notifications are not configured.',
        enquiryId: enquiryRef.id,
        emailsSent,
      });
    } catch (error) {
      console.error('Error processing enquiry:', error);
      return res.status(500).json({
        error: 'Failed to process enquiry. Please try again later.',
      });
    }
  });
});

/**
 * Helper function to format service name
 */
function formatServiceName(service) {
  const serviceNames = {
    cybersecurity: 'Cybersecurity Services',
    cloud: 'Cloud Infrastructure',
    ai: 'AI Integration Services',
    website: 'Custom Website Development',
    software: 'Enterprise Software Solutions',
    consulting: 'General Consulting',
  };
  return serviceNames[service] || service;
}

/**
 * Cloud Function: Get all enquiries (for admin dashboard)
 * Protected endpoint - requires admin access
 */
exports.getEnquiries = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Check for authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
      }

      // Extract the token
      const token = authHeader.split('Bearer ')[1];
      
      // Verify the Firebase ID token
      let decodedToken;
      try {
        decodedToken = await admin.auth().verifyIdToken(token);
      } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
      }

      // Check if user is admin by looking up admin document
      const adminDoc = await admin
        .firestore()
        .collection('admins')
        .doc(decodedToken.uid)
        .get();

      if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
        console.warn('Non-admin user attempted to access enquiries:', decodedToken.uid);
        return res.status(403).json({ error: 'Forbidden - Admin access required' });
      }

      // Retrieve enquiries from Firestore
      const snapshot = await admin
        .firestore()
        .collection('enquiries')
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();

      const enquiries = [];
      snapshot.forEach((doc) => {
        enquiries.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return res.status(200).json({ enquiries });
    } catch (error) {
      console.error('Error retrieving enquiries:', error);
      return res.status(500).json({ error: 'Failed to retrieve enquiries' });
    }
  });
});

/**
 * Cloud Function: Set admin custom claims
 * Protected endpoint - only existing admins can create new admins
 * This is a one-time setup function to create your first admin user
 * 
 * Usage: After creating a user in Firebase Console, call this function with their email
 */
exports.setAdminRole = onRequest((req, res) => {
  cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // SECURITY: Only authenticated admins can create new admins
      // The initial admin should be created manually via Firebase Console
      
      // Verify the requesting user is an admin
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
      }

      const token = authHeader.split('Bearer ')[1];
      let decodedToken;
      
      try {
        decodedToken = await admin.auth().verifyIdToken(token);
      } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
      }

      // Check if requesting user has admin privileges
      if (decodedToken.admin !== true) {
        console.warn('Non-admin user attempted to set admin role:', decodedToken.uid);
        return res.status(403).json({ error: 'Forbidden - Only admins can create other admins' });
      }

      // Get the user to be made admin
      const targetUser = await admin.auth().getUserByEmail(email);
      
      // Set custom claims
      await admin.auth().setCustomUserClaims(targetUser.uid, { admin: true });
      
      // Add to Firestore
      await admin.firestore().collection('admins').doc(targetUser.uid).set({
        email: targetUser.email,
        role: 'admin',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: decodedToken.uid,
      });
      
      console.log(`Admin ${decodedToken.email} granted admin role to: ${email}`);
      return res.status(200).json({ message: `Success! ${email} is now an admin.` });
      
    } catch (error) {
      console.error('Error setting admin role:', error);
      
      if (error.code === 'auth/user-not-found') {
        return res.status(404).json({ error: 'User not found. Please create the user first in Firebase Console.' });
      }
      
      return res.status(500).json({ error: 'Failed to set admin role' });
    }
  });
});

/**
 * Create Admin User
 * Creates a new Firebase Auth user with admin role and custom claims
 * Only Super Admins can create users
 */
exports.createAdminUser = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { email, password, displayName, role } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      if (!['superadmin', 'admin', 'moderator'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be: superadmin, admin, or moderator' });
      }

      // Verify requesting user is a super admin
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Only super admins can create users
      if (decodedToken.role !== 'superadmin') {
        return res.status(403).json({ error: 'Only super admins can create users' });
      }

      // Create the user
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: displayName || email.split('@')[0],
      });

      // Set custom claims
      await admin.auth().setCustomUserClaims(userRecord.uid, {
        admin: true,
        role: role,
      });

      // Store user profile in Firestore
      await admin.firestore().collection('users').doc(userRecord.uid).set({
        email: userRecord.email,
        displayName: userRecord.displayName,
        role: role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: decodedToken.uid,
        createdByEmail: decodedToken.email,
        status: 'active',
      });

      console.log(`Super admin ${decodedToken.email} created user: ${email} with role: ${role}`);
      return res.status(200).json({
        message: 'User created successfully',
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          role: role,
        },
      });

    } catch (error) {
      console.error('Error creating admin user:', error);
      
      if (error.code === 'auth/email-already-exists') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (error.code === 'auth/invalid-email') {
        return res.status(400).json({ error: 'Invalid email address' });
      }
      if (error.code === 'auth/weak-password') {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      
      return res.status(500).json({ error: 'Failed to create user' });
    }
  });
});

/**
 * Update User Role
 * Updates an existing user's role and custom claims
 * Only Super Admins can update roles
 */
exports.updateUserRole = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { userId, role } = req.body;

      if (!userId || !role) {
        return res.status(400).json({ error: 'User ID and role are required' });
      }

      if (!['superadmin', 'admin', 'moderator'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      // Verify requesting user
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Only super admins can update roles
      if (decodedToken.role !== 'superadmin') {
        return res.status(403).json({ error: 'Only super admins can update user roles' });
      }

      // Prevent users from removing their own super admin status
      if (userId === decodedToken.uid && decodedToken.role === 'superadmin' && role !== 'superadmin') {
        return res.status(400).json({ error: 'Cannot remove your own super admin privileges' });
      }

      // Update custom claims
      await admin.auth().setCustomUserClaims(userId, {
        admin: true,
        role: role,
      });

      // Update Firestore
      await admin.firestore().collection('users').doc(userId).update({
        role: role,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: decodedToken.uid,
      });

      console.log(`User ${userId} role updated to: ${role} by ${decodedToken.email}`);
      return res.status(200).json({ message: 'Role updated successfully' });

    } catch (error) {
      console.error('Error updating user role:', error);
      return res.status(500).json({ error: 'Failed to update role' });
    }
  });
});

/**
 * List Admin Users
 * Returns all users with their roles
 * Super admins see all, regular admins see limited info
 */
exports.listAdminUsers = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify requesting user
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Only admins and super admins can view users
      if (!decodedToken.admin) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Get users from Firestore
      const usersSnapshot = await admin.firestore().collection('users').get();
      
      const users = [];
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        users.push({
          uid: doc.id,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          status: userData.status,
          createdAt: userData.createdAt,
          // Only show sensitive info to super admins
          ...(decodedToken.role === 'superadmin' && {
            createdBy: userData.createdBy,
            createdByEmail: userData.createdByEmail,
          }),
        });
      });

      return res.status(200).json({ users });

    } catch (error) {
      console.error('Error listing users:', error);
      return res.status(500).json({ error: 'Failed to list users' });
    }
  });
});

/**
 * Delete Admin User
 * Deletes a user from Firebase Auth and Firestore
 * Only Super Admins can delete users
 */
exports.deleteAdminUser = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Verify requesting user
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Only super admins can delete users
      if (decodedToken.role !== 'superadmin') {
        return res.status(403).json({ error: 'Only super admins can delete users' });
      }

      // Prevent users from deleting themselves
      if (userId === decodedToken.uid) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      // Delete from Firebase Auth
      await admin.auth().deleteUser(userId);

      // Delete from Firestore
      await admin.firestore().collection('users').doc(userId).delete();

      console.log(`User ${userId} deleted by ${decodedToken.email}`);
      return res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
      console.error('Error deleting user:', error);
      
      if (error.code === 'auth/user-not-found') {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  });
});

/**
 * Create Venture
 * Creates a new venture/product entry
 * Admins and Super Admins can create ventures
 */
exports.createVenture = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const ventureData = req.body;

      // Verify requesting user is an admin
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Only admins and super admins can create ventures
      if (!decodedToken.admin || !['admin', 'superadmin'].includes(decodedToken.role)) {
        return res.status(403).json({ error: 'Only admins can create ventures' });
      }

      // Validate required fields
      if (!ventureData.name || !ventureData.slug) {
        return res.status(400).json({ error: 'Name and slug are required' });
      }

      // Check if slug already exists
      const existingVenture = await admin.firestore()
        .collection('ventures')
        .where('slug', '==', ventureData.slug)
        .get();

      if (!existingVenture.empty) {
        return res.status(400).json({ error: 'A venture with this slug already exists' });
      }

      // Create venture document
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
        ventureId: ventureRef.id 
      });

    } catch (error) {
      console.error('Error creating venture:', error);
      return res.status(500).json({ error: 'Failed to create venture' });
    }
  });
});

/**
 * Update Venture
 * Updates an existing venture
 * Admins and Super Admins can update ventures
 */
exports.updateVenture = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { ventureId, ...updateData } = req.body;

      if (!ventureId) {
        return res.status(400).json({ error: 'Venture ID is required' });
      }

      // Verify requesting user
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Only admins and super admins can update ventures
      if (!decodedToken.admin || !['admin', 'superadmin'].includes(decodedToken.role)) {
        return res.status(403).json({ error: 'Only admins can update ventures' });
      }

      // Update venture
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

/**
 * Delete Venture
 * Deletes a venture (Super Admin only)
 */
exports.deleteVenture = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { ventureId } = req.body;

      if (!ventureId) {
        return res.status(400).json({ error: 'Venture ID is required' });
      }

      // Verify requesting user
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Only super admins can delete ventures
      if (decodedToken.role !== 'superadmin') {
        return res.status(403).json({ error: 'Only super admins can delete ventures' });
      }

      // Delete venture
      await admin.firestore().collection('ventures').doc(ventureId).delete();

      console.log(`Venture ${ventureId} deleted by ${decodedToken.email}`);
      return res.status(200).json({ message: 'Venture deleted successfully' });

    } catch (error) {
      console.error('Error deleting venture:', error);
      return res.status(500).json({ error: 'Failed to delete venture' });
    }
  });
});

/**
 * Get Ventures
 * Public function to retrieve ventures
 * Filters based on status for non-admin users
 */
exports.getVentures = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      let venturesQuery = admin.firestore().collection('ventures');

      // Check if user is admin
      let isAdmin = false;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split('Bearer ')[1];
          const decodedToken = await admin.auth().verifyIdToken(token);
          isAdmin = decodedToken.admin === true;
        } catch (error) {
          // Invalid token, continue as non-admin
        }
      }

      // Non-admins only see live ventures
      if (!isAdmin) {
        venturesQuery = venturesQuery.where('status', '==', 'live');
      }

      // Order by display order
      venturesQuery = venturesQuery.orderBy('order', 'asc');

      const snapshot = await venturesQuery.get();
      
      const ventures = [];
      snapshot.forEach(doc => {
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

/**
 * Track Venture View
 * Increments view count when someone visits a venture page
 */
exports.trackVentureView = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { ventureId } = req.body;

      if (!ventureId) {
        return res.status(400).json({ error: 'Venture ID is required' });
      }

      // Increment view count
      await admin.firestore().collection('ventures').doc(ventureId).update({
        views: admin.firestore.FieldValue.increment(1),
      });

      return res.status(200).json({ message: 'View tracked' });

    } catch (error) {
      console.error('Error tracking view:', error);
      // Don't fail the request if tracking fails
      return res.status(200).json({ message: 'View tracking failed silently' });
    }
  });
});

/**
 * Track Venture Click
 * Increments click count when someone clicks "Visit" link
 */
exports.trackVentureClick = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { ventureId } = req.body;

      if (!ventureId) {
        return res.status(400).json({ error: 'Venture ID is required' });
      }

      // Increment click count
      await admin.firestore().collection('ventures').doc(ventureId).update({
        clicks: admin.firestore.FieldValue.increment(1),
      });

      return res.status(200).json({ message: 'Click tracked' });

    } catch (error) {
      console.error('Error tracking click:', error);
      // Don't fail the request if tracking fails
      return res.status(200).json({ message: 'Click tracking failed silently' });
    }
  });
});

/**
 * Get Site Settings
 * Returns all site statistics and configurable content
 * Public endpoint - no authentication required
 */
exports.getSiteSettings = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const settingsDoc = await admin.firestore()
        .collection('siteSettings')
        .doc('statistics')
        .get();

      if (!settingsDoc.exists) {
        // Return default values if not yet configured
        return res.status(200).json({
          statistics: {
            // About Section
            foundedYear: 2018,
            clientsServed: 500,
            industries: 25,
            clientSatisfaction: 99.9,
            
            // Services/Trust Sections
            successRate: 99.8,
            organizations: 500,
            
            // Hero Section
            threatDetection: 99.9,
            yearsExperience: 15,
            
            // How It Works Section
            deploymentWeeks: '2-4',
            projectSuccessRate: 98,
            supportCoverage: '24/7',
            successfulProjects: 500,
            
            // AI Demo Section
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
      }

      return res.status(200).json(settingsDoc.data());

    } catch (error) {
      console.error('Error getting site settings:', error);
      return res.status(500).json({ error: 'Failed to get site settings' });
    }
  });
});

/**
 * Update Site Settings
 * Updates site statistics and configurable content
 * Only admins can update
 */
exports.updateSiteSettings = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'PUT' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const updates = req.body;

      // Verify requesting user is an admin
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin || !['admin', 'superadmin'].includes(decodedToken.role)) {
        return res.status(403).json({ error: 'Only admins can update site settings' });
      }

      // Update settings with metadata
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

// ============ SUCCESS STORIES / CASE STUDIES MANAGEMENT ============

/**
 * Get all success stories (public for published stories, all for admins)
 */
exports.getSuccessStories = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      let isAdmin = false;
      
      // Check if user is authenticated and is admin
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split('Bearer ')[1];
          const decodedToken = await admin.auth().verifyIdToken(token);
          isAdmin = decodedToken.admin && ['admin', 'superadmin'].includes(decodedToken.role);
        } catch (authError) {
          // Not authenticated, continue as public user
          console.log('Auth verification failed, treating as public user');
        }
      }

      // Build query - if admin, get all stories; if public, only published ones
      let query = admin.firestore().collection('successStories');
      
      if (!isAdmin) {
        query = query.where('status', '==', 'live');
      }
      
      const snapshot = await query.get();
      const stories = [];
      
      snapshot.forEach(doc => {
        stories.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Sort in-memory by featured (desc) then order (asc)
      stories.sort((a, b) => {
        // First sort by featured (true comes before false)
        if (a.featured !== b.featured) {
          return b.featured ? 1 : -1;
        }
        // Then sort by order (ascending)
        return (a.order || 0) - (b.order || 0);
      });

      return res.status(200).json({ stories });

    } catch (error) {
      console.error('Error fetching success stories:', error);
      return res.status(500).json({ error: 'Failed to fetch success stories' });
    }
  });
});

/**
 * Create a new success story (admin only)
 */
exports.createSuccessStory = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify requesting user is an admin
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin || !['admin', 'superadmin'].includes(decodedToken.role)) {
        return res.status(403).json({ error: 'Only admins can create success stories' });
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

      // Validate required fields
      if (!company || !industry || !challenge || !solution) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create story data
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

      const docRef = await admin.firestore()
        .collection('successStories')
        .add(storyData);

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

/**
 * Update an existing success story (admin only)
 */
exports.updateSuccessStory = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'PUT' && req.method !== 'PATCH') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify requesting user is an admin
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin || !['admin', 'superadmin'].includes(decodedToken.role)) {
        return res.status(403).json({ error: 'Only admins can update success stories' });
      }

      const { storyId, updates } = req.body;

      if (!storyId) {
        return res.status(400).json({ error: 'Story ID is required' });
      }

      // Check if story exists
      const storyRef = admin.firestore()
        .collection('successStories')
        .doc(storyId);
      
      const storyDoc = await storyRef.get();
      if (!storyDoc.exists) {
        return res.status(404).json({ error: 'Success story not found' });
      }

      // Sanitize text fields if present
      const updateData = { ...updates };
      if (updateData.company) updateData.company = escapeHtml(updateData.company);
      if (updateData.industry) updateData.industry = escapeHtml(updateData.industry);
      if (updateData.challenge) updateData.challenge = escapeHtml(updateData.challenge);
      if (updateData.solution) updateData.solution = escapeHtml(updateData.solution);
      if (updateData.clientName) updateData.clientName = escapeHtml(updateData.clientName);
      if (updateData.clientRole) updateData.clientRole = escapeHtml(updateData.clientRole);
      if (updateData.clientCompany) updateData.clientCompany = escapeHtml(updateData.clientCompany);
      if (updateData.testimonial) updateData.testimonial = escapeHtml(updateData.testimonial);

      // Add update metadata
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

/**
 * Delete a success story (superadmin only)
 */
exports.deleteSuccessStory = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'DELETE' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify requesting user is a superadmin
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin || decodedToken.role !== 'superadmin') {
        return res.status(403).json({ error: 'Only superadmins can delete success stories' });
      }

      const storyId = req.body.storyId || req.query.storyId;

      if (!storyId) {
        return res.status(400).json({ error: 'Story ID is required' });
      }

      // Check if story exists
      const storyRef = admin.firestore()
        .collection('successStories')
        .doc(storyId);
      
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

// ============ CLIENT REVIEWS MANAGEMENT ============

/**
 * Submit a client review (public endpoint - requires authentication)
 */
exports.submitReview = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify user is authenticated
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required to submit a review' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      const {
        clientName,
        clientRole,
        clientCompany,
        content,
        rating,
      } = req.body;

      // Validate required fields
      if (!clientName || !content || !rating) {
        return res.status(400).json({ error: 'Missing required fields: clientName, content, rating' });
      }

      // Validate rating is between 1-5
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      // Create review data
      const reviewData = {
        clientName: escapeHtml(clientName),
        clientRole: clientRole ? escapeHtml(clientRole) : '',
        clientCompany: clientCompany ? escapeHtml(clientCompany) : '',
        content: escapeHtml(content),
        rating: parseInt(rating),
        status: 'pending', // All submissions start as pending
        featured: false,
        order: 0,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        submittedBy: decodedToken.uid,
        submittedByEmail: decodedToken.email,
        approvedAt: null,
        approvedBy: null,
        approvedByEmail: null,
      };

      const docRef = await admin.firestore()
        .collection('reviews')
        .add(reviewData);

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

/**
 * Get reviews (public for approved, all for admins)
 */
exports.getReviews = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      let isAdmin = false;
      
      // Check if user is authenticated and is admin
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split('Bearer ')[1];
          const decodedToken = await admin.auth().verifyIdToken(token);
          isAdmin = decodedToken.admin && ['admin', 'superadmin'].includes(decodedToken.role);
        } catch (authError) {
          // Not authenticated, continue as public user
          console.log('Auth verification failed, treating as public user');
        }
      }

      // Build query
      let query = admin.firestore().collection('reviews');
      
      // Public users only see approved reviews
      if (!isAdmin) {
        query = query.where('status', '==', 'approved');
      }
      
      const snapshot = await query.get();
      const reviews = [];
      
      snapshot.forEach(doc => {
        reviews.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Sort in-memory by featured (desc), then order (asc), then rating (desc)
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

/**
 * Approve a review (admin only)
 */
exports.approveReview = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST' && req.method !== 'PUT') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify requesting user is an admin
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin || !['admin', 'superadmin'].includes(decodedToken.role)) {
        return res.status(403).json({ error: 'Only admins can approve reviews' });
      }

      const { reviewId } = req.body;

      if (!reviewId) {
        return res.status(400).json({ error: 'Review ID is required' });
      }

      const reviewRef = admin.firestore()
        .collection('reviews')
        .doc(reviewId);
      
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

/**
 * Update a review (admin only)
 */
exports.updateReview = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'PUT' && req.method !== 'PATCH') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify requesting user is an admin
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin || !['admin', 'superadmin'].includes(decodedToken.role)) {
        return res.status(403).json({ error: 'Only admins can update reviews' });
      }

      const { reviewId, updates } = req.body;

      if (!reviewId) {
        return res.status(400).json({ error: 'Review ID is required' });
      }

      const reviewRef = admin.firestore()
        .collection('reviews')
        .doc(reviewId);
      
      const reviewDoc = await reviewRef.get();
      if (!reviewDoc.exists) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // Sanitize text fields if present
      const updateData = { ...updates };
      if (updateData.clientName) updateData.clientName = escapeHtml(updateData.clientName);
      if (updateData.clientRole) updateData.clientRole = escapeHtml(updateData.clientRole);
      if (updateData.clientCompany) updateData.clientCompany = escapeHtml(updateData.clientCompany);
      if (updateData.content) updateData.content = escapeHtml(updateData.content);
      
      // Validate rating if present
      if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      // Add update metadata
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

/**
 * Delete a review (superadmin only)
 */
exports.deleteReview = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'DELETE' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify requesting user is a superadmin
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin || decodedToken.role !== 'superadmin') {
        return res.status(403).json({ error: 'Only superadmins can delete reviews' });
      }

      const reviewId = req.body.reviewId || req.query.reviewId;

      if (!reviewId) {
        return res.status(400).json({ error: 'Review ID is required' });
      }

      const reviewRef = admin.firestore()
        .collection('reviews')
        .doc(reviewId);
      
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

// ============================================
// BLOG FUNCTIONS
// ============================================

// Helper function to create URL-friendly slug
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Create a new blog post (draft)
exports.createBlogPost = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      const { title, excerpt, content, category, tags, featuredImage, featured } = req.body;

      // Validation
      if (!title || !content || !category) {
        return res.status(400).json({ error: 'Title, content, and category are required' });
      }

      // Create slug from title
      let slug = createSlug(title);
      
      // Ensure slug is unique
      const existingPost = await admin.firestore()
        .collection('blogPosts')
        .where('slug', '==', slug)
        .limit(1)
        .get();
      
      if (!existingPost.empty) {
        slug = `${slug}-${Date.now()}`;
      }

      // Sanitize text inputs
      const sanitizedData = {
        title: escapeHtml(title),
        slug,
        excerpt: excerpt ? escapeHtml(excerpt) : '',
        content: escapeHtml(content),
        category: escapeHtml(category),
        tags: Array.isArray(tags) ? tags.map(tag => escapeHtml(tag)) : [],
        featuredImage: featuredImage || '',
        featured: featured === true,
        author: {
          uid: decodedToken.uid,
          name: decodedToken.name || decodedToken.email || 'Anonymous',
          email: decodedToken.email
        },
        status: 'draft',
        views: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        publishedAt: null,
        approvedBy: null
      };

      const docRef = await admin.firestore()
        .collection('blogPosts')
        .add(sanitizedData);

      return res.status(201).json({
        message: 'Blog post created successfully',
        postId: docRef.id,
        slug
      });

    } catch (error) {
      console.error('Error creating blog post:', error);
      return res.status(500).json({ error: 'Failed to create blog post' });
    }
  });
});

// Get blog posts (with filters)
exports.getBlogPosts = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Check if user is admin
      let isAdmin = false;
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split('Bearer ')[1];
          const decodedToken = await admin.auth().verifyIdToken(token);
          isAdmin = decodedToken.admin === true;
        } catch (error) {
          // Non-admin or invalid token, continue as public
        }
      }

      const { category, status, featured, authorUid } = req.query;

      let query = admin.firestore().collection('blogPosts');

      // Public users only see published posts
      if (!isAdmin) {
        query = query.where('status', '==', 'published');
      } else if (status) {
        // Admins can filter by status
        query = query.where('status', '==', status);
      }

      // Apply filters
      if (category) {
        query = query.where('category', '==', category);
      }

      if (featured === 'true') {
        query = query.where('featured', '==', true);
      }

      if (authorUid) {
        query = query.where('author.uid', '==', authorUid);
      }

      const snapshot = await query.get();

      const posts = [];
      snapshot.forEach(doc => {
        posts.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
          updatedAt: doc.data().updatedAt?.toDate?.().toISOString() || null,
          publishedAt: doc.data().publishedAt?.toDate?.().toISOString() || null
        });
      });

      // Sort in-memory (featured first, then by publishedAt/createdAt desc)
      posts.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        const dateA = new Date(a.publishedAt || a.createdAt);
        const dateB = new Date(b.publishedAt || b.createdAt);
        return dateB - dateA;
      });

      return res.status(200).json({ posts, count: posts.length });

    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });
});

// Get single blog post by slug
exports.getBlogPost = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { slug } = req.query;

      if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
      }

      // Check if user is admin
      let isAdmin = false;
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split('Bearer ')[1];
          const decodedToken = await admin.auth().verifyIdToken(token);
          isAdmin = decodedToken.admin === true;
        } catch (error) {
          // Continue as public
        }
      }

      const snapshot = await admin.firestore()
        .collection('blogPosts')
        .where('slug', '==', slug)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      const doc = snapshot.docs[0];
      const post = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate?.().toISOString() || null,
        publishedAt: doc.data().publishedAt?.toDate?.().toISOString() || null
      };

      // Only allow published posts for public, admins see all
      if (!isAdmin && post.status !== 'published') {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      // Increment view count (only for published posts viewed by public)
      if (!isAdmin && post.status === 'published') {
        await doc.ref.update({
          views: admin.firestore.FieldValue.increment(1)
        });
        post.views = (post.views || 0) + 1;
      }

      return res.status(200).json({ post });

    } catch (error) {
      console.error('Error fetching blog post:', error);
      return res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  });
});

// Update blog post
exports.updateBlogPost = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'PUT' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      const { postId, title, excerpt, content, category, tags, featuredImage, featured, status } = req.body;

      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const postRef = admin.firestore().collection('blogPosts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      const existingPost = postDoc.data();

      // Check permissions: author can update own drafts, admin can update any
      const isAdmin = decodedToken.admin === true;
      const isAuthor = existingPost.author.uid === decodedToken.uid;

      if (!isAdmin && (!isAuthor || existingPost.status !== 'draft')) {
        return res.status(403).json({ error: 'You can only update your own draft posts' });
      }

      // Prepare update data
      const updateData = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      if (title) {
        updateData.title = escapeHtml(title);
        // Update slug if title changed
        updateData.slug = createSlug(title);
      }
      if (excerpt !== undefined) updateData.excerpt = escapeHtml(excerpt);
      if (content) updateData.content = escapeHtml(content);
      if (category) updateData.category = escapeHtml(category);
      if (tags) updateData.tags = Array.isArray(tags) ? tags.map(tag => escapeHtml(tag)) : [];
      if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
      if (featured !== undefined) updateData.featured = featured === true;
      
      // Only admins can change status (except submitting for approval)
      if (status && isAdmin) {
        updateData.status = status;
      }

      await postRef.update(updateData);

      return res.status(200).json({ message: 'Blog post updated successfully' });

    } catch (error) {
      console.error('Error updating blog post:', error);
      return res.status(500).json({ error: 'Failed to update blog post' });
    }
  });
});

// Submit post for approval (author changes status to 'pending')
exports.submitBlogPostForApproval = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      const { postId } = req.body;

      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const postRef = admin.firestore().collection('blogPosts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      const existingPost = postDoc.data();

      // Only the author can submit their own post
      if (existingPost.author.uid !== decodedToken.uid) {
        return res.status(403).json({ error: 'You can only submit your own posts' });
      }

      // Can only submit drafts
      if (existingPost.status !== 'draft') {
        return res.status(400).json({ error: 'Only draft posts can be submitted for approval' });
      }

      await postRef.update({
        status: 'pending',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({ message: 'Blog post submitted for approval' });

    } catch (error) {
      console.error('Error submitting blog post:', error);
      return res.status(500).json({ error: 'Failed to submit blog post' });
    }
  });
});

// Approve blog post (admin only)
exports.approveBlogPost = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify admin authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { postId } = req.body;

      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const postRef = admin.firestore().collection('blogPosts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      await postRef.update({
        status: 'published',
        publishedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: {
          uid: decodedToken.uid,
          name: decodedToken.name || decodedToken.email || 'Admin',
          email: decodedToken.email,
          approvedAt: admin.firestore.FieldValue.serverTimestamp()
        }
      });

      return res.status(200).json({ message: 'Blog post approved and published' });

    } catch (error) {
      console.error('Error approving blog post:', error);
      return res.status(500).json({ error: 'Failed to approve blog post' });
    }
  });
});

// Reject blog post (admin only - returns to draft)
exports.rejectBlogPost = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify admin authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { postId, feedback } = req.body;

      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const postRef = admin.firestore().collection('blogPosts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      await postRef.update({
        status: 'draft',
        rejectionFeedback: feedback ? escapeHtml(feedback) : '',
        rejectedBy: {
          uid: decodedToken.uid,
          name: decodedToken.name || decodedToken.email || 'Admin',
          rejectedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({ message: 'Blog post rejected and returned to draft' });

    } catch (error) {
      console.error('Error rejecting blog post:', error);
      return res.status(500).json({ error: 'Failed to reject blog post' });
    }
  });
});

// Delete blog post (admin only)
exports.deleteBlogPost = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'DELETE' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify admin authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const postId = req.body.postId || req.query.postId;

      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const postRef = admin.firestore().collection('blogPosts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      await postRef.delete();

      console.log(`Blog post deleted by ${decodedToken.email}: ${postId}`);
      return res.status(200).json({ message: 'Blog post deleted successfully' });

    } catch (error) {
      console.error('Error deleting blog post:', error);
      return res.status(500).json({ error: 'Failed to delete blog post' });
    }
  });
});

// ============================================
// CAREERS FUNCTIONS
// ============================================

// Create a new job posting (admin only)
exports.createJob = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify admin authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin) {
        return res.status(403).json({ error: 'Admin access required' });
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
        featured 
      } = req.body;

      // Validation
      if (!title || !department || !location || !jobType || !description) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      // Sanitize and create job data
      const jobData = {
        title: escapeHtml(title),
        department: escapeHtml(department),
        location: escapeHtml(location),
        jobType: escapeHtml(jobType),
        experienceLevel: experienceLevel ? escapeHtml(experienceLevel) : 'Mid-level',
        description: escapeHtml(description),
        requirements: Array.isArray(requirements) ? requirements.map(r => escapeHtml(r)) : [],
        responsibilities: Array.isArray(responsibilities) ? responsibilities.map(r => escapeHtml(r)) : [],
        benefits: Array.isArray(benefits) ? benefits.map(b => escapeHtml(b)) : [],
        salaryRange: salaryRange ? escapeHtml(salaryRange) : 'Competitive',
        featured: featured === true,
        status: 'open',
        applicantCount: 0,
        postedBy: {
          uid: decodedToken.uid,
          name: decodedToken.name || decodedToken.email || 'Admin',
          email: decodedToken.email
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        closedAt: null
      };

      const docRef = await admin.firestore().collection('jobs').add(jobData);

      return res.status(201).json({
        message: 'Job posted successfully',
        jobId: docRef.id
      });

    } catch (error) {
      console.error('Error creating job:', error);
      return res.status(500).json({ error: 'Failed to create job' });
    }
  });
});

// Get jobs (public sees open jobs, admins see all)
exports.getJobs = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Check if user is admin
      let isAdmin = false;
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split('Bearer ')[1];
          const decodedToken = await admin.auth().verifyIdToken(token);
          isAdmin = decodedToken.admin === true;
        } catch (error) {
          // Continue as public
        }
      }

      const { department, jobType, status } = req.query;

      let query = admin.firestore().collection('jobs');

      // Public users only see open jobs
      if (!isAdmin) {
        query = query.where('status', '==', 'open');
      } else if (status) {
        // Admins can filter by status
        query = query.where('status', '==', status);
      }

      // Apply filters
      if (department && department !== 'all') {
        query = query.where('department', '==', department);
      }

      if (jobType && jobType !== 'all') {
        query = query.where('jobType', '==', jobType);
      }

      const snapshot = await query.get();

      const jobs = [];
      snapshot.forEach(doc => {
        jobs.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
          updatedAt: doc.data().updatedAt?.toDate?.().toISOString() || null,
          closedAt: doc.data().closedAt?.toDate?.().toISOString() || null
        });
      });

      // Sort: featured first, then by creation date
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

// Update job (admin only)
exports.updateJob = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'PUT' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify admin authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin) {
        return res.status(403).json({ error: 'Admin access required' });
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

      // Prepare update data
      const updateData = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Sanitize and add updates
      if (updates.title) updateData.title = escapeHtml(updates.title);
      if (updates.department) updateData.department = escapeHtml(updates.department);
      if (updates.location) updateData.location = escapeHtml(updates.location);
      if (updates.jobType) updateData.jobType = escapeHtml(updates.jobType);
      if (updates.experienceLevel) updateData.experienceLevel = escapeHtml(updates.experienceLevel);
      if (updates.description) updateData.description = escapeHtml(updates.description);
      if (updates.requirements) updateData.requirements = Array.isArray(updates.requirements) ? updates.requirements.map(r => escapeHtml(r)) : [];
      if (updates.responsibilities) updateData.responsibilities = Array.isArray(updates.responsibilities) ? updates.responsibilities.map(r => escapeHtml(r)) : [];
      if (updates.benefits) updateData.benefits = Array.isArray(updates.benefits) ? updates.benefits.map(b => escapeHtml(b)) : [];
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

// Delete job (admin only)
exports.deleteJob = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'DELETE' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify admin authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin) {
        return res.status(403).json({ error: 'Admin access required' });
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

// Submit job application (public)
exports.submitApplication = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Authentication is optional for public job applications
      let submittedBy = 'public';
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split('Bearer ')[1];
          const decodedToken = await admin.auth().verifyIdToken(token);
          submittedBy = decodedToken.uid;
        } catch (authError) {
          // If token is invalid, continue as public user
          console.log('Invalid auth token, continuing as public user');
        }
      }

      const { 
        jobId,
        applicantName,
        applicantEmail,
        applicantPhone,
        coverLetter,
        portfolioUrl,
        linkedInUrl,
        resumeUrl
      } = req.body;

      // Validation
      if (!jobId || !applicantName || !applicantEmail || !resumeUrl) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      // Verify job exists and is open
      const jobRef = admin.firestore().collection('jobs').doc(jobId);
      const jobDoc = await jobRef.get();

      if (!jobDoc.exists) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const jobData = jobDoc.data();

      if (jobData.status !== 'open') {
        return res.status(400).json({ error: 'This position is no longer accepting applications' });
      }

      // Create application
      const applicationData = {
        jobId,
        jobTitle: jobData.title,
        jobDepartment: jobData.department,
        applicantName: escapeHtml(applicantName),
        applicantEmail: escapeHtml(applicantEmail),
        applicantPhone: applicantPhone ? escapeHtml(applicantPhone) : '',
        resumeUrl,
        coverLetter: coverLetter ? escapeHtml(coverLetter) : '',
        portfolioUrl: portfolioUrl || '',  // URLs don't need HTML escaping
        linkedInUrl: linkedInUrl || '',    // URLs don't need HTML escaping
        status: 'new',
        notes: [],
        submittedBy: submittedBy,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        reviewedBy: null
      };

      const docRef = await admin.firestore().collection('applications').add(applicationData);

      // Increment applicant count on job
      await jobRef.update({
        applicantCount: admin.firestore.FieldValue.increment(1)
      });

      return res.status(201).json({
        message: 'Application submitted successfully',
        applicationId: docRef.id
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      return res.status(500).json({ error: 'Failed to submit application' });
    }
  });
});

// Get applications (admin only)
exports.getApplications = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify admin authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { jobId, status } = req.query;

      let query = admin.firestore().collection('applications');

      // Filter by job
      if (jobId) {
        query = query.where('jobId', '==', jobId);
      }

      // Filter by status
      if (status && status !== 'all') {
        query = query.where('status', '==', status);
      }

      const snapshot = await query.get();

      const applications = [];
      snapshot.forEach(doc => {
        applications.push({
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt?.toDate?.().toISOString() || null,
          lastUpdatedAt: doc.data().lastUpdatedAt?.toDate?.().toISOString() || null
        });
      });

      // Sort by submission date (newest first)
      applications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

      return res.status(200).json({ applications, count: applications.length });

    } catch (error) {
      console.error('Error fetching applications:', error);
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }
  });
});

// Update application status (admin only)
exports.updateApplicationStatus = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify admin authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.admin) {
        return res.status(403).json({ error: 'Admin access required' });
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
          email: decodedToken.email
        }
      };

      // Add note if provided
      if (note) {
        const noteData = {
          by: decodedToken.name || decodedToken.email || 'Admin',
          content: escapeHtml(note),
          timestamp: admin.firestore.FieldValue.serverTimestamp()
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

