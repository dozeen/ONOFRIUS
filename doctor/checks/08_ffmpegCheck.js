const { execSync } = require('child_process');

module.exports = {
  id: 'ffmpeg',
  name: 'ffmpeg Media Transcoder',

  async run(context) {
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
      return {
        id: this.id,
        name: this.name,
        status: 'WARN',
        message: 'ffmpeg binary not found in PATH.',
        details: 'ffmpeg is recommended for processing WhatsApp audio & voice messages (ogg/opus -> mp3/wav).',
        fixable: false
      };
    }
  }
};
