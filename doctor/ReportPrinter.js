class ReportPrinter {
  static print(results, options = {}) {
    let okCount = 0;
    let warnCount = 0;
    let errorCount = 0;
    let fixedCount = 0;

    results.forEach(res => {
      if (res.status === 'OK') okCount++;
      else if (res.status === 'WARN') warnCount++;
      else if (res.status === 'ERROR') errorCount++;
      else if (res.status === 'FIXED') fixedCount++;
    });

    let overallStatus = 'READY';
    if (errorCount > 0) overallStatus = 'FAILED';
    else if (warnCount > 0) overallStatus = 'WARNINGS';

    if (options.json) {
      const output = {
        timestamp: new Date().toISOString(),
        summary: {
          checks: results.length,
          ok: okCount,
          warnings: warnCount,
          errors: errorCount,
          fixed: fixedCount,
          status: overallStatus
        },
        results
      };
      console.log(JSON.stringify(output, null, 2));
      return;
    }

    console.log('\n========================================');
    console.log('       ONOFRIUS DOCTOR REPORT          ');
    console.log('========================================\n');

    if (results.length === 0) {
      console.log('No diagnostic checks were registered or matched the filter.\n');
      return;
    }

    // Print Status Box
    console.log('══════════════════════════════════════');
    console.log('STATUS');
    console.log(`\n${overallStatus}\n`);
    
    // Group services into required and optional
    const requiredIds = ['node', 'npm', 'browser', 'permissions', 'storage', 'memory', 'git'];
    const required = results.filter(r => requiredIds.includes(r.id));
    const optional = results.filter(r => !requiredIds.includes(r.id));

    if (required.length > 0) {
      console.log('Required services\n');
      required.forEach(r => {
        const mark = r.status === 'OK' ? '\x1b[32m✓\x1b[0m' : (r.status === 'WARN' ? '\x1b[33m⚠\x1b[0m' : '\x1b[31m✖\x1b[0m');
        console.log(`${mark} ${r.name}`);
      });
      console.log('');
    }

    if (optional.length > 0) {
      console.log('Optional services\n');
      optional.forEach(r => {
        const mark = r.status === 'OK' ? '\x1b[32m✓\x1b[0m' : (r.status === 'WARN' ? '\x1b[33m⚠\x1b[0m' : '\x1b[31m✖\x1b[0m');
        console.log(`${mark} ${r.name}`);
      });
      console.log('');
    }

    if (overallStatus === 'READY') {
      console.log('System healthy.');
    } else if (overallStatus === 'WARNINGS') {
      console.log('System operational with minor warnings.');
    } else {
      console.log('System requires attention/repair.');
    }
    console.log('══════════════════════════════════════\n');

    console.log('DETAILED DIAGNOSTICS:\n');

    results.forEach(res => {
      let icon = '[ ? ]';
      if (res.status === 'OK') {
        icon = '\x1b[32m[ OK ]\x1b[0m';
      } else if (res.status === 'WARN') {
        icon = '\x1b[33m[WARN]\x1b[0m';
      } else if (res.status === 'ERROR') {
        icon = '\x1b[31m[FAIL]\x1b[0m';
      } else if (res.status === 'FIXED') {
        icon = '\x1b[36m[FIXD]\x1b[0m';
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
    console.log(`Summary: ${results.length} check(s) run | ${okCount} Passed | ${warnCount} Warnings | ${errorCount} Errors | ${fixedCount} Fixed`);
    console.log('----------------------------------------\n');

    if (errorCount > 0 && !options.fix) {
      console.log('Tip: Run "npm run doctor:fix" to automatically attempt repairs.\n');
    }
  }
}

module.exports = ReportPrinter;
