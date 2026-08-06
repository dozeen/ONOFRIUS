const fs = require('fs');
const path = require('path');

module.exports = {
  id: 'config',
  name: 'Configuration',
  showTick: true,
  critical: true,
  async run(context) {
    const envPath = path.join(context.rootDir, '.env');
    const envExamplePath = path.join(context.rootDir, '.env.example');

    if (!fs.existsSync(envPath)) {
      if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
      } else {
        const defaultEnv = `OLLAMA_HOST=http://localhost:11434\nOLLAMA_MODEL=qwen2.5:latest\nLOG_LEVEL=INFO\nWHATSAPP_CLIENT_ID=gordon3\nMEMORY_PATH=./memory\nDEBUG=false\n`;
        fs.writeFileSync(envPath, defaultEnv);
      }
    }

    const dirs = ['memory', 'logs', '.wwebjs_auth', '.wwebjs_cache'];
    for (const d of dirs) {
      const fullDir = path.join(context.rootDir, d);
      if (!fs.existsSync(fullDir)) {
        fs.mkdirSync(fullDir, { recursive: true });
      }
    }

    return { success: true };
  }
};
