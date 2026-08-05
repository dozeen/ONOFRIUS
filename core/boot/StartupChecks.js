const fs = require("fs");
const axios = require("axios");

const config = require("../config");
const logger = require("../logger");

const HealthReport = require("./HealthReport");

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

        } else {

            report.warn(
                "AI Engine",
                "Unavailable"
            );

        }

    }

    catch {

        report.warn(
            "AI Engine",
            "Offline"
        );

    }

}

async function runChecks() {

    const report = new HealthReport();

    await checkFolders(report);

    await checkOllama(report);

    return report;

}

module.exports = {

    runChecks

};
