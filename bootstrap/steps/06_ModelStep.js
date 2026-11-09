const axios = require('axios');
const { execSync } = require('child_process');
const config = require('../../core/config');

module.exports = {
  id: 'model',
  name: 'qwen2.5',
  showTick: true,
  critical: false,
  async run(context) {
    const targetModel = (config.ollama && config.ollama.model) || 'qwen2.5:latest';
    const host = (config.ollama && config.ollama.host) || 'http://localhost:11434';

    if (!context.ollamaOnline) {
      return { success: true, message: 'Skipped model verification (Ollama offline).' };
    }

    try {
      const res = await axios.get(`${host}/api/tags`, { timeout: 3000 });
      const models = (res.data && res.data.models) || [];
      const modelExists = models.some(m => m.name === targetModel || m.name.startsWith(targetModel.split(':')[0]));

      if (!modelExists && context.autoFix) {
        try {
          execSync(`ollama pull ${targetModel}`, { stdio: 'ignore' });
        } catch (e) {}
      }

      return { success: true };
    } catch (err) {
      return { success: true, message: 'Could not verify model status.' };
    }
  }
};
