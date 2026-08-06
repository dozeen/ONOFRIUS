const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const { getEnvironmentInfo } = require('../utils/envDetector');

function getDistroInstallCommand() {
  const platform = os.platform();
  const env = getEnvironmentInfo();
  if (platform === 'darwin') {
    return 'brew install --cask google-chrome';
  }
  if (platform === 'win32') {
    return 'winget install Google.Chrome';
  }
  if (platform === 'linux') {
    if (env.isWSL || fs.existsSync('/etc/os-release')) {
      const osRelease = fs.existsSync('/etc/os-release') ? fs.readFileSync('/etc/os-release', 'utf8').toLowerCase() : '';
      if (env.isWSL || osRelease.includes('ubuntu') || osRelease.includes('debian')) {
        return 'sudo apt update && sudo apt install -y google-chrome-stable (or chromium-browser)';
      }
      if (osRelease.includes('fedora') || osRelease.includes('rhel') || osRelease.includes('centos')) {
        return 'sudo dnf install -y chromium';
      }
      if (osRelease.includes('arch') || osRelease.includes('manjaro')) {
        return 'sudo pacman -S chromium';
      }
      if (osRelease.includes('alpine')) {
        return 'apk add chromium';
      }
    }
    return 'sudo apt install -y google-chrome-stable';
  }
  return 'Install Google Chrome or Chromium for your operating system.';
}

module.exports = {
  id: 'browser',
  name: 'Headless Browser (Puppeteer/Chromium)',

  async run(context) {
    let browserPath = null;
    let browserName = 'Browser';

    const binaries = [
      { name: 'Google Chrome', bin: 'google-chrome-stable' },
      { name: 'Google Chrome', bin: 'google-chrome' },
      { name: 'Google Chrome Beta', bin: 'google-chrome-beta' },
      { name: 'Chromium', bin: 'chromium-browser' },
      { name: 'Chromium', bin: 'chromium' },
      { name: 'Chrome', bin: 'chrome' },
      { name: 'Microsoft Edge', bin: 'msedge' }
    ];

    for (const item of binaries) {
      try {
        const path = execSync(`which ${item.bin}`, { encoding: 'utf8' }).trim();
        if (path && fs.existsSync(path)) {
          browserPath = path;
          browserName = item.name;
          break;
        }
      } catch (e) {
        // Not in PATH
      }
    }

    if (!browserPath) {
      try {
        const puppeteer = require('whatsapp-web.js/node_modules/puppeteer-core') || require('puppeteer-core');
        if (puppeteer && typeof puppeteer.executablePath === 'function') {
          const pPath = puppeteer.executablePath();
          if (pPath && fs.existsSync(pPath)) {
            browserPath = pPath;
            browserName = 'Bundled Puppeteer Chromium';
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
        message: `${browserName} found at: ${browserPath}`,
        browserName,
        browserPath,
        fixable: false
      };
    } else {
      const installCmd = getDistroInstallCommand();
      return {
        id: this.id,
        name: this.name,
        status: 'ERROR',
        message: 'No Chrome/Chromium binary found in PATH or puppeteer cache.',
        details: `Install browser using your package manager:\n       -> ${installCmd}`,
        browserName: 'Missing',
        browserPath: null,
        fixable: false
      };
    }
  }
};
