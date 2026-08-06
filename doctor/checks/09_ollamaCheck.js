const http = require('http');

module.exports = {
  id: 'ollama',
  name: 'Ollama LLM Engine',

  async run(context) {
    const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
    
    return new Promise((resolve) => {
      const url = `${host}/api/tags`;
      const req = http.get(url, { timeout: 3000 }, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const data = JSON.parse(body);
              const models = (data.models || []).map(m => m.name);
              const modelCount = models.length;
              resolve({
                id: this.id,
                name: this.name,
                status: 'OK',
                message: `Ollama operational at ${host} (${modelCount} model(s) available).`,
                fixable: false
              });
            } else {
              resolve({
                id: this.id,
                name: this.name,
                status: 'WARN',
                message: `Ollama Offline (HTTP ${res.statusCode}).`,
                details: 'Make sure Ollama service is running.',
                fixable: false
              });
            }
          } catch (e) {
            resolve({
              id: this.id,
              name: this.name,
              status: 'WARN',
              message: `Ollama Offline (Invalid response format from ${host}).`,
              fixable: false
            });
          }
        });
      });

      req.on('error', (err) => {
        resolve({
          id: this.id,
          name: this.name,
          status: 'WARN',
          message: `Ollama Offline (${err.message})`,
          details: 'Run "ollama serve" or "sudo systemctl start ollama" to enable local models.',
          fixable: false
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          id: this.id,
          name: this.name,
          status: 'WARN',
          message: `Ollama Offline (Connection timeout at ${host})`,
          fixable: false
        });
      });
    });
  }
};
