const fs = require('fs');
const path = require('path');
const DoctorFixer = require('../DoctorFixer');

module.exports = {
  id: 'permissions',
  name: 'Directory Permissions & Structure',

  requiredDirs: ['logs', 'config', 'memory', 'plugins', 'adapters'],

  async run(context) {
    const missingDirs = [];
    const unwritableDirs = [];

    for (const dirName of this.requiredDirs) {
      const fullPath = path.join(context.rootDir, dirName);
      if (!fs.existsSync(fullPath)) {
        missingDirs.push(dirName);
      } else {
        try {
          fs.accessSync(fullPath, fs.constants.R_OK | fs.constants.W_OK);
        } catch (err) {
          unwritableDirs.push(dirName);
        }
      }
    }

    if (missingDirs.length === 0 && unwritableDirs.length === 0) {
      return {
        id: this.id,
        name: this.name,
        status: 'OK',
        message: 'All core system directories exist and are writable.',
        fixable: false
      };
    } else {
      const issues = [];
      if (missingDirs.length > 0) issues.push(`Missing: [${missingDirs.join(', ')}]`);
      if (unwritableDirs.length > 0) issues.push(`Unwritable: [${unwritableDirs.join(', ')}]`);

      return {
        id: this.id,
        name: this.name,
        status: 'ERROR',
        message: `Directory structure/permission issues: ${issues.join('; ')}`,
        details: 'Run with --fix to recreate missing folders and adjust permissions.',
        fixable: true,
        missingDirs,
        unwritableDirs
      };
    }
  },

  async fix(context, prevResult) {
    let fixedAny = false;
    const missing = prevResult.missingDirs || [];

    for (const dirName of missing) {
      const fullPath = path.join(context.rootDir, dirName);
      if (DoctorFixer.ensureDirectory(fullPath)) {
        fixedAny = true;
      }
    }

    return {
      fixed: fixedAny,
      message: 'Recreated missing core system directories.'
    };
  }
};
