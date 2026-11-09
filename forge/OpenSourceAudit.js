const { spawnSync } = require('child_process');
const path = require('path');
class OpenSourceAudit {
  static async run() {
    const scanner = process.env.PRIVACY_SCANNER;
    if (!scanner || !path.isAbsolute(scanner)) {
      console.error('Privacy audit blocked: set PRIVACY_SCANNER to the trusted external scanner.');
      return { success: false };
    }
    const result = spawnSync('python3', [scanner, path.resolve(__dirname, '..')], { stdio: 'inherit' });
    return { success: !result.error && result.status === 0 };
  }
}
if (require.main === module) OpenSourceAudit.run().then(r => { process.exitCode = r.success ? 0 : 1; });
module.exports = OpenSourceAudit;
