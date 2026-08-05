const fs = require("fs");
const axios = require("axios");
const config = require("./config");
const logger = require("./logger");

const health = {
    folders: true,
    ollama: false
};

function ensureFolder(folder) {

    if (!fs.existsSync(folder)) {

        fs.mkdirSync(folder, {
            recursive: true
        });

        logger.info("Startup", `Cartella creata: ${folder}`);

    }

}

async function checkFolders() {

    [
        "logs",
        "memory",
        "plugins",
        "personality"
    ].forEach(ensureFolder);

    logger.info("Startup", "✔ Cartelle OK");

    return true;

}

async function checkOllama() {

    try {

        const r = await axios.get(
            `${config.ollama.host}/api/tags`,
            {
                timeout: 2000
            }
        );

        if (r.data.models) {

            logger.info(
                "Startup",
                "✔ Ollama raggiungibile"
            );

            health.ollama = true;

        }

    }

    catch {

        logger.warn(
            "Startup",
            "AI Engine Offline"
        );

        health.ollama = false;

    }

    return true;

}

async function runChecks() {

    await checkFolders();

    await checkOllama();

    return health;

}

module.exports = {

    runChecks

};
