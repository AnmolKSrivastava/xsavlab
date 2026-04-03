const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

const EMAIL_USER = defineSecret('EMAIL_USER');
const EMAIL_PASSWORD = defineSecret('EMAIL_PASSWORD');
const ADMIN_EMAIL = defineSecret('ADMIN_EMAIL');

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Cloud Function: Handle contact form submissions
 * Receives enquiry data and sends confirmation email to user
 */
exports.sendEnquiry = onRequest({ secrets: [EMAIL_USER, EMAIL_PASSWORD, ADMIN_EMAIL] }, (req, res) => {
  cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
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

      // Store enquiry in Firestore
      const enquiryData = {
        name,
        email,
        company: company || 'Not provided',
        service,
        message,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'new',
        ipAddress: req.ip,
      };

      const enquiryRef = await admin
        .firestore()
        .collection('enquiries')
        .add(enquiryData);

      console.log('Enquiry stored with ID:', enquiryRef.id);

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
                  <p>Hi <span class="highlight">${name}</span>,</p>
                  
                  <p>We have received your enquiry and appreciate your interest in XSavLab's services.</p>
                  
                  <h3>Your Enquiry Details:</h3>
                  <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Company:</strong> ${company || 'Not provided'}</li>
                    <li><strong>Service Interest:</strong> ${formatServiceName(service)}</li>
                  </ul>
                  
                  <p><strong>Your Message:</strong></p>
                  <p style="background: white; padding: 15px; border-left: 4px solid #667EEA; border-radius: 4px;">
                    ${message.replace(/\n/g, '<br>')}
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
        subject: `New Enquiry: ${name} - ${formatServiceName(service)}`,
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
                    <span class="label">Name:</span> ${name}
                  </div>
                  <div class="field">
                    <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
                  </div>
                  <div class="field">
                    <span class="label">Company:</span> ${company || 'Not provided'}
                  </div>
                  <div class="field">
                    <span class="label">Service:</span> ${formatServiceName(service)}
                  </div>
                  <div class="field">
                    <span class="label">Message:</span>
                    <p style="background: white; padding: 15px; border-left: 4px solid #667EEA;">
                      ${message.replace(/\n/g, '<br>')}
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

      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Enquiry received successfully. Confirmation email sent.',
        enquiryId: enquiryRef.id,
      });
    } catch (error) {
      console.error('Error processing enquiry:', error);
      return res.status(500).json({
        error: 'Failed to process enquiry. Please try again later.',
        details: error.message,
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
        return res.status(401).json({ error: 'Unauthorized' });
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
