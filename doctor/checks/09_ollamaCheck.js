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
                message: `Ollama operational at ${host} (${modelCount} model(s) available: ${models.slice(0, 3).join(', ')}${modelCount > 3 ? '...' : ''}).`,
                fixable: false
              });
            } else {
              resolve({
                id: this.id,
                name: this.name,
                status: 'WARN',
                message: `Ollama returned HTTP status ${res.statusCode}.`,
                details: 'Make sure Ollama service is running.',
                fixable: false
              });
            }
          } catch (e) {
            resolve({
              id: this.id,
              name: this.name,
              status: 'WARN',
              message: `Failed to parse response from Ollama at ${host}.`,
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
          message: `Ollama service unreachable at ${host}: ${err.message}`,
          details: 'Run "ollama serve" or check if Ollama is running in background.',
          fixable: false
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          id: this.id,
          name: this.name,
          status: 'WARN',
          message: `Connection to Ollama at ${host} timed out.`,
          fixable: false
        });
      });
    });
  }
};
