# Firebase Admin Authentication Setup Guide

This guide will help you configure Firebase Authentication and create your first admin user.

## 📋 Prerequisites

- Firebase project already set up
- Email/Password authentication enabled in Firebase Console ✅

---

## 🔧 Step 1: Get Your Firebase Configuration

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project
3. Click the **gear icon** (⚙️) → **Project Settings**
4. Scroll down to **"Your apps"** section
5. If you haven't added a web app:
   - Click **"Add app"** → Choose **Web** (</> icon)
   - Give it a nickname (e.g., "XSAV Lab Web")
   - Click **Register app**
6. Copy the `firebaseConfig` object

---

## 🔑 Step 2: Update Firebase Configuration

1. Open: `src/config/firebase.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",          // Replace this
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

## 👤 Step 3: Create Your First Admin User

### Option A: Firebase Console (Recommended)

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Click **"Add user"**
3. Enter:
   - **Email**: Your admin email (e.g., admin@yourcompany.com)
   - **Password**: A strong password
4. Click **"Add user"**
5. Copy the **User UID** (you'll need this for the next step)

---

## 🛡️ Step 4: Grant Admin Privileges

You have two options to grant admin privileges:

### Option A: Use the Cloud Function (Easier)

1. **Deploy the Cloud Function first:**
   ```bash
   firebase deploy --only functions
   ```

2. **Call the `setAdminRole` function** using curl or Postman:
   ```bash
   curl -X POST https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/setAdminRole \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@yourcompany.com",
       "secretKey": "xsavlab-admin-setup-2026"
     }'
   ```

   Replace:
   - `YOUR-REGION-YOUR-PROJECT` with your actual Cloud Function URL
   - `admin@yourcompany.com` with the email you created in Step 3

3. **IMPORTANT SECURITY**: After creating your first admin, update `functions/index.js`:
   - Find line with `const SETUP_SECRET = 'xsavlab-admin-setup-2026';`
   - Change the secret key to something unique and secure
   - OR remove the secret key method entirely and only allow authenticated admins to create new admins

### Option B: Firebase Console Custom Claims (More Secure)

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Click on the user you created
3. Scroll down to **"Custom claims"**
4. Click **"Edit"**
5. Add:
   ```json
   {
     "admin": true
   }
   ```
6. Click **"Save"**

7. **Also add to Firestore:**
   - Go to **Firestore Database** → **admins** collection (create it if it doesn't exist)
   - Create a document with ID matching the **User UID**
   - Add fields:
     ```
     email: "admin@yourcompany.com"
     role: "admin"
     createdAt: (use server timestamp)
     ```

---

## ✅ Step 5: Test Admin Login

1. **Start your development server:**
   ```bash
   npm start
   ```

2. **Navigate to the admin login:**
   - Scroll to the footer of your website
   - Click the **"Admin"** link (with shield icon) next to the copyright
   - OR go directly to: `http://localhost:3000/admin-login`

3. **Sign in:**
   - Email: The admin email you created
   - Password: The password you set

4. **Verify:**
   - You should be redirected to `/admin/dashboard`
   - You should see the admin dashboard with stats and tabs

---

## 🔐 Security Best Practices

### After First Admin Setup:

1. **Remove or secure the secret key method:**
   - Edit `functions/index.js`
   - Change `SETUP_SECRET` to a new, random value
   - Store it securely (don't commit to Git)
   - Or remove the secret key method entirely

2. **Add `.env` to `.gitignore:**
   ```bash
   echo "src/config/firebase.js" >> .gitignore
   ```
   
   Consider using environment variables instead:
   ```javascript
   const firebaseConfig = {
     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
     // ... etc
   };
   ```

3. **Enable Two-Factor Authentication:**
   - For all admin users in Firebase Console
   - Go to Authentication → Sign-in method → Advanced → Multi-factor authentication

4. **Set up Firebase App Check:**
   - Protects your backend from abuse
   - Go to Firebase Console → App Check

---

## 🎯 Creating Additional Admins

Once you have one admin set up:

1. **Create the user in Firebase Console** (Authentication → Users → Add user)

2. **Option 1: Use Firebase Console Custom Claims** (as in Step 4 Option B)

3. **Option 2: Use the setAdminRole function** with authentication:
   - Sign in as an existing admin
   - Get the admin's ID token
   - Call the function with the token:
   ```bash
   curl -X POST https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/setAdminRole \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ADMIN_ID_TOKEN" \
     -d '{
       "email": "newadmin@yourcompany.com"
     }'
   ```

---

## 📊 Admin Dashboard Features

Your admin dashboard includes:

- **Stats Overview**: Total enquiries, active users, site visits, conversion rate
- **Enquiries Tab**: View and manage customer enquiries from the contact form
- **Users Tab**: Manage admin users and permissions
- **Settings Tab**: Security settings and configurations

---

## 🐛 Troubleshooting

### "You do not have administrator privileges"
- Verify custom claims are set: `{"admin": true}`
- Check Firestore `admins` collection has your user document
- Sign out and sign back in (tokens are cached)

### "Invalid email or password"
- Double-check credentials in Firebase Console → Authentication → Users
- Try resetting the password

### "Firebase config error"
- Verify all values in `src/config/firebase.js` are correct
- Check for typos in apiKey, projectId, etc.

### Dashboard shows "Loading..." infinitely
- Check browser console for errors
- Verify user is authenticated
- Verify custom claims are set correctly

---

## 📝 Next Steps

1. ✅ Configure Firebase (`firebase.js`)
2. ✅ Create first admin user
3. ✅ Grant admin privileges
4. ✅ Test login and dashboard access
5. 🎯 Customize dashboard to view enquiries
6. 🎯 Set up email notifications
7. 🎯 Add more admin users as needed
8. 🎯 Deploy to production

---

## 🚀 Deployment

When ready to deploy:

```bash
# Build the frontend
npm run build

# Deploy everything
firebase deploy

# Or deploy separately
firebase deploy --only hosting
firebase deploy --only functions
```

---

**Need help?** Check the Firebase documentation or contact your development team.
