const StartupChecks = require("./StartupChecks");
const HealthPrinter = require("./HealthPrinter");

class BootManager {

    async boot() {

        const report = await StartupChecks.runChecks();

        HealthPrinter.print(report);

        return report;

    }

}

module.exports = new BootManager();
