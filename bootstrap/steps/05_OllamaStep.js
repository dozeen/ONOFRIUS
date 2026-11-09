const axios = require('axios');
const { exec, execSync } = require('child_process');
const config = require('../../core/config');

module.exports = {
  id: 'ollama',
  name: 'Ollama',
  showTick: true,
  critical: false,
  async run(context) {
    const host = (config.ollama && config.ollama.host) || 'http://localhost:11434';
    
    try {
      await axios.get(`${host}/api/tags`, { timeout: 2000 });
      context.ollamaOnline = true;
      return { success: true };
    } catch (err) {
      if (context.autoFix) {
        try {
          exec('ollama serve > /dev/null 2>&1 &');
          await new Promise(r => setTimeout(r, 3000));
          await axios.get(`${host}/api/tags`, { timeout: 3000 });
          context.ollamaOnline = true;
          return { success: true };
        } catch (e) {}
      }
      return { success: true, message: 'Ollama is offline or unreachable.' };
    }
  }
};
