const os = require('os');

module.exports = {
  id: 'memory',
  name: 'System RAM & Memory',

  async run(context) {
    try {
      const totalMemBytes = os.totalmem();
      const freeMemBytes = os.freemem();

      const totalGb = (totalMemBytes / (1024 * 1024 * 1024)).toFixed(2);
      const freeMb = Math.round(freeMemBytes / (1024 * 1024));

      if (freeMb < 512) {
        return {
          id: this.id,
          name: this.name,
          status: 'WARN',
          message: `Low free RAM: ${freeMb} MB available of ${totalGb} GB total.`,
          details: 'Heavy LLM model inference may slow down or fail.',
          fixable: false
        };
      } else {
        return {
          id: this.id,
          name: this.name,
          status: 'OK',
          message: `System RAM sufficient: ${freeMb} MB free / ${totalGb} GB total.`,
          fixable: false
        };
      }
    } catch (err) {
      return {
        id: this.id,
        name: this.name,
        status: 'ERROR',
        message: `Memory check failed: ${err.message}`,
        fixable: false
      };
    }
  }
};
