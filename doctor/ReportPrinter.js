class ReportPrinter {
  static print(results, options = {}) {
    if (options.json) {
      console.log(JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2));
      return;
    }

    console.log('\n========================================');
    console.log('       ONOFRIUS DOCTOR REPORT          ');
    console.log('========================================\n');

    if (results.length === 0) {
      console.log('No diagnostic checks were registered or matched the filter.\n');
      return;
    }

    let okCount = 0;
    let warnCount = 0;
    let errorCount = 0;
    let fixedCount = 0;

    results.forEach(res => {
      let icon = '[ ? ]';
      if (res.status === 'OK') {
        icon = '\x1b[32m[ OK ]\x1b[0m';
        okCount++;
      } else if (res.status === 'WARN') {
        icon = '\x1b[33m[WARN]\x1b[0m';
        warnCount++;
      } else if (res.status === 'ERROR') {
        icon = '\x1b[31m[FAIL]\x1b[0m';
        errorCount++;
      } else if (res.status === 'FIXED') {
        icon = '\x1b[36m[FIXD]\x1b[0m';
        fixedCount++;
      }

      console.log(`${icon} ${res.name}: ${res.message}`);
      if (res.details && res.status !== 'OK') {
        console.log(`       -> Details: ${res.details}`);
      }
      if (res.fixError) {
        console.log(`       -> Fix Failed: ${res.fixError}`);
      }
    });

    console.log('\n----------------------------------------');
    console.log(`Summary: ${results.length} checks run | ${okCount} Passed | ${warnCount} Warnings | ${errorCount} Errors | ${fixedCount} Fixed`);
    console.log('----------------------------------------\n');

    if (errorCount > 0 && !options.fix) {
      console.log('Tip: Run "npm run doctor:fix" to automatically attempt repairs.\n');
    }
  }
}

module.exports = ReportPrinter;
