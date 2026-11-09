const fs = require('fs');
const path = require('path');
const DoctorFixer = require('../DoctorFixer');

module.exports = {
  id: 'plugins',
  name: 'Plugins & Manifests',

  async run(context) {
    const pluginsDir = path.join(context.rootDir, 'plugins');
    
    if (!fs.existsSync(pluginsDir)) {
      return {
        id: this.id,
        name: this.name,
        status: 'WARN',
        message: 'Plugins directory missing.',
        details: 'Run with --fix to recreate plugins directory.',
        fixable: true
      };
    }

    try {
      const items = fs.readdirSync(pluginsDir);
      const subdirs = items.filter(item => {
        const full = path.join(pluginsDir, item);
        return fs.statSync(full).isDirectory();
      });

      let validCount = 0;
      const invalidPlugins = [];

      for (const dir of subdirs) {
        const manifestPath = path.join(pluginsDir, dir, 'manifest.json');
        const indexJs = path.join(pluginsDir, dir, 'index.js');
        if (fs.existsSync(manifestPath) || fs.existsSync(indexJs)) {
          validCount++;
        } else {
          invalidPlugins.push(dir);
        }
      }

      if (invalidPlugins.length > 0) {
        return {
          id: this.id,
          name: this.name,
          status: 'WARN',
          message: `Plugins directory ok (${validCount} active plugin(s)), but ${invalidPlugins.length} directory lacks manifest.json or index.js.`,
          details: `Incomplete plugins: ${invalidPlugins.join(', ')}`,
          fixable: false
        };
      }

      return {
        id: this.id,
        name: this.name,
        status: 'OK',
        message: `Plugin system healthy (${validCount} plugin(s) found).`,
        fixable: false
      };
    } catch (err) {
      return {
        id: this.id,
        name: this.name,
        status: 'ERROR',
        message: `Failed to inspect plugins folder: ${err.message}`,
        fixable: false
      };
    }
  },

  async fix(context, prevResult) {
    const pluginsDir = path.join(context.rootDir, 'plugins');
    const created = DoctorFixer.ensureDirectory(pluginsDir);
    return {
      fixed: created,
      message: 'Created plugins directory.'
    };
  }
};
