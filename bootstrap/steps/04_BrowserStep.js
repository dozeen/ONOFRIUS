const fs = require('fs');
const { execSync } = require('child_process');

module.exports = {
  id: 'browser',
  name: 'Chrome',
  showTick: true,
  critical: false,
  async run(context) {
    const candidates = [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ];

    let found = candidates.find(c => fs.existsSync(c));

    if (!found) {
      try {
        const whichOut = execSync('which google-chrome || which chromium-browser || which chromium', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
        if (whichOut) found = whichOut;
      } catch (e) {}
    }

    if (!found && context.autoFix) {
      try {
        execSync('sudo apt-get update -y && sudo apt-get install -y google-chrome-stable || sudo apt-get install -y chromium-browser', { stdio: 'ignore' });
        found = candidates.find(c => fs.existsSync(c));
      } catch (err) {}
    }

    if (found) {
      context.browserPath = found;
      return { success: true };
    }

    return { success: true, message: 'Chrome not found at standard path, puppeteer fallback will be used.' };
  }
};
