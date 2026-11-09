const DoctorEngine = require("../../doctor/DoctorEngine");
const path = require("path");

class BootManager {
    async boot() {
        console.log("\nRunning Doctor...\n");
        
        const engine = new DoctorEngine({
            fix: false,
            json: false,
            rootDir: path.resolve(__dirname, "../..")
        });
        
        engine.loadChecksFromDir(path.resolve(__dirname, "../../doctor/checks"));
        const results = await engine.runAll();
        
        const requiredIds = ['node', 'npm', 'browser', 'permissions', 'storage', 'memory', 'git'];
        const failedRequired = results.filter(r => requiredIds.includes(r.id) && r.status === 'ERROR');

        if (failedRequired.length > 0) {
            console.log("══════════════════════════════════════");
            for (const s of failedRequired) {
                console.log(`✖ ${s.name}`);
                if (s.message) console.log(`  ${s.message}`);
                if (s.details) console.log(`  ${s.details}`);
            }
            console.log("══════════════════════════════════════\n");
            console.log("Cannot start ONOFRIUS.\n");
            console.log("Run:\n");
            console.log("  npm run doctor --fix\n");
            process.exit(1);
        }

        results.forEach(r => {
            const mark = r.status === 'OK' ? '\x1b[32m✓\x1b[0m' : (r.status === 'WARN' ? '\x1b[33m⚠\x1b[0m' : '\x1b[31m✖\x1b[0m');
            console.log(`${mark} ${r.name}`);
        });

        const hasWarns = results.some(r => r.status === 'WARN');
        if (hasWarns) {
            console.log("\nSystem operational with minor warnings\n");
        } else {
            console.log("\nSystem READY\n");
        }
        
        console.log("Starting ONOFRIUS...\n");
        return results;
    }
}

module.exports = new BootManager();
