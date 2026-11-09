const { execSync } = require('child_process');

module.exports = {
  id: 'storage',
  name: 'Storage & Disk Space',

  async run(context) {
    try {
      const output = execSync(`df -P "${context.rootDir}"`, { encoding: 'utf8' }).trim();
      const lines = output.split('\n');
      if (lines.length >= 2) {
        const parts = lines[1].split(/\s+/);
        const availableKb = parseInt(parts[3], 10);
        const availableMb = Math.round(availableKb / 1024);
        const availableGb = (availableMb / 1024).toFixed(2);

        if (availableMb < 250) {
          return {
            id: this.id,
            name: this.name,
            status: 'ERROR',
            message: `Critically low disk space: ${availableMb} MB free.`,
            details: 'Clear disk space to allow local model execution and logging.',
            fixable: false
          };
        } else if (availableMb < 1024) {
          return {
            id: this.id,
            name: this.name,
            status: 'WARN',
            message: `Low disk space: ${availableMb} MB free (${availableGb} GB).`,
            details: 'At least 1-2 GB free space recommended for optimal performance.',
            fixable: false
          };
        } else {
          return {
            id: this.id,
            name: this.name,
            status: 'OK',
            message: `Disk space sufficient: ${availableGb} GB available.`,
            fixable: false
          };
        }
      }
      return {
        id: this.id,
        name: this.name,
        status: 'OK',
        message: 'Disk space check passed.',
        fixable: false
      };
    } catch (err) {
      return {
        id: this.id,
        name: this.name,
        status: 'WARN',
        message: `Could not determine free disk space: ${err.message}`,
        fixable: false
      };
    }
  }
};
