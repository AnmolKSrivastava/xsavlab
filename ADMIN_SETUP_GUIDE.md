# Firebase Admin Setup Guide (Current)

This guide is the current setup path for first-time admin bootstrap and ongoing role management.

## What This Guide Covers

- Creating the first admin account
- Bootstrapping first superadmin access
- Creating additional users with role-based access
- Deploy and verification steps

Role model used in this project:
- superadmin: full access (user lifecycle and role management)
- admin: operational admin access
- moderator: limited moderation access

## Prerequisites

- Firebase project configured and linked to this repo
- Email/Password auth enabled in Firebase Authentication
- Local Node.js environment ready
- serviceAccountKey.json available in repo root for one-time bootstrap script

## Step 1: Create Initial Auth User

1. Open Firebase Console -> Authentication -> Users.
2. Create the initial user with email and password.
3. Keep this email for superadmin bootstrap in next step.

## Step 2: Bootstrap First Superadmin

Use the local script in this repository:

```bash
node setup-superadmin.js your-admin@email.com
```

What this script does:
- Sets custom claims: { admin: true, role: "superadmin" }
- Creates/updates users/{uid} profile in Firestore with superadmin role

After script success:
- Sign out and sign in again in the admin UI to refresh token claims.

## Step 3: Deploy Current Security/Auth Logic

```bash
firebase deploy --only functions,firestore:rules
```

This applies:
- Role-based function authorization checks
- Current Firestore rules for admin/user operations

## Step 4: Verify Superadmin Access

1. Log in at /admin-login with the bootstrapped account.
2. Confirm superadmin-level features are visible and usable.
3. Verify protected operations succeed (for example creating a user).

## Step 5: Create Additional Users (Recommended Path)

Once first superadmin is active:

1. Use admin portal user management (preferred)
2. Or call admin functions with a valid superadmin bearer token:
   - createAdminUser
   - updateUserRole
   - listAdminUsers
   - deleteAdminUser

Important behavior:
- setAdminRole requires an already-authenticated admin user.
- It is not a first-admin bootstrap endpoint.

## Security Notes

- Do not commit serviceAccountKey.json.
- Keep bootstrap usage limited and rotate service-account credentials per policy.
- Use least privilege when assigning roles.
- Re-authentication is required after claim changes.

## Troubleshooting

Superadmin permissions not visible:
- Sign out and sign in again to refresh token claims.
- Confirm custom claims were set on the target user.

Permission denied on admin endpoints:
- Verify bearer token belongs to user with admin=true and required role.
- Ensure latest functions and firestore rules are deployed.

Bootstrap script fails user-not-found:
- Create the auth user first in Firebase Authentication and run script again.

## Related Docs

- ADMIN_ROLES_GUIDE.md for role capabilities and admin UX
- SECURITY_SETUP.md for full security architecture and verification checklist
- SECURITY.md for vulnerability disclosure and policy
