const path = require('path');

class BootstrapEngine {
  constructor(options = {}) {
    this.options = {
      rootDir: options.rootDir || path.resolve(__dirname, '..'),
      silent: options.silent || false,
      autoFix: options.autoFix !== undefined ? options.autoFix : true
    };
    this.steps = [];
    this.context = {
      rootDir: this.options.rootDir,
      autoFix: this.options.autoFix,
      results: {}
    };
  }

  registerStep(step) {
    this.steps.push(step);
  }

  async run() {
    console.clear();
    console.log("══════════════════════════════════════");
    console.log("ONOFRIUS Bootstrap Engine");
    console.log("══════════════════════════════════════\n");

    for (const step of this.steps) {
      try {
        const stepName = step.name || step.id;
        const result = await step.run(this.context);
        this.context.results[step.id] = result;

        if (result && result.success !== false) {
          if (step.showTick !== false) {
            console.log(`✓ ${stepName}`);
          }
        } else {
          console.log(`❌ ${stepName}: ${result ? result.message : 'Failed'}`);
          if (step.critical !== false) {
            console.error(`\n[Bootstrap] Critical step failed: ${stepName}. Stopping execution.`);
            process.exit(1);
          }
        }
      } catch (err) {
        console.log(`❌ ${step.name || step.id}: ${err.message}`);
        if (step.critical !== false) {
          console.error(`\n[Bootstrap] Exception in step ${step.name || step.id}:`, err);
          process.exit(1);
        }
      }
    }
  }
}

module.exports = BootstrapEngine;
