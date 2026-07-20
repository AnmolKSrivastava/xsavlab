# Security Maintenance Guide

## Quick Reference for Future Security Updates

### Weekly Security Check
```bash
# Check both frontend and functions
npm run security:check
```

### When Vulnerabilities Appear

#### Step 1: Assess Severity
```bash
npm audit
```

#### Step 2: Try Auto-Fix First
```bash
# Non-breaking fixes
npm audit fix

# If needed (creates breaking changes)
npm audit fix --force
```

#### Step 3: Manual Fixes via Overrides
If auto-fix doesn't work, add to `package.json`:

```json
{
  "overrides": {
    "vulnerable-package": "^safe-version"
  }
}
```

Then reinstall:
```bash
rm -r node_modules
rm package-lock.json
npm install
```

### For Cloud Functions

Always use legacy peer deps:
```bash
cd functions
npm install --legacy-peer-deps
```

### Preventing Vulnerabilities

1. **Pin Dependencies**: Use `^` to allow patch updates
2. **Review Updates**: Check changelog before upgrading
3. **Test After Updates**: Run full test suite
4. **Use npm overrides**: Control transitive dependencies
5. **Enable GitHub Dependabot**: Automated security alerts

### Common Issues & Solutions

#### Issue: Peer Dependency Conflicts
**Solution**: Use `--legacy-peer-deps` flag

#### Issue: Breaking Changes Required
**Solution**: Use npm overrides instead of direct upgrades

#### Issue: Nested Dependency Vulnerable
**Solution**: Add override in root package.json

### Security Checklist

- [ ] Run `npm audit` weekly
- [ ] Check GitHub security alerts
- [ ] Update dependencies monthly
- [ ] Test after each security update
- [ ] Document all security changes
- [ ] Review package-lock.json changes

### Emergency Response

If a critical vulnerability is discovered:

1. **Immediate Action**:
   ```bash
   npm audit
   npm audit fix --force
   ```

2. **Test Immediately**:
   ```bash
   npm test
   npm start
   ```

3. **Deploy Hotfix** if production affected

4. **Document** in SECURITY_FIXES_*.md

### Contact & Resources

- **npm Security**: https://www.npmjs.com/advisories
- **GitHub Advisory**: https://github.com/advisories
- **Snyk**: https://snyk.io/vuln
- **CVE Database**: https://cve.mitre.org

---

**Last Updated**: 2026-07-20  
**Status**: System Secure ✅
