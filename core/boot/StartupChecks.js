const BrowserCheck =
    require("./checks/BrowserCheck");
const fs = require("fs");
const axios = require("axios");

const config = require("../config");
const logger = require("../logger");

const HealthReport = require("./HealthReport");
const ServiceRegistry = require("../services/ServiceRegistry");

async function checkFolders(report) {

    const folders = [
        "logs",
        "memory",
        "plugins",
        "personality"
    ];

    for (const folder of folders) {

        if (!fs.existsSync(folder)) {

            fs.mkdirSync(folder, {
                recursive: true
            });

            logger.info(
                "Startup",
                `Cartella creata: ${folder}`
            );

        }

    }

    report.ok("Storage");

    ServiceRegistry.register(
        "Storage",
        {
            status: "ONLINE"
        }
    );

}

async function checkOllama(report) {

    try {

        const r = await axios.get(
            `${config.ollama.host}/api/tags`,
            {
                timeout: 2000
            }
        );

        if (r.data.models) {

            report.ok("AI Engine");

            ServiceRegistry.register(
                "AI Engine",
                {
                    status: "ONLINE",
                    optional: true
                }
            );

        } else {

            report.warn(
                "AI Engine",
                "Unavailable"
            );

            ServiceRegistry.register(
                "AI Engine",
                {
                    status: "OFFLINE",
                    optional: true
                }
            );

        }

    } catch {

        report.warn(
            "AI Engine",
            "Offline"
        );

        ServiceRegistry.register(
            "AI Engine",
            {
                status: "OFFLINE",
                optional: true
            }
        );

    }

}

async function runChecks() {

    const report = new HealthReport();

    await checkFolders(report);

    BrowserCheck.run(report);

    await checkOllama(report);

    return report;

}

module.exports = {

    runChecks

};
