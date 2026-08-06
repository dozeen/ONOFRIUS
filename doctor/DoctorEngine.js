const path = require('path');
const fs = require('fs');

class DoctorEngine {
  constructor(options = {}) {
    this.options = {
      fix: options.fix || false,
      json: options.json || false,
      checkFilter: options.checkFilter || null,
      rootDir: options.rootDir || path.resolve(__dirname, '..')
    };
    this.checks = [];
  }

  registerCheck(checkModule) {
    this.checks.push(checkModule);
  }

  loadChecksFromDir(checksDir = path.join(__dirname, 'checks')) {
    if (!fs.existsSync(checksDir)) return;
    const files = fs.readdirSync(checksDir).sort();
    for (const file of files) {
      if (file.endsWith('.js')) {
        try {
          const checkModule = require(path.join(checksDir, file));
          if (checkModule && typeof checkModule.run === 'function') {
            this.registerCheck(checkModule);
          }
        } catch (err) {
          console.error(`[DoctorEngine] Failed to load check module ${file}:`, err.message);
        }
      }
    }
  }

  async runAll() {
    const results = [];
    let checksToRun = this.checks;

    if (this.options.checkFilter) {
      const filterLower = this.options.checkFilter.toLowerCase();
      checksToRun = checksToRun.filter(c => (c.name || '').toLowerCase().includes(filterLower) || (c.id || '').toLowerCase().includes(filterLower));
    }

    for (const check of checksToRun) {
      const context = {
        rootDir: this.options.rootDir,
        fix: this.options.fix
      };

      let result;
      try {
        result = await check.run(context);
      } catch (err) {
        result = {
          id: check.id || check.name,
          name: check.name || 'Unknown Check',
          status: 'ERROR',
          message: `Check execution threw an exception: ${err.message}`,
          details: err.stack,
          fixable: false
        };
      }

      if (this.options.fix && result.status !== 'OK' && result.fixable && typeof check.fix === 'function') {
        try {
          const fixResult = await check.fix(context, result);
          if (fixResult && fixResult.fixed) {
            result.status = 'FIXED';
            result.message = fixResult.message || `${result.name} auto-repaired successfully.`;
          } else if (fixResult && fixResult.message) {
            result.fixMessage = fixResult.message;
          }
        } catch (fixErr) {
          result.fixError = fixErr.message;
        }
      }

      results.push(result);
    }

    return results;
  }
}

module.exports = DoctorEngine;
