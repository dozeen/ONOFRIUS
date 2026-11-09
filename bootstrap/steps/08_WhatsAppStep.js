module.exports = {
  id: 'whatsapp',
  name: 'WhatsApp',
  showTick: true,
  critical: true,
  async run(context) {
    const whatsapp = require('../../adapters/whatsapp');
    try {
      await whatsapp.start();
      await whatsapp.waitForReady();
      return { success: true };
    } catch (err) {
      return { success: false, message: 'WhatsApp login error: ' + err.message };
    }
  }
};
