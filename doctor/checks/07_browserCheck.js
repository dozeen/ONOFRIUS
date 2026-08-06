const { execSync } = require('child_process');
const fs = require('fs');

module.exports = {
  id: 'browser',
  name: 'Headless Browser (Puppeteer/Chromium)',

  async run(context) {
    let browserPath = null;

    // Check system binaries first
    const binaries = ['google-chrome', 'chromium-browser', 'chromium'];
    for (const bin of binaries) {
      try {
        const path = execSync(`which ${bin}`, { encoding: 'utf8' }).trim();
        if (path && fs.existsSync(path)) {
          browserPath = path;
          break;
        }
      } catch (e) {
        // Not in PATH
      }
    }

    // Check node_modules puppeteer cache if no system binary
    if (!browserPath) {
      try {
        const puppeteer = require('whatsapp-web.js/node_modules/puppeteer-core') || require('puppeteer-core');
        if (puppeteer && typeof puppeteer.executablePath === 'function') {
          const pPath = puppeteer.executablePath();
          if (pPath && fs.existsSync(pPath)) {
            browserPath = pPath;
          }
        }
      } catch (e) {
        // Puppeteer not loaded directly
      }
    }

    if (browserPath) {
      return {
        id: this.id,
        name: this.name,
        status: 'OK',
        message: `Headless browser found at: ${browserPath}`,
        fixable: false
      };
    } else {
      return {
        id: this.id,
        name: this.name,
        status: 'ERROR',
        message: 'No Chrome/Chromium binary found in PATH or puppeteer cache.',
        details: 'Install Google Chrome or Chromium to enable browser engine.',
        fixable: false
      };
    }
  }
};
