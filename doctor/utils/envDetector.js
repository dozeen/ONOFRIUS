const fs = require('fs');
const os = require('os');

function getEnvironmentInfo() {
  const isWSL = fs.existsSync('/proc/version') && fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft');
  let osName = os.type() + ' ' + os.release();

  if (fs.existsSync('/etc/os-release')) {
    const content = fs.readFileSync('/etc/os-release', 'utf8');
    const match = content.match(/PRETTY_NAME="([^"]+)"/);
    if (match) {
      osName = match[1] + (isWSL ? ' (WSL2)' : '');
    }
  } else if (os.platform() === 'darwin') {
    osName = `macOS ${os.release()}`;
  } else if (os.platform() === 'win32') {
    osName = `Windows ${os.release()}`;
  }

  return {
    isWSL,
    osName,
    nodeVersion: process.version
  };
}

module.exports = { getEnvironmentInfo };
