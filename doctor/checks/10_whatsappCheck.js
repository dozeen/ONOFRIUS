const fs = require('fs');
const path = require('path');
const DoctorFixer = require('../DoctorFixer');

module.exports = {
  id: 'whatsapp',
  name: 'WhatsApp Session & Auth',

  async run(context) {
    const authDir = path.join(context.rootDir, '.wwebjs_auth');
    const cacheDir = path.join(context.rootDir, '.wwebjs_cache');

    const authExists = fs.existsSync(authDir);
    let sessionCount = 0;

    if (authExists) {
      try {
        const files = fs.readdirSync(authDir);
        sessionCount = files.filter(f => f.startsWith('session-')).length;
      } catch (e) {
        // Read fail
      }
    }

    if (authExists && sessionCount > 0) {
      return {
        id: this.id,
        name: this.name,
        status: 'OK',
        message: `WhatsApp authentication directory active (${sessionCount} active session folder(s)).`,
        fixable: false
      };
    } else if (authExists) {
      return {
        id: this.id,
        name: this.name,
        status: 'WARN',
        message: 'WhatsApp auth folder initialized, but no active session created yet.',
        details: 'Run ONOFRIUS setup or app to scan QR code.',
        fixable: false
      };
    } else {
      return {
        id: this.id,
        name: this.name,
        status: 'WARN',
        message: 'WhatsApp authentication directory (.wwebjs_auth) missing.',
        details: 'Run with --fix to initialize auth directories.',
        fixable: true
      };
    }
  },

  async fix(context, prevResult) {
    const authDir = path.join(context.rootDir, '.wwebjs_auth');
    const cacheDir = path.join(context.rootDir, '.wwebjs_cache');

    const createdAuth = DoctorFixer.ensureDirectory(authDir);
    const createdCache = DoctorFixer.ensureDirectory(cacheDir);

    return {
      fixed: createdAuth || createdCache,
      message: 'Initialized .wwebjs_auth and .wwebjs_cache directories.'
    };
  }
};
