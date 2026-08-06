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

        return report;

    }

}

module.exports = new BootManager();
