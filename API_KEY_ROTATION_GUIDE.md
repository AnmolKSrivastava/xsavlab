# Firebase Web API Key Rotation Guide (XSAVLab)

## 1) Important Clarification
- Firebase browser keys usually do not have a **Regenerate** button.
- You should **not delete the Firebase app** to rotate the key.
- Correct method is **key rotation**: create a new key, switch app to it, then disable/delete old key.

## 2) Where to Manage Keys
Use Google Cloud Console (same Firebase project):
- https://console.cloud.google.com/apis/credentials?project=xsavlab

If you cannot see this page, likely IAM permission issue. Needed role examples:
- Owner
- Editor
- API Keys Admin

## 3) Safe Rotation Steps
1. Open **APIs & Services > Credentials**.
2. Click **Create credentials > API key**.
3. Name it clearly, e.g. `xsavlab-web-prod-2026`.
4. Keep **service account binding OFF** for browser key usage.
5. Set **Application restrictions = Websites**.
6. Add allowed referrers:
   - https://xsavlab.web.app/*
   - https://xsavlab.firebaseapp.com/*
   - https://xsavlab.com/*
   - https://www.xsavlab.com/*
   - http://localhost:3000/*
   - http://localhost:*/* (optional for flexible local ports)
7. Set **API restrictions**:
   - Best option: copy the same API list from your current Firebase auto-created browser key.
   - If doing minimum first, include:
     - Identity Toolkit API
     - Secure Token API
     - Cloud Firestore API
     - Firebase Installations API
     - Cloud Storage API (if using uploads/downloads)
     - Firebase App Check API (only if App Check enabled)
8. Save key.
9. Replace key in frontend config file: `src/config/firebase.js`.
10. Deploy frontend.
11. Test auth + Firestore + storage flows.
12. Disable/delete old key only after verification.

## 4) Where to Update in This Repo
Current file to update:
- `src/config/firebase.js`

## 5) If You Delay Rotation
If you do not rotate now:
- At least restrict current key by **Web referrer** and **API allowlist**.
- Keep Firebase rules/auth strict.
- Monitor for unusual usage spikes.

## 6) Security Notes We Confirmed
- Firebase Web API key is not a password, but should still be restricted.
- Git-ignoring `src/config/firebase.js` now does not remove previous exposure from git history.
- Real security controls are:
  - API key restrictions
  - Firebase Auth checks
  - Firestore/Storage security rules

## 7) Done Already in Repo
To reduce accidental exposure, these artifacts were removed from tracking and gitignored:
- Lighthouse reports (`*.lighthouse-*.json`, `*.report.html`, etc.)
- `.env.production`
- local audit output files

---
If needed later, follow this order: **Create new key -> Restrict -> Update app -> Verify -> Disable old key**.
