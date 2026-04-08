const { admin } = require('./firebase');

function getBearerToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const match = authHeader.trim().match(/^Bearer\s+(.+)$/i);
  if (!match || !match[1]) {
    return null;
  }

  return match[1].trim();
}

async function verifyBearerToken(req) {
  const token = getBearerToken(req);

  if (!token) {
    return null;
  }

  return admin.auth().verifyIdToken(token);
}

async function requireAuth(req, res) {
  const token = getBearerToken(req);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized - Missing bearer token' });
    return null;
  }

  try {
    return await admin.auth().verifyIdToken(token);
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
    return null;
  }
}

function hasRole(decodedToken, roles) {
  return Boolean(
    decodedToken &&
      decodedToken.admin &&
      roles.includes(decodedToken.role)
  );
}

async function requireAdmin(req, res, roles = []) {
  const decodedToken = await requireAuth(req, res);

  if (!decodedToken) {
    return null;
  }

  if (!decodedToken.admin) {
    res.status(403).json({ error: 'Admin access required' });
    return null;
  }

  if (roles.length > 0 && !roles.includes(decodedToken.role)) {
    const roleLabel = roles.length === 1 ? roles[0] : 'required role';
    res.status(403).json({ error: `Only ${roleLabel}s can perform this action` });
    return null;
  }

  return decodedToken;
}

module.exports = {
  getBearerToken,
  verifyBearerToken,
  requireAuth,
  requireAdmin,
  hasRole,
};