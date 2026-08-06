const path = require('path');
const DoctorEngine = require('./DoctorEngine');
const ReportPrinter = require('./ReportPrinter');

async function main() {
  const args = process.argv.slice(2);
  const fix = args.includes('--fix') || args.includes('-f');
  const json = args.includes('--json');
  const checkArg = args.find(a => a.startsWith('--check='));
  const checkFilter = checkArg ? checkArg.split('=')[1] : null;

  const engine = new DoctorEngine({
    fix,
    json,
    checkFilter,
    rootDir: path.resolve(__dirname, '..')
  });

  engine.loadChecksFromDir(path.join(__dirname, 'checks'));

  const results = await engine.runAll();
  ReportPrinter.print(results, { json, fix });

  const hasErrors = results.some(r => r.status === 'ERROR');
  if (hasErrors) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error('[Doctor] Fatal error running doctor:', err);
  process.exit(1);
});
