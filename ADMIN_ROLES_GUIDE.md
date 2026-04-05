# Multi-Level Admin System - Setup & Usage Guide

## 🎯 Overview

Your XSavLab admin portal now supports 3 levels of admin access:

| Role | Permissions | Use Case |
|------|-------------|----------|
| **Super Admin** 👑 | Full system access - manage users, enquiries, settings | Primary account owner |
| **Admin** 🛡️ | Manage enquiries, view users | Trusted team members |
| **Moderator** ✓ | View & update enquiry status only | Support staff |

---

## 🚀 Initial Setup

### Step 1: Upgrade Your Account to Super Admin

1. **Make sure you have your `serviceAccountKey.json` file** in the project root
2. **Run the setup script** with your current admin email:
   ```bash
   node setup-superadmin.js your-email@example.com
   ```
3. **Sign out and sign in again** in the admin portal for changes to take effect
4. **Verify** - You should see "👑 Super Admin" badge next to your email

### Step 2: Deploy the New Functions & Rules

```bash
firebase deploy --only functions,firestore:rules
```

This deploys:
- **4 new Cloud Functions** for user management
- **Updated Firestore rules** with role-based access control

---

## 📋 How to Add Lower-Level Admins

### Method 1: Through Admin Portal (Recommended)

1. **Log in** to your admin portal as Super Admin
2. **Go to "Users" tab**
3. **Click "Add User"** button
4. **Fill in the form:**
   - Email Address (required)
   - Display Name (optional)
   - Password (min. 6 characters)
   - Role: Choose from Moderator, Admin, or Super Admin
5. **Click "Create User"**

The user account is created instantly and they can log in immediately!

### Method 2: Manually via Firebase Console (Old Way)

1. Go to Firebase Console → Authentication → Add User
2. Create user with email/password
3. After creation, use the portal to assign their role

---

## 🔐 Permission Details

### What Each Role Can Do:

#### Super Admin 👑
- ✅ View & manage all enquiries
- ✅ Create, edit, delete admin users
- ✅ Change user roles (including demoting admins)
- ✅ Access all settings
- ✅ Full system control

#### Admin 🛡️
- ✅ View & manage all enquiries
- ✅ View user list
- ❌ Cannot create/edit/delete users
- ❌ Limited settings access

#### Moderator ✓
- ✅ View enquiries
- ✅ Update enquiry status (new/in-progress/replied/closed)
- ✅ Mark enquiries as read/unread
- ❌ Cannot view users tab
- ❌ Cannot access settings
- ❌ Limited to enquiry management only

---

## 🛠️ Managing Users (Super Admin Only)

### View All Users
- Navigate to "Users" tab in admin portal
- See all users with their roles, email, and creation date

### Change User Role
1. Find the user in the list
2. Use the dropdown next to their name
3. Select new role (Moderator/Admin/Super Admin)
4. Changes apply immediately (user must sign out/in to see changes)

### Delete User
1. Find the user in the list
2. Click the trash icon 🗑️
3. Confirm deletion
4. User is removed from Firebase Auth and Firestore

**Note:** You cannot delete your own account or remove your own super admin privileges for safety.

---

## 🔒 Security Features

### Built-in Protections:
- ✅ Only authenticated admins can access admin portal
- ✅ Role verification on every request (via custom claims)
- ✅ Super admins cannot demote themselves
- ✅ Super admins cannot delete their own account
- ✅ Firestore rules enforce role-based access at database level
- ✅ All user management actions are logged with creator info

### Firestore Security:
- `enquiries` collection: All admins can read, only admins can update status/isRead fields
- `users` collection: Admins can read, only super admins can create/delete (via Cloud Functions)

---

## 📡 Cloud Functions Endpoints

Your deployment includes these new functions:

1. **createAdminUser** - Create new admin user (Super Admin only)
2. **updateUserRole** - Change user's role (Super Admin only)
3. **listAdminUsers** - Get all users (Admin & Super Admin)
4. **deleteAdminUser** - Delete user account (Super Admin only)

All functions require authentication token and enforce role-based permissions.

---

## 🎨 UI Features

### Visual Indicators:
- **Role badges** next to user email in header:
  - 👑 Super Admin (purple)
  - 🛡️ Admin (blue)
  - ✓ Moderator (green)

### Tab Visibility:
- **Moderators** see only "Enquiries" tab
- **Admins** see "Enquiries" and "Users" tabs
- **Super Admins** see all tabs including "Settings"

---

## 🐛 Troubleshooting

### "Only super admins can create users" error
- You need to run `setup-superadmin.js` first to upgrade your account

### Changes not applied after role update
- User must sign out and sign in again for new role to take effect

### Cannot see "Add User" button
- Only Super Admins can create users
- Verify your role badge shows 👑 Super Admin

### Firestore permission denied
- Make sure you deployed the new rules: `firebase deploy --only firestore:rules`
- Check Firebase Console → Firestore → Rules

---

## 📝 Best Practices

1. **Keep 1-2 Super Admins** - Don't create too many super admins
2. **Use Admins for daily operations** - Give most team members "Admin" role
3. **Moderators for support staff** - Limited access reduces risk
4. **Secure serviceAccountKey.json** - Never commit to Git (already in .gitignore)
5. **Regular audits** - Review user list periodically in Users tab

---

## 🎓 Example Use Cases

### Scenario 1: Growing Team
- **You**: Super Admin (owner)
- **Senior Developer**: Admin (full enquiry management)
- **Support Staff**: Moderator (handle customer enquiries)

### Scenario 2: Agency Model
- **Agency Owner**: Super Admin
- **Account Managers**: Admin (manage client enquiries)
- **Junior Support**: Moderator (triage and respond)

---

## 📞 Technical Details

### Custom Claims Structure:
```json
{
  "admin": true,
  "role": "superadmin" | "admin" | "moderator"
}
```

### Firestore Collections:
- `users/{userId}` - User profiles with role, email, displayName, createdBy
- `enquiries/{enquiryId}` - Contact form submissions
- `admins/{userId}` - (Legacy) Old admin tracking

---

## ✅ Quick Start Checklist

- [ ] Run `node setup-superadmin.js your-email@example.com`
- [ ] Deploy functions: `firebase deploy --only functions,firestore:rules`
- [ ] Sign out and sign in to admin portal
- [ ] Verify you see 👑 Super Admin badge
- [ ] Go to Users tab and test adding a user
- [ ] Test different role permissions

**You're all set! 🎉**

Your admin portal now has professional multi-level access control.
