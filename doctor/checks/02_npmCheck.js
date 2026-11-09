const { execSync } = require('child_process');

module.exports = {
  id: 'npm',
  name: 'npm Package Manager',

  async run(context) {
    try {
      const output = execSync('npm --version', { encoding: 'utf8' }).trim();
      return {
        id: this.id,
        name: this.name,
        status: 'OK',
        message: `npm version ${output} available.`,
        fixable: false
      };
    } catch (err) {
      return {
        id: this.id,
        name: this.name,
        status: 'ERROR',
        message: `npm binary check failed: ${err.message}`,
        details: 'Make sure npm is installed and added to PATH.',
        fixable: false
      };
    }
  }
};
