module.exports = {
  id: 'kernel',
  name: 'Kernel',
  showTick: true,
  critical: true,
  async run(context) {
    const kernel = require('../../core/kernel');
    try {
      await kernel.boot();
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Kernel boot failed: ' + err.message };
    }
  }
};
