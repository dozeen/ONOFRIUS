// Personal migration rules belong outside the distributable repository.
const { spawnSync } = require('child_process');
const path = require('path');
async function buildCore() {
  const builder = process.env.PRIVATE_CORE_BUILDER;
  if (!builder || !path.isAbsolute(builder)) throw new Error('Core import blocked: configure a trusted external builder and audit its output before staging.');
  const result = spawnSync(process.execPath, [builder], { stdio: 'inherit' });
  if (result.error || result.status !== 0) throw new Error('External core import failed.');
}
if (require.main === module) buildCore().catch(e => { console.error(e.message); process.exitCode = 1; });
module.exports = buildCore;
