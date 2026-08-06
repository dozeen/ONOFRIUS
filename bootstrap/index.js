const path = require('path');
const BootstrapEngine = require('./BootstrapEngine');

const step01_Doctor = require('./steps/01_DoctorStep');
const step02_AutoFix = require('./steps/02_AutoFixStep');
const step03_Package = require('./steps/03_PackageStep');
const step04_Browser = require('./steps/04_BrowserStep');
const step05_Ollama = require('./steps/05_OllamaStep');
const step06_Model = require('./steps/06_ModelStep');
const step07_Config = require('./steps/07_ConfigStep');
const step08_WhatsApp = require('./steps/08_WhatsAppStep');
const step09_Kernel = require('./steps/09_KernelStep');
const step10_Ready = require('./steps/10_ReadyStep');

async function bootstrap() {
  const engine = new BootstrapEngine({
    rootDir: path.resolve(__dirname, '..')
  });

  engine.registerStep(step01_Doctor);
  engine.registerStep(step02_AutoFix);
  engine.registerStep(step03_Package);
  engine.registerStep(step04_Browser);
  engine.registerStep(step05_Ollama);
  engine.registerStep(step06_Model);
  engine.registerStep(step07_Config);
  engine.registerStep(step08_WhatsApp);
  engine.registerStep(step09_Kernel);
  engine.registerStep(step10_Ready);

  await engine.run();
}

if (require.main === module) {
  bootstrap().catch(err => {
    console.error('Fatal error during Bootstrap:', err);
    process.exit(1);
  });
}

module.exports = bootstrap;
