const StartupChecks = require("./StartupChecks");
const HealthPrinter = require("./HealthPrinter");
const ServiceRegistry = require("../services/ServiceRegistry");

class BootManager {

    async boot() {

        const report = await StartupChecks.runChecks();

        ServiceRegistry.register("Kernel");
        ServiceRegistry.register("Storage");
        ServiceRegistry.register("Plugins");

        HealthPrinter.print(report);

const failed = report.services.filter(
    s => s.status === "ERROR"
);
        if (failed.length > 0) {

            console.log("");

            console.log("══════════════════════════════════════");
            console.log("        STARTUP ABORTED");
            console.log("══════════════════════════════════════");
            console.log("");

            for (const service of failed) {

                console.log(`✖ ${service.name}`);

                if (service.message) {
                    console.log(`  ${service.message}`);
                }

                console.log("");

            }

            process.exit(1);

        }

        return report;

    }

}

module.exports = new BootManager();
