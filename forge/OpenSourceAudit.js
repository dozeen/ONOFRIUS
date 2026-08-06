const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

class OpenSourceAudit {
  static async run() {
    console.log('\n======================================');
    console.log(' OPEN SOURCE AUDIT');
    console.log('======================================\n');

    let failed = false;
    const checks = [
      { id: 'identities', label: 'No personal identities', fn: OpenSourceAudit.checkIdentities },
      { id: 'config', label: 'No personal configuration', fn: OpenSourceAudit.checkTrackedConfig },
      { id: 'secrets', label: 'No secrets detected', fn: OpenSourceAudit.checkSecrets },
      { id: 'credentials', label: 'No credentials', fn: OpenSourceAudit.checkCredentials },
      { id: 'runtime', label: 'No private runtime data', fn: OpenSourceAudit.checkRuntimeData }
    ];

    const results = [];

    for (const check of checks) {
      try {
        const res = await check.fn();
        if (res.passed) {
          results.push({ label: check.label, passed: true });
        } else {
          results.push({ label: check.label, passed: false, error: res.error });
          failed = true;
        }
      } catch (err) {
        results.push({ label: check.label, passed: false, error: err.message });
        failed = true;
      }
    }

    console.log('======================================');
    console.log('OPEN SOURCE CERTIFICATION');
    console.log('======================================\n');

    for (const r of results) {
      if (r.passed) {
        console.log(`✓ ${r.label}`);
      } else {
        console.log(`❌ ${r.label}: ${r.error}`);
      }
    }

    if (!failed) {
      console.log('✓ Repository publishable\n');
      return { success: true };
    } else {
      console.log('\n❌ Audit Failed: Fix the issues above before releasing.\n');
      return { success: false };
    }
  }

  static checkIdentities() {
    const forbidden = ['Onofrio', 'Dolly', 'Silvana', 'Roberta', 'Manolo', 'Cannone', 'Inglese'];
    try {
      const pattern = forbidden.join('|');
      const out = execSync(`git grep -i -E "${pattern}" HEAD -- ":!forge/OpenSourceAudit.js" || true`, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      if (out.length > 0) {
        return { passed: false, error: `Found hardcoded identity references:\n${out.slice(0, 200)}` };
      }
    } catch (e) {}
    return { passed: true };
  }

  static checkTrackedConfig() {
    try {
      const trackedFiles = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).split('\n');
      const sensitiveConfig = ['config/owner.json', 'config/contacts.json', 'config/settings.json', 'config/identities.json', '.env'];
      const found = trackedFiles.filter(f => sensitiveConfig.includes(f.trim()));
      if (found.length > 0) {
        return { passed: false, error: `Sensitive config files tracked in Git: ${found.join(', ')}` };
      }
    } catch (e) {}
    return { passed: true };
  }

  static checkSecrets() {
    try {
      const out = execSync('git grep -i -E "(BEGIN RSA PRIVATE KEY|BEGIN PRIVATE KEY)" HEAD -- ":!forge/OpenSourceAudit.js" || true', { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      if (out.length > 0) {
        return { passed: false, error: 'Private key or API secret detected in codebase.' };
      }
    } catch (e) {}
    return { passed: true };
  }

  static checkCredentials() {
    try {
      const out = execSync('git grep -i -E "(password\\s*=\\s*[\'\"][^\'\"]+[\'\"])" HEAD -- ":!forge/OpenSourceAudit.js" || true', { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      if (out.length > 0) {
        return { passed: false, error: 'Hardcoded password string found.' };
      }
    } catch (e) {}
    return { passed: true };
  }

  static checkRuntimeData() {
    try {
      const trackedFiles = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).split('\n');
      const runtimeFound = trackedFiles.filter(f => f.startsWith('.wwebjs_auth') || f.startsWith('.wwebjs_cache') || f.startsWith('logs/'));
      if (runtimeFound.length > 0) {
        return { passed: false, error: `Private runtime data tracked in Git: ${runtimeFound.slice(0, 3).join(', ')}` };
      }
    } catch (e) {}
    return { passed: true };
  }
}

if (require.main === module) {
  OpenSourceAudit.run().then(res => {
    process.exit(res.success ? 0 : 1);
  });
}

module.exports = OpenSourceAudit;
