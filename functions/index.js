const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Configure CORS with whitelist of allowed origins
const allowedOrigins = [
  'https://xsavlab.web.app',
  'https://xsavlab.firebaseapp.com',
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

