const path = require('path');

module.exports = {
  id: 'doctor',
  name: 'Doctor',
  showTick: false,
  critical: false,
  async run(context) {
    const DoctorEngine = require('../../doctor/DoctorEngine');
    const engine = new DoctorEngine({
      rootDir: context.rootDir,
      fix: false,
      json: true
    });
    engine.loadChecksFromDir(path.join(context.rootDir, 'doctor', 'checks'));
    const results = await engine.runAll();
    context.doctorResults = results;

    const nodeResult = results.find(r => r.id === 'node');
    if (nodeResult && nodeResult.status === 'OK') {
      console.log('✓ Node.js');
    } else {
      console.log(`❌ Node.js: ${nodeResult ? nodeResult.message : 'Missing'}`);
    }

    const gitResult = results.find(r => r.id === 'git');
    if (gitResult) {
      if (gitResult.status === 'OK') {
        console.log(`✓ ${gitResult.message}`);
      } else {
        console.log(`⚠ ${gitResult.message}`);
      }
    }

    const ffmpegResult = results.find(r => r.id === 'ffmpeg');
    if (ffmpegResult && ffmpegResult.status === 'OK') {
      console.log('✓ ffmpeg');
    } else {
      console.log('⚠️ ffmpeg (optional)');
    }

    return { success: true, results };
  }
};
