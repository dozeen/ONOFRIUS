const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

function getDistroInstallCommand() {
  const platform = os.platform();
  if (platform === 'darwin') {
    return 'brew install --cask google-chrome';
  }
  if (platform === 'win32') {
    return 'winget install Google.Chrome';
  }
  if (platform === 'linux') {
    if (fs.existsSync('/etc/os-release')) {
      const osRelease = fs.readFileSync('/etc/os-release', 'utf8').toLowerCase();
      if (osRelease.includes('ubuntu') || osRelease.includes('debian')) {
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
      const installCmd = getDistroInstallCommand();
      return {
        id: this.id,
        name: this.name,
        status: 'ERROR',
        message: 'No Chrome/Chromium binary found in PATH or puppeteer cache.',
        details: `Install browser using your package manager:
       -> ${installCmd}`,
        fixable: false
      };
    }
  }
};
