const { execSync } = require('child_process');
const { getEnvironmentInfo } = require('../utils/envDetector');

module.exports = {
  id: 'ffmpeg',
  name: 'ffmpeg Media Transcoder',

  async run(context) {
    const env = getEnvironmentInfo();

    try {
      const output = execSync('ffmpeg -version', { encoding: 'utf8' }).trim();
      const firstLine = output.split('\n')[0];
      return {
        id: this.id,
        name: this.name,
        status: 'OK',
        message: `${firstLine.split(' Copyright')[0]} available.`,
        fixable: false
      };
    } catch (err) {
      let details = 'ffmpeg is recommended for processing WhatsApp audio & voice messages.';
      if (env.isWSL) {
        details += '\n       -> Install on WSL using:\n       -> sudo apt update && sudo apt install -y ffmpeg';
      }

      return {
        id: this.id,
        name: this.name,
        status: 'WARN',
        message: 'ffmpeg binary not found in PATH.',
        details,
        fixable: false
      };
    }
  }
};
