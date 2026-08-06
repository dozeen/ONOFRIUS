const fs = require('fs');
const path = require('path');
const DoctorFixer = require('../DoctorFixer');

module.exports = {
  id: 'env',
  name: 'Environment Config (.env)',

  async run(context) {
    const envPath = path.join(context.rootDir, '.env');
    if (fs.existsSync(envPath)) {
      return {
        id: this.id,
        name: this.name,
        status: 'OK',
        message: '.env configuration file present.',
        fixable: false
      };
    } else {
      return {
        id: this.id,
        name: this.name,
        status: 'WARN',
        message: '.env configuration file missing.',
        details: 'Run with --fix to automatically generate default .env file.',
        fixable: true
      };
    }
  },

  async fix(context, prevResult) {
    const envPath = path.join(context.rootDir, '.env');
    const defaultEnv = `# ONOFRIUS Environment Configuration\nPORT=3000\nOLLAMA_HOST=http://localhost:11434\nLOG_LEVEL=info\n`;
    const created = DoctorFixer.ensureFileFromTemplate(envPath, defaultEnv);
    return {
      fixed: created,
      message: 'Created default .env configuration file.'
    };
  }
};
