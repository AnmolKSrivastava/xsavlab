# Email Configuration & Deployment Guide

## Setting Up Email Service

### Option 1: Gmail SMTP (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Create an App Password**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Select "App passwords" (appears only if 2FA is enabled)
   - Generate password for "Mail" on "Windows Computer" (or your device)
   - Copy the 16-character password

3. **Deploy Cloud Functions with Environment Variables**:
```bash
cd c:\Users\ANMOL\Documents\xsavlab
firebase functions:secrets:set EMAIL_USER
firebase functions:secrets:set EMAIL_PASSWORD
firebase functions:secrets:set ADMIN_EMAIL
firebase deploy --only functions
```

### Option 2: SendGrid (Recommended for Production)

1. **Sign up at SendGrid** (https://sendgrid.com)
2. **Create API Key** from Settings > API Keys
3. **Deploy with SendGrid**:
```bash
firebase functions:secrets:set SENDGRID_API_KEY
firebase deploy --only functions
```

Then update `functions/index.js` to use SendGrid instead of Nodemailer.

## Local Development (Testing)

1. **Install Function Dependencies**:
```bash
cd functions
npm install
cd ..
```

2. **Start Firebase Emulator**:
```bash
firebase emulators:start --only functions,firestore
```

3. **Update enquiry.js for local development**:
The code already handles this - it will use local emulator when `NODE_ENV === 'development'`

## Deployment to Production

1. **Install Functions Dependencies** (if not already installed):
```bash
cd functions
npm install
```

2. **Set Email Credentials**:
```bash
firebase functions:secrets:set EMAIL_USER
firebase functions:secrets:set EMAIL_PASSWORD
firebase functions:secrets:set ADMIN_EMAIL
```

3. **Deploy Everything**:
```bash
firebase deploy
```

This deploys both hosting (React app) and Cloud Functions (email handler).

## Testing the Form

1. Fill out the contact form on your website
2. Check user receives confirmation email
3. Check admin email for new enquiry notification
4. Verify enquiry is stored in [Firebase Console](https://console.firebase.google.com) > Firestore > enquiries collection

## Troubleshooting

### "CORS error" when submitting form
- Ensure Cloud Function is deployed
- Check REACT_APP_ENQUIRY_ENDPOINT in .env matches deployed function URL

### "Failed to send email"
- Verify EMAIL_USER and EMAIL_PASSWORD environment variables are set correctly
- Check Gmail allows "Less secure app access" (for Gmail SMTP)
- Or verify SendGrid API key is correct

### "Missing required fields" error
- Ensure name, email, service, and message are all filled in form
- Check browser console for validation errors

### "Enquiry received but no email sent"
- Check Firebase Cloud Functions logs:
```bash
firebase functions:log
```
- Verify email credentials in firebase config:
```bash
firebase functions:secrets:access EMAIL_USER
```

## Dashboard (Future Enhancement)

The `getEnquiries` endpoint is ready for an admin dashboard to:
- View all enquiries
- Filter by service, date range, or status
- Update enquiry status (new, contacted, closed, etc.)
- Send follow-up emails

Contact me to implement the admin dashboard!
