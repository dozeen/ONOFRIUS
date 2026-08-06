const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  id: 'packages',
  name: 'Packages',
  showTick: false,
  critical: true,
  async run(context) {
    const pkgPath = path.join(context.rootDir, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      return { success: false, message: 'package.json not found' };
    }
    const nodeModulesPath = path.join(context.rootDir, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      try {
        execSync('npm install --quiet', { cwd: context.rootDir, stdio: 'ignore' });
      } catch (err) {
        return { success: false, message: 'Failed to run npm install: ' + err.message };
      }
    }
    return { success: true };
  }
};
