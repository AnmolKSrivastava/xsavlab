const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

if (!admin.apps.length) {
  admin.initializeApp();
}

// Compat shim for codepaths that use admin.firestore.FieldValue.*
if (!admin.firestore.FieldValue) {
  admin.firestore.FieldValue = FieldValue;
}

module.exports = { admin };