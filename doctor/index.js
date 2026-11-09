const path = require('path');
const DoctorEngine = require('./DoctorEngine');
const ReportPrinter = require('./ReportPrinter');

async function main() {
  const args = process.argv.slice(2);
  const fix = args.includes('--fix') || args.includes('-f');
  const json = args.includes('--json');
  
  let checkFilter = null;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--check=')) {
      checkFilter = arg.split('=')[1];
    } else if (arg === '--check' || arg === '-c') {
      if (i + 1 < args.length) {
        checkFilter = args[i + 1];
        i++;
      }
    }
  }

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
