const path = require('path');
const DoctorEngine = require('../../doctor/DoctorEngine');

module.exports = {
  id: 'autofix',
  name: 'Auto Fix',
  showTick: false,
  critical: false,
  async run(context) {
    if (!context.doctorResults) return { success: true };
    const failing = context.doctorResults.filter(r => r.status !== 'OK' && r.fixable);
    if (failing.length === 0) return { success: true };

    const engine = new DoctorEngine({
      rootDir: context.rootDir,
      fix: true
    });
    engine.loadChecksFromDir(path.join(context.rootDir, 'doctor', 'checks'));
    const fixResults = await engine.runAll();
    context.doctorResults = fixResults;
    return { success: true };
  }
};
