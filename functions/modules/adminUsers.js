const { onRequest } = require('firebase-functions/v2/https');
const { admin } = require('../lib/firebase');
const { cors, ensureMethod } = require('../lib/http');
const { requireAuth, requireAdmin } = require('../lib/auth');

const setAdminRole = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const decodedToken = await requireAuth(req, res);
      if (!decodedToken) {
        return;
      }

      if (decodedToken.admin !== true) {
        console.warn('Non-admin user attempted to set admin role:', decodedToken.uid);
        return res.status(403).json({ error: 'Forbidden - Only admins can create other admins' });
      }

      const targetUser = await admin.auth().getUserByEmail(email);

      await admin.auth().setCustomUserClaims(targetUser.uid, { admin: true });
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

const createAdminUser = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const { email, password, displayName, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      if (!['superadmin', 'admin', 'moderator'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be: superadmin, admin, or moderator' });
      }

      const decodedToken = await requireAdmin(req, res, ['superadmin']);
      if (!decodedToken) {
        return;
      }

      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: displayName || email.split('@')[0],
      });

      await admin.auth().setCustomUserClaims(userRecord.uid, {
        admin: true,
        role,
      });

      await admin.firestore().collection('users').doc(userRecord.uid).set({
        email: userRecord.email,
        displayName: userRecord.displayName,
        role,
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
          role,
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

const updateUserRole = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const { userId, role } = req.body;

      if (!userId || !role) {
        return res.status(400).json({ error: 'User ID and role are required' });
      }

      if (!['superadmin', 'admin', 'moderator'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const decodedToken = await requireAdmin(req, res, ['superadmin']);
      if (!decodedToken) {
        return;
      }

      if (userId === decodedToken.uid && decodedToken.role === 'superadmin' && role !== 'superadmin') {
        return res.status(400).json({ error: 'Cannot remove your own super admin privileges' });
      }

      await admin.auth().setCustomUserClaims(userId, {
        admin: true,
        role,
      });

      await admin.firestore().collection('users').doc(userId).update({
        role,
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

const listAdminUsers = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'GET')) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res);
      if (!decodedToken) {
        return;
      }

      const usersSnapshot = await admin.firestore().collection('users').get();
      const users = [];

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push({
          uid: doc.id,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          status: userData.status,
          createdAt: userData.createdAt,
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

const deleteAdminUser = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'DELETE')) {
      return;
    }

    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const decodedToken = await requireAdmin(req, res, ['superadmin']);
      if (!decodedToken) {
        return;
      }

      if (userId === decodedToken.uid) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      await admin.auth().deleteUser(userId);
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

module.exports = {
  setAdminRole,
  createAdminUser,
  updateUserRole,
  listAdminUsers,
  deleteAdminUser,
};