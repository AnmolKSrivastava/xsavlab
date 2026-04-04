# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 0.1.0 | :x:                |

## Security Features

This project implements comprehensive security measures:

### 1. **Database Security**
- Firestore security rules with admin-only access
- No direct client-side database writes
- Role-based access control (RBAC)

### 2. **API Security**
- Rate limiting (3/hour, 10/day per IP)
- CORS whitelist protection
- Request size limits (10KB max)
- Input validation & sanitization
- HTML escaping to prevent XSS

### 3. **Authentication & Authorization**
- Firebase ID token verification
- Admin role validation
- Secure token handling

### 4. **Application Security**
- Content Security Policy (CSP) headers
- HTTPS enforcement (HSTS)
- Clickjacking protection (X-Frame-Options)
- MIME sniffing prevention
- XSS protection headers

### 5. **Dependency Security**
- Automated npm audit on every commit
- Weekly scheduled security scans
- Dependabot for automated updates
- Critical vulnerability blocking in CI/CD

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. **Do NOT** open a public issue

Security vulnerabilities should be reported privately to avoid exploitation.

### 2. **Email us directly**

Send details to: **security@xsavlab.com** or **xsavtechnology@gmail.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. **Response Timeline**

- **Initial Response**: Within 24 hours
- **Status Update**: Within 72 hours
- **Fix Timeline**: Critical issues within 7 days, others within 30 days

### 4. **What to Expect**

- Acknowledgment of your report
- Regular updates on our progress
- Credit in release notes (if desired)
- Potential bug bounty (for critical findings)

## Security Best Practices for Contributors

### Code Review
- All PRs require review before merging
- Security-sensitive changes require additional scrutiny
- Automated security scans must pass

### Dependencies
- Keep dependencies up to date
- Review Dependabot PRs promptly
- Never commit secrets or credentials
- Use environment variables for sensitive data

### Testing
- Write tests for security features
- Test input validation thoroughly
- Verify rate limiting works
- Check authentication flows

### Secrets Management
- Use Firebase Secret Manager for Cloud Functions
- Never commit `.env` files
- Rotate credentials regularly
- Use strong, unique passwords

## Security Audit Schedule

### Automated
- **Every Commit**: npm audit on CI/CD
- **Weekly**: Scheduled security scan (Mondays 9 AM UTC)
- **Monthly**: Dependabot dependency updates

### Manual
- **Quarterly**: Full security review
- **Annually**: Third-party security assessment
- **As Needed**: Post-incident reviews

## Security Contacts

- **Primary**: security@xsavlab.com
- **Backup**: xsavtechnology@gmail.com
- **Emergency**: Use GitHub Security Advisory

## Known Security Measures

✅ Firestore Security Rules  
✅ Admin Authentication with Role Checking  
✅ Rate Limiting (IP-based)  
✅ HTML Sanitization (XSS Prevention)  
✅ CORS Whitelist  
✅ CSP Headers  
✅ Request Size Limits  
✅ Input Length Validation  
✅ Error Information Masking  
✅ Security Headers (7 types)  
✅ HTTPS Enforcement (HSTS)  
✅ Automated Dependency Scanning  

## Vulnerability Disclosure Policy

We follow **responsible disclosure**:

1. **Report** privately to security team
2. **Investigation** - we assess and develop fix
3. **Fix Deployment** - patch released
4. **Public Disclosure** - after fix is deployed (coordinated)
5. **Credit** - reporter acknowledged (optional)

## Security Updates

Subscribe to security updates:
- Watch this repository
- Follow our security advisories
- Check release notes for security patches

## Compliance

This project follows:
- OWASP Top 10 security standards
- CWE/SANS Top 25 mitigations
- Firebase security best practices
- GDPR data protection principles

## Additional Resources

- [SECURITY_SETUP.md](./SECURITY_SETUP.md) - Detailed security implementation
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

---

**Last Updated**: April 4, 2026  
**Version**: 1.0.0
